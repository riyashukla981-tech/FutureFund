export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromINR: number; // Multiplier from INR base
  label: string;
}

export interface ScenarioInput {
  loanAmount: number;
  interestRate: number; // Annual %
  tenureMonths: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  emergencyShock: number;
}

export interface MonthData {
  month: number;
  startingCash: number;
  income: number;
  livingExpenses: number;
  emi: number;
  shockExpense: number;
  netCashflow: number;
  endingCash: number;
  remainingDebt: number;
  totalNetEquity: number;
}

export type RiskTier = 'Safe' | 'Resilient' | 'Warning' | 'Critical';

export interface UniverseResult {
  id: 'A' | 'B' | 'C';
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  emi: number;
  twelveMonthReserve: number;
  peakDebt: number;
  thirtySixMonthNetCapital: number;
  minCashReserve: number;
  minReserveMonth: number;
  riskTier: RiskTier;
  riskReason: string;
  monthlyTrajectory: MonthData[];
}

export interface ShockScenario {
  id: number;
  title: string;
  description: string;
  tag: string;
  incomeReductionPct: number; // e.g. 20 for 20%
  incomeReductionDurationMonths: number;
  lumpSumExpense: number;
  expenseInflationPct: number; // e.g. 15 for 15%
}

export interface AutoPivotSuggestion {
  needed: boolean;
  problemSummary: string;
  violatedThreshold: string;
  option1Title: string;
  option1Desc: string;
  option1Changes: Partial<ScenarioInput>;
  option2Title: string;
  option2Desc: string;
  option2Changes: Partial<ScenarioInput>;
  expectedRunwayGainMonths: number;
  savingsBufferGain: number;
}

export interface SecondOpinionReport {
  cashFlowScore: number; // 0-100
  debtBurdenRatio: number; // % of income taken by EMI
  emergencyReserveMonths: number;
  opportunityCost: number; // Compounded wealth missed
  longTermImpactPct: number; // 3Y net worth delta
  classification: 'Minimal Risk' | 'Moderate Risk' | 'Elevated Risk' | 'Severe Risk';
  synthesisNarrative: string;
  tacticalRecommendation: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  timestamp: number;
  inputs: ScenarioInput;
  results: {
    emiA: number;
    reserveA: number;
    netWorthA: number;
    emiB: number;
    reserveB: number;
    netWorthB: number;
    emiC: number;
    reserveC: number;
    netWorthC: number;
  };
}
