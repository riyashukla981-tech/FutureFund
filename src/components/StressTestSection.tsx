import React, { useState } from 'react';
import { 
  CurrencyCode, 
  formatCurrency, 
  ScenarioInput, 
  ShockScenario, 
  simulateUniverses 
} from '../utils/financeMath';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingDown,
  Sparkles,
  Sliders
} from 'lucide-react';

interface StressTestSectionProps {
  baseInputs: ScenarioInput;
  currency: CurrencyCode;
}

const PRESET_SHOCKS: ShockScenario[] = [
  {
    id: 1,
    title: 'Income drops by 20% for 4 months',
    tag: 'Income Shock',
    description: 'Simulates a temporary furlough, delayed bonus, or market contraction.',
    incomeReductionPct: 20,
    incomeReductionDurationMonths: 4,
    lumpSumExpense: 0,
    expenseInflationPct: 0,
  },
  {
    id: 2,
    title: 'Emergency medical expense of ₹1,50,000',
    tag: 'Health Emergency',
    description: 'Sudden unexpected healthcare expense draining liquid capital at Month 2.',
    incomeReductionPct: 0,
    incomeReductionDurationMonths: 0,
    lumpSumExpense: 150000,
    expenseInflationPct: 0,
  },
  {
    id: 3,
    title: 'Monthly inflation spike (+15% expenses)',
    tag: 'Macro Inflation',
    description: 'Ongoing living expenses increase across groceries, rent, utilities.',
    incomeReductionPct: 0,
    incomeReductionDurationMonths: 0,
    lumpSumExpense: 0,
    expenseInflationPct: 15,
  },
  {
    id: 4,
    title: 'Loss of secondary consulting income',
    tag: 'Revenue Loss',
    description: 'Primary salary must cover full EMI without secondary freelance buffer.',
    incomeReductionPct: 30,
    incomeReductionDurationMonths: 6,
    lumpSumExpense: 0,
    expenseInflationPct: 0,
  },
];

