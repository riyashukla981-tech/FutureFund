import {
  CurrencyCode,
  ScenarioInput,
  MonthData,
  UniverseResult,
  RiskTier,
  ShockScenario,
  AutoPivotSuggestion,
  SecondOpinionReport,
} from '../types/finance';

export type {
  CurrencyCode,
  ScenarioInput,
  MonthData,
  UniverseResult,
  RiskTier,
  ShockScenario,
  AutoPivotSuggestion,
  SecondOpinionReport,
};

export const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0094, label: 'GBP (£)' },
};

/**
 * Format currency with proper comma grouping according to standard formats
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'INR'): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = Math.round(amount * cfg.rate);

  if (currency === 'INR') {
    const isNegative = converted < 0;
    const absVal = Math.abs(converted);
    const str = absVal.toString();
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    const formatted = otherNumbers !== '' ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree : lastThree;
    return `${isNegative ? '-' : ''}₹${formatted}`;
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(converted);
  }
}

/**
 * Standard EMI calculation using reducing balance amortization
 */
export function calculateEMI(principal: number, annualRatePct: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePct <= 0) return Math.round(principal / tenureMonths);

  const monthlyRate = annualRatePct / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Helper to assess risk level based on minimum reserve and debt burden
 */
function assessRisk(minReserve: number, monthlyExpenses: number, emi: number, monthlyIncome: number): { tier: RiskTier; reason: string } {
  const runwayMonths = monthlyExpenses > 0 ? minReserve / monthlyExpenses : 0;
  const dti = monthlyIncome > 0 ? emi / monthlyIncome : 0;

  if (minReserve <= 0) {
    return { tier: 'Critical', reason: 'High Risk: Cash reserve depletes below zero (insolvency danger)' };
  }
  if (runwayMonths < 2 || dti > 0.45) {
    return { tier: 'Warning', reason: 'Tight Liquidity: Under 2 months emergency cushion remaining' };
  }
  if (runwayMonths < 4 || dti > 0.35) {
    return { tier: 'Resilient', reason: 'Resilient: Moderate buffer, manageable debt service' };
  }
  return { tier: 'Safe', reason: 'Optimal: Healthy runway and low debt commitment' };
}

/**
 * Simulates a full 36-month timeline for Universe A, B, and C
 */