export const StressTestSection: React.FC<StressTestSectionProps> = ({
  baseInputs,
  currency,
}) => {
  const [selectedShockId, setSelectedShockId] = useState<number>(1);
  const [customLumpSum, setCustomLumpSum] = useState<number>(100000);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const activeShock: ShockScenario = isCustom
    ? {
        id: 99,
        title: `Custom Shock: ${formatCurrency(customLumpSum, currency)} Emergency Outflow`,
        tag: 'Custom Shock',
        description: 'User-configured custom liquidity stress test.',
        incomeReductionPct: 0,
        incomeReductionDurationMonths: 0,
        lumpSumExpense: customLumpSum,
        expenseInflationPct: 0,
      }
    : PRESET_SHOCKS.find((s) => s.id === selectedShockId) || PRESET_SHOCKS[0];

  // Run dynamic simulation under this exact shock
  const stressed = simulateUniverses(baseInputs, activeShock);
  const { universeA, universeB, universeC } = stressed;

  // Evaluate status and buffer for each universe
  const getOutcome = (univ: typeof universeA) => {
    const minReserve = univ.minCashReserve;
    if (minReserve <= 0) {
      return {
        status: 'Critical',
        badgeClass: 'bg-[#ffdad6] text-[#93000a]',
        valueText: `-${formatCurrency(Math.abs(minReserve), currency)} Deficit`,
        valueClass: 'text-[#ba1a1a]',
        desc: `Cash-reserve depletion occurs in Month ${univ.minReserveMonth}; triggers emergency borrowing or overdraft penalty.`,
      };
    } else if (minReserve < baseInputs.monthlyExpenses * 2) {
      return {
        status: 'Warning',
        badgeClass: 'bg-[#ffd9dd] text-[#772738]',
        valueText: `+${formatCurrency(minReserve, currency)} Buffer`,
        valueClass: 'text-[#9a4152]',
        desc: `Survives shock but emergency buffer contracts below safe 2-month threshold.`,
      };
    } else {
      return {
        status: 'Stable',
        badgeClass: 'bg-[#e5eeff] text-[#0b1c30]',
        valueText: `+${formatCurrency(minReserve, currency)} Buffer`,
        valueClass: 'text-[#0b1c30]',
        desc: `Comfortably absorbs shock with healthy liquidity headroom remaining intact.`,
      };
    }
  };

  const outcomeA = getOutcome(universeA);
  const outcomeB = getOutcome(universeB);
  const outcomeC = getOutcome(universeC);

  return (
    <section id="stress-test" className="py-16 md:py-24 bg-[#eff4ff] border-b border-[#c5c6cd]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9a4152] font-semibold mb-2 block">
            Dynamic Resilience Testing
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
            What Happens When Life Doesn’t Go According to Plan?
          </h2>
          <p className="text-xs sm:text-sm text-[#44474d] mt-2">
            Select an unexpected exogenous shock to stress-test your balance sheet and evaluate which trajectory withstands real-world turbulence.
          </p>
        </div>

        {/* 4 Preset Shock Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
          {PRESET_SHOCKS.map((s) => {
            const isSelected = !isCustom && selectedShockId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setIsCustom(false);
                  setSelectedShockId(s.id);
                }}
                className={`p-4 rounded-xl text-left transition-all flex flex-col justify-between cursor-pointer border ${
                  isSelected
                    ? 'border-[#9a4152] bg-white shadow-md ring-1 ring-[#9a4152]'
                    : 'border-[#c5c6cd]/60 bg-white/70 hover:bg-white hover:border-[#c5c6cd]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-[#9a4152] font-bold">
                      Scenario 0{s.id}
                    </span>
                    <span className="text-[10px] font-mono text-[#75777e]">{s.tag}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#0b1c30] block">
                    {s.title}
                  </span>
                </div>
                <p className="text-[11px] text-[#44474d] mt-2 line-clamp-2">
                  {s.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Live Status Matrix Across Universe A, B, C */}
        <div className="bg-white rounded-xl border border-[#c5c6cd]/60 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-[#c5c6cd]/30 gap-3">
            <div>
              <span className="text-xs font-mono uppercase text-[#75777e] font-bold">Stress Ledger Output</span>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                Comparative Shock Resistance Matrix
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#44474d]">Active Trigger:</span>
              <span className="text-xs font-mono font-bold bg-[#e5eeff] text-[#0b1c30] px-3 py-1 rounded">
                {activeShock.title}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {/* Universe A Stress Outcome */}
            <div className="p-5 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-[#0b1c30]">
                  Universe A (Now)
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${outcomeA.badgeClass}`}>
                  {outcomeA.status}
                </span>
              </div>
              <div className={`text-xl font-mono font-bold ${outcomeA.valueClass}`}>
                {outcomeA.valueText}
              </div>
              <p className="text-xs text-[#44474d] leading-relaxed">
                {outcomeA.desc}
              </p>
            </div>

            {/* Universe B Stress Outcome */}
            <div className="p-5 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-[#0b1c30]">
                  Universe B (+6M)
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${outcomeB.badgeClass}`}>
                  {outcomeB.status}
                </span>
              </div>
              <div className={`text-xl font-mono font-bold ${outcomeB.valueClass}`}>
                {outcomeB.valueText}
              </div>
              <p className="text-xs text-[#44474d] leading-relaxed">
                {outcomeB.desc}
              </p>
            </div>

            {/* Universe C Stress Outcome */}
            <div className="p-5 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-[#0b1c30]">
                  Universe C (Optimized)
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${outcomeC.badgeClass}`}>
                  {outcomeC.status}
                </span>
              </div>
              <div className={`text-xl font-mono font-bold ${outcomeC.valueClass}`}>
                {outcomeC.valueText}
              </div>
              <p className="text-xs text-[#44474d] leading-relaxed">
                {outcomeC.desc}
              </p>
            </div>
          </div>

          {/* Analytical Takeaway Box */}
          <div className="p-4 rounded-lg bg-[#e5eeff] border border-[#c5c6cd]/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#9a4152] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#0b1c30] leading-relaxed">
              <strong>Quantitative System Finding:</strong> Under {activeShock.title.toLowerCase()}, Universe A experiences maximum vulnerability with a {outcomeA.valueText} dip, whereas Universe B and Universe C preserve {outcomeB.valueText} and {outcomeC.valueText} in liquid safety, proving the massive resilience of strategic pacing or upfront principal reduction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