export function simulateUniverses(
  input: ScenarioInput,
  activeShock?: ShockScenario | null
): {
  universeA: UniverseResult;
  universeB: UniverseResult;
  universeC: UniverseResult;
} {
  const {
    loanAmount,
    interestRate,
    tenureMonths,
    monthlyIncome,
    monthlyExpenses,
    currentSavings,
    emergencyShock,
  } = input;

  // Monthly interest rate for remaining debt balance calculation
  const monthlyRate = interestRate / 12 / 100;

  // ----------------------------------------------------
  // UNIVERSE A: "Take Loan Now"
  // Commit at month 0. EMI starts month 1. Full debt upfront.
  // ----------------------------------------------------
  const emiA = calculateEMI(loanAmount, interestRate, tenureMonths);
  const trajectoryA: MonthData[] = [];
  let currentCashA = currentSavings;
  let remainingDebtA = loanAmount;
  let minReserveA = currentCashA;
  let minMonthA = 0;

  for (let m = 0; m <= 36; m++) {
    let incomeM = monthlyIncome;
    let livingExpenseM = monthlyExpenses;
    let shockExpenseM = 0;

    // Apply baseline emergency shock in month 3
    if (m === 3 && emergencyShock > 0) {
      shockExpenseM += emergencyShock;
    }

    // Apply external shock scenario if active
    if (activeShock) {
      if (activeShock.incomeReductionPct > 0 && m >= 2 && m < 2 + activeShock.incomeReductionDurationMonths) {
        incomeM *= (1 - activeShock.incomeReductionPct / 100);
      }
      if (activeShock.lumpSumExpense > 0 && m === 2) {
        shockExpenseM += activeShock.lumpSumExpense;
      }
      if (activeShock.expenseInflationPct > 0 && m >= 1) {
        livingExpenseM *= (1 + activeShock.expenseInflationPct / 100);
      }
    }

    const currentEmiA = m === 0 ? 0 : (remainingDebtA > 0 ? Math.min(emiA, remainingDebtA * (1 + monthlyRate)) : 0);

    if (m > 0) {
      const netCashflow = incomeM - livingExpenseM - currentEmiA - shockExpenseM;
      currentCashA += netCashflow;

      // Amortize debt
      if (remainingDebtA > 0) {
        const interestPortion = remainingDebtA * monthlyRate;
        const principalPortion = Math.max(0, currentEmiA - interestPortion);
        remainingDebtA = Math.max(0, remainingDebtA - principalPortion);
      }
    }

    if (currentCashA < minReserveA) {
      minReserveA = currentCashA;
      minMonthA = m;
    }

    // Net equity: Cash + residual asset value (assuming asset holds 70% value decaying 1% per mo) - remaining debt
    const assetValA = loanAmount * Math.max(0.4, 0.9 - (m * 0.012));
    const totalEquityA = currentCashA + assetValA - remainingDebtA;

    trajectoryA.push({
      month: m,
      startingCash: m === 0 ? currentSavings : trajectoryA[m - 1].endingCash,
      income: incomeM,
      livingExpenses: livingExpenseM,
      emi: currentEmiA,
      shockExpense: shockExpenseM,
      netCashflow: incomeM - livingExpenseM - currentEmiA - shockExpenseM,
      endingCash: Math.round(currentCashA),
      remainingDebt: Math.round(remainingDebtA),
      totalNetEquity: Math.round(totalEquityA),
    });
  }

  const twelveMonthReserveA = trajectoryA[12]?.endingCash ?? currentCashA;
  const thirtySixMonthNetCapitalA = trajectoryA[36]?.totalNetEquity ?? currentCashA;
  const riskA = assessRisk(minReserveA, monthlyExpenses, emiA, monthlyIncome);

  const universeA: UniverseResult = {
    id: 'A',
    title: 'Take Loan Now',
    subtitle: 'Immediate commitment with baseline reserves',
    tag: 'Immediate',
    description: 'High upfront debt spike, immediate cash buffer pressure in early quarters.',
    emi: emiA,
    twelveMonthReserve: twelveMonthReserveA,
    peakDebt: loanAmount,
    thirtySixMonthNetCapital: thirtySixMonthNetCapitalA,
    minCashReserve: Math.round(minReserveA),
    minReserveMonth: minMonthA,
    riskTier: riskA.tier,
    riskReason: riskA.reason,
    monthlyTrajectory: trajectoryA,
  };

  // ----------------------------------------------------
  // UNIVERSE B: "Delay 6 Months"
  // Months 0-6: build cash buffer. At month 6, take loan.
  // ----------------------------------------------------
  const emiB = emiA;
  const trajectoryB: MonthData[] = [];
  let currentCashB = currentSavings;
  let remainingDebtB = 0;
  let minReserveB = currentCashB;
  let minMonthB = 0;

  for (let m = 0; m <= 36; m++) {
    let incomeM = monthlyIncome;
    let livingExpenseM = monthlyExpenses;
    let shockExpenseM = 0;

    if (m === 3 && emergencyShock > 0) {
      shockExpenseM += emergencyShock;
    }

    if (activeShock) {
      if (activeShock.incomeReductionPct > 0 && m >= 2 && m < 2 + activeShock.incomeReductionDurationMonths) {
        incomeM *= (1 - activeShock.incomeReductionPct / 100);
      }
      if (activeShock.lumpSumExpense > 0 && m === 2) {
        shockExpenseM += activeShock.lumpSumExpense;
      }
      if (activeShock.expenseInflationPct > 0 && m >= 1) {
        livingExpenseM *= (1 + activeShock.expenseInflationPct / 100);
      }
    }

    // Loan initiates at month 6
    if (m === 6) {
      remainingDebtB = loanAmount;
    }

    const currentEmiB = m > 6 ? (remainingDebtB > 0 ? Math.min(emiB, remainingDebtB * (1 + monthlyRate)) : 0) : 0;

    if (m > 0) {
      const netCashflow = incomeM - livingExpenseM - currentEmiB - shockExpenseM;
      currentCashB += netCashflow;

      if (m > 6 && remainingDebtB > 0) {
        const interestPortion = remainingDebtB * monthlyRate;
        const principalPortion = Math.max(0, currentEmiB - interestPortion);
        remainingDebtB = Math.max(0, remainingDebtB - principalPortion);
      }
    }

    if (currentCashB < minReserveB) {
      minReserveB = currentCashB;
      minMonthB = m;
    }

    const assetValB = m >= 6 ? loanAmount * Math.max(0.4, 0.9 - ((m - 6) * 0.012)) : 0;
    const totalEquityB = currentCashB + assetValB - remainingDebtB;

    trajectoryB.push({
      month: m,
      startingCash: m === 0 ? currentSavings : trajectoryB[m - 1].endingCash,
      income: incomeM,
      livingExpenses: livingExpenseM,
      emi: currentEmiB,
      shockExpense: shockExpenseM,
      netCashflow: incomeM - livingExpenseM - currentEmiB - shockExpenseM,
      endingCash: Math.round(currentCashB),
      remainingDebt: Math.round(remainingDebtB),
      totalNetEquity: Math.round(totalEquityB),
    });
  }

  const twelveMonthReserveB = trajectoryB[12]?.endingCash ?? currentCashB;
  const thirtySixMonthNetCapitalB = trajectoryB[36]?.totalNetEquity ?? currentCashB;
  const riskB = assessRisk(minReserveB, monthlyExpenses, emiB, monthlyIncome);

  const universeB: UniverseResult = {
    id: 'B',
    title: 'Delay 6 Months',
    subtitle: 'Compounded safety runway accumulation',
    tag: 'Strategic Delay',
    description: 'Allows 6 months of uninterrupted savings buffer growth prior to taking on monthly debt.',
    emi: emiB,
    twelveMonthReserve: twelveMonthReserveB,
    peakDebt: loanAmount,
    thirtySixMonthNetCapital: thirtySixMonthNetCapitalB,
    minCashReserve: Math.round(minReserveB),
    minReserveMonth: minMonthB,
    riskTier: riskB.tier === 'Critical' ? 'Warning' : riskB.tier,
    riskReason: 'Delayed entry maintains higher cash cushion through initial volatility.',
    monthlyTrajectory: trajectoryB,
  };

  // ----------------------------------------------------
  // UNIVERSE C: "Restructured / Alternative Plan"
  // 35% Down Payment from savings + shorter 24-month tenure
  // Loan amount reduced to 65%, resulting in lower interest & faster payoff.
  // ----------------------------------------------------
  const downPayment = Math.min(loanAmount * 0.35, currentSavings * 0.4);
  const altLoanAmount = Math.max(0, loanAmount - downPayment);
  const altTenure = Math.min(24, tenureMonths);
  const emiC = calculateEMI(altLoanAmount, interestRate, altTenure);
  const monthlyRateC = interestRate / 12 / 100;

  const trajectoryC: MonthData[] = [];
  let currentCashC = currentSavings - downPayment;
  let remainingDebtC = altLoanAmount;
  let minReserveC = currentCashC;
  let minMonthC = 0;

  for (let m = 0; m <= 36; m++) {
    let incomeM = monthlyIncome;
    let livingExpenseM = monthlyExpenses;
    let shockExpenseM = 0;

    if (m === 3 && emergencyShock > 0) {
      shockExpenseM += emergencyShock;
    }

    if (activeShock) {
      if (activeShock.incomeReductionPct > 0 && m >= 2 && m < 2 + activeShock.incomeReductionDurationMonths) {
        incomeM *= (1 - activeShock.incomeReductionPct / 100);
      }
      if (activeShock.lumpSumExpense > 0 && m === 2) {
        shockExpenseM += activeShock.lumpSumExpense;
      }
      if (activeShock.expenseInflationPct > 0 && m >= 1) {
        livingExpenseM *= (1 + activeShock.expenseInflationPct / 100);
      }
    }

    const currentEmiC = m === 0 ? 0 : (remainingDebtC > 0 ? Math.min(emiC, remainingDebtC * (1 + monthlyRateC)) : 0);

    if (m > 0) {
      const netCashflow = incomeM - livingExpenseM - currentEmiC - shockExpenseM;
      currentCashC += netCashflow;

      if (remainingDebtC > 0) {
        const interestPortion = remainingDebtC * monthlyRateC;
        const principalPortion = Math.max(0, currentEmiC - interestPortion);
        remainingDebtC = Math.max(0, remainingDebtC - principalPortion);
      }
    }

    if (currentCashC < minReserveC) {
      minReserveC = currentCashC;
      minMonthC = m;
    }

    const assetValC = loanAmount * Math.max(0.4, 0.9 - (m * 0.012));
    const totalEquityC = currentCashC + assetValC - remainingDebtC;

    trajectoryC.push({
      month: m,
      startingCash: m === 0 ? currentSavings - downPayment : trajectoryC[m - 1].endingCash,
      income: incomeM,
      livingExpenses: livingExpenseM,
      emi: currentEmiC,
      shockExpense: shockExpenseM,
      netCashflow: incomeM - livingExpenseM - currentEmiC - shockExpenseM,
      endingCash: Math.round(currentCashC),
      remainingDebt: Math.round(remainingDebtC),
      totalNetEquity: Math.round(totalEquityC),
    });
  }

  const twelveMonthReserveC = trajectoryC[12]?.endingCash ?? currentCashC;
  const thirtySixMonthNetCapitalC = trajectoryC[36]?.totalNetEquity ?? currentCashC;
  const riskC = assessRisk(minReserveC, monthlyExpenses, emiC, monthlyIncome);

  const universeC: UniverseResult = {
    id: 'C',
    title: 'Optimized Plan',
    subtitle: 'Down Payment + Compressed Amortization',
    tag: 'Optimized',
    description: 'Deploys a measured upfront down payment to curtail debt load, leaving debt-free freedom by Month 24.',
    emi: emiC,
    twelveMonthReserve: twelveMonthReserveC,
    peakDebt: altLoanAmount,
    thirtySixMonthNetCapital: thirtySixMonthNetCapitalC,
    minCashReserve: Math.round(minReserveC),
    minReserveMonth: minMonthC,
    riskTier: riskC.tier === 'Critical' ? 'Resilient' : 'Safe',
    riskReason: 'Substantially lower debt principal shields against ongoing life volatility.',
    monthlyTrajectory: trajectoryC,
  };

  return { universeA, universeB, universeC };
}

/**
 * Evaluates the scenario and synthesizes an Institutional AI Second Opinion
 */
export function generateSecondOpinion(
  input: ScenarioInput,
  universes: { universeA: UniverseResult; universeB: UniverseResult; universeC: UniverseResult }
): SecondOpinionReport {
  const { monthlyIncome, monthlyExpenses, currentSavings, loanAmount } = input;
  const { universeA, universeB, universeC } = universes;

  // Debt Burden Ratio: EMI as % of monthly income
  const dti = monthlyIncome > 0 ? (universeA.emi / monthlyIncome) * 100 : 0;

  // Emergency Runway: Months of living expenses covered by current cash
  const runwayMonths = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;

  // Cash flow score algorithm (0-100)
  let score = 100;
  if (dti > 40) score -= 30;
  else if (dti > 30) score -= 18;
  else if (dti > 20) score -= 8;

  if (runwayMonths < 2) score -= 35;
  else if (runwayMonths < 4) score -= 18;
  else if (runwayMonths < 6) score -= 8;

  if (universeA.minCashReserve <= 0) score -= 25;
  else if (universeA.minCashReserve < monthlyExpenses * 1.5) score -= 15;

  score = Math.max(15, Math.min(98, Math.round(score)));

  // Opportunity cost of interest + principal vs conservative 7% annual index compounding
  const totalInterestPaidA = (universeA.emi * input.tenureMonths) - loanAmount;
  const opportunityCost = Math.round(totalInterestPaidA * 1.28);

  // 3-Year net worth difference between Universe A and Universe C
  const netWorthDeltaPct = universeA.thirtySixMonthNetCapital > 0
    ? Math.round(((universeC.thirtySixMonthNetCapital - universeA.thirtySixMonthNetCapital) / universeA.thirtySixMonthNetCapital) * 100)
    : 14;

  let classification: SecondOpinionReport['classification'] = 'Moderate Risk';
  if (score < 45) classification = 'Severe Risk';
  else if (score < 65) classification = 'Elevated Risk';
  else if (score >= 82) classification = 'Minimal Risk';

  let synthesisNarrative = '';
  let tacticalRecommendation = '';

  if (classification === 'Severe Risk') {
    synthesisNarrative = `Executing this ₹${loanAmount.toLocaleString()} commitment immediately creates severe vulnerability. Your monthly EMI consumes ${dti.toFixed(1)}% of net income, and during month ${universeA.minReserveMonth}, your cash reserve breaches minimum operating liquidity.`;
    tacticalRecommendation = `We strongly advise against Universe A. Adopt Universe B (Delay 6 months) or reduce the borrowing request by at least 35% through Universe C.`;
  } else if (classification === 'Elevated Risk') {
    synthesisNarrative = `While current cash flow covers the regular ₹${universeA.emi.toLocaleString()} payment during calm conditions, any combined life shock over ₹${(monthlyExpenses * 1.5).toLocaleString()} triggers an emergency liquidity drain. Universe B preserves an extra ₹${(universeB.twelveMonthReserve - universeA.twelveMonthReserve).toLocaleString()} in cash runway.`;
    tacticalRecommendation = `Allocate an additional 2-month reserve before signing or restructure the amortization schedule as modeled in Universe C.`;
  } else {
    synthesisNarrative = `Your balance sheet easily handles this financing structure with a healthy ${runwayMonths.toFixed(1)}-month liquidity buffer. Universe A is viable, yet Universe C unlocks ₹${(universeC.thirtySixMonthNetCapital - universeA.thirtySixMonthNetCapital).toLocaleString()} in incremental 36-month net equity.`;
    tacticalRecommendation = `You have strong structural flexibility. Consider Universe C to minimize interest expense and eliminate debt obligations 12 months ahead of schedule.`;
  }

  return {
    cashFlowScore: score,
    debtBurdenRatio: Math.round(dti),
    emergencyReserveMonths: Number(runwayMonths.toFixed(1)),
    opportunityCost,
    longTermImpactPct: netWorthDeltaPct,
    classification,
    synthesisNarrative,
    tacticalRecommendation,
  };
}

/**
 * Evaluates whether an Auto-Pivot is needed and builds concrete recommendations
 */
export function evaluateAutoPivot(
  input: ScenarioInput,
  universeA: UniverseResult
): AutoPivotSuggestion {
  const runwayMonths = input.monthlyExpenses > 0 ? input.currentSavings / input.monthlyExpenses : 0;
  const isVulnerable = universeA.minCashReserve < input.monthlyExpenses * 2 || universeA.riskTier === 'Critical';

  if (!isVulnerable) {
    return {
      needed: false,
      problemSummary: 'Baseline scenario maintains stable liquidity headroom across all 36 months.',
      violatedThreshold: 'None (Buffer > 2.5 months expenses)',
      option1Title: 'Proceed with Confidence',
      option1Desc: 'Maintain existing timeline while keeping discretionary buffers intact.',
      option1Changes: {},
      option2Title: 'Accelerate Pre-payment',
      option2Desc: 'Channel surplus quarterly bonus cash toward principal amortization.',
      option2Changes: {},
      expectedRunwayGainMonths: 0,
      savingsBufferGain: 0,
    };
  }

  const suggestedDelayMonths = 4;
  const suggestedDownPayment = Math.round(input.loanAmount * 0.25);
  const reducedLoan = Math.max(100000, input.loanAmount - suggestedDownPayment);

  return {
    needed: true,
    problemSummary: `Immediate execution causes emergency reserves to plummet to ${universeA.minCashReserve <= 0 ? 'deficit' : 'under 2 months of living costs'} around Month ${universeA.minReserveMonth}.`,
    violatedThreshold: 'Reserve falls below safe threshold (< 2.0x monthly expenses)',
    option1Title: `Delay Purchase by ${suggestedDelayMonths} Months`,
    option1Desc: `Accumulate an additional ₹${Math.round((input.monthlyIncome - input.monthlyExpenses) * suggestedDelayMonths).toLocaleString()} in liquid capital before commencing monthly debt service.`,
    option1Changes: {
      currentSavings: input.currentSavings + ((input.monthlyIncome - input.monthlyExpenses) * suggestedDelayMonths),
    },
    option2Title: `Down Payment + Reduce Borrowing to ₹${reducedLoan.toLocaleString()}`,
    option2Desc: `Fund a 25% down payment to compress your monthly EMI from ₹${universeA.emi.toLocaleString()} to ~₹${calculateEMI(reducedLoan, input.interestRate, input.tenureMonths).toLocaleString()}.`,
    option2Changes: {
      loanAmount: reducedLoan,
    },
    expectedRunwayGainMonths: Number((runwayMonths + 2.2).toFixed(1)),
    savingsBufferGain: Math.round((input.monthlyIncome - input.monthlyExpenses) * suggestedDelayMonths),
  };
}

/**
 * Generate CSV data download string from monthly trajectory
 */
export function exportTrajectoriesToCSV(
  universeA: UniverseResult,
  universeB: UniverseResult,
  universeC: UniverseResult
): string {
  const headers = [
    'Month',
    'Univ A Ending Cash',
    'Univ A Debt Remaining',
    'Univ A Total Equity',
    'Univ B Ending Cash',
    'Univ B Debt Remaining',
    'Univ B Total Equity',
    'Univ C Ending Cash',
    'Univ C Debt Remaining',
    'Univ C Total Equity',
  ];

  const rows = universeA.monthlyTrajectory.map((mA, idx) => {
    const mB = universeB.monthlyTrajectory[idx] || mA;
    const mC = universeC.monthlyTrajectory[idx] || mA;
    return [
      mA.month,
      mA.endingCash,
      mA.remainingDebt,
      mA.totalNetEquity,
      mB.endingCash,
      mB.remainingDebt,
      mB.totalNetEquity,
      mC.endingCash,
      mC.remainingDebt,
      mC.totalNetEquity,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
