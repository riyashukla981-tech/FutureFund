import React from 'react';
import { 
  CurrencyCode, 
  formatCurrency, 
  ScenarioInput, 
  UniverseResult,
  evaluateAutoPivot 
} from '../utils/financeMath';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  SlidersHorizontal,
  Calendar,
  Wallet
} from 'lucide-react';

interface AutoPivotSectionProps {
  inputs: ScenarioInput;
  universeA: UniverseResult;
  currency: CurrencyCode;
  onApplyPivot: (newInputs: Partial<ScenarioInput>, message: string) => void;
}

export const AutoPivotSection: React.FC<AutoPivotSectionProps> = ({
  inputs,
  universeA,
  currency,
  onApplyPivot,
}) => {
  const pivot = evaluateAutoPivot(inputs, universeA);
  const currentRunway = (inputs.currentSavings / Math.max(1, inputs.monthlyExpenses)).toFixed(1);

  return (
    <section id="auto-pivot" className="py-16 md:py-24 bg-white border-b border-[#c5c6cd]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd9dd]/30 text-[#9a4152] font-mono text-xs uppercase font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithmic Counter-Measure Engine</span>
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
            Don’t Just See the Risk. Fix It.
          </h2>
          <p className="text-xs sm:text-sm text-[#44474d] mt-2">
            FutureFund automatically crafts mathematical pivots to restructure your financing when safety thresholds are breached.
          </p>
        </div>

        {/* Before & After Comparison Layout */}
        <div className="max-w-4xl mx-auto bg-[#eff4ff] rounded-xl border border-[#c5c6cd]/40 p-6 md:p-9 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-[#c5c6cd]/30 gap-3">
            <div>
              <span className="text-xs font-mono uppercase font-bold text-[#75777e]">
                Evaluated Target Commitment:
              </span>
              <div className="text-lg font-bold text-[#0b1c30] mt-0.5">
                Commitment: {formatCurrency(inputs.loanAmount, currency)} ({inputs.interestRate}% APR)
              </div>
            </div>

            <div className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
              pivot.needed
                ? 'bg-[#ffdad6] text-[#93000a]'
                : 'bg-[#e5eeff] text-[#0b1c30]'
            }`}>
              {pivot.needed ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{pivot.violatedThreshold}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* CURRENT PLAN */}
            <div className="p-6 rounded-xl bg-white border border-[#9a4152]/30 space-y-4 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-[#9a4152]">
                    Current Baseline Plan
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    universeA.riskTier === 'Critical'
                      ? 'bg-[#ffdad6] text-[#93000a]'
                      : 'bg-[#ffd9dd] text-[#772738]'
                  }`}>
                    {universeA.riskTier}
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#0b1c30] mb-1.5">
                  Immediate Execution (Universe A)
                </h4>
                <p className="text-xs text-[#44474d] leading-relaxed">
                  {pivot.problemSummary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#c5c6cd]/30 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#44474d]">Lowest Emergency Buffer:</span>
                  <span className="font-bold text-[#9a4152]">
                    {formatCurrency(universeA.minCashReserve, currency)} (Month {universeA.minReserveMonth})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474d]">Initial Safety Runway:</span>
                  <span className="font-bold text-[#0b1c30]">{currentRunway} Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474d]">Monthly Debt Outflow:</span>
                  <span className="font-bold text-[#0b1c30]">{formatCurrency(universeA.emi, currency)}/mo</span>
                </div>
              </div>
            </div>

            {/* AUTO-PIVOT RECOMMENDATION */}
            <div className="p-6 rounded-xl bg-[#e5eeff] border border-[#0d1c32]/30 space-y-4 flex flex-col justify-between relative shadow-xs">
              <div className="absolute top-0 right-0 bg-[#0d1c32] text-white px-3 py-0.5 rounded-bl-lg text-[10px] font-mono uppercase font-bold">
                Auto-Engine Solution
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-[#0b1c30]">
                    Calculated Course-Correction
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-[#0b1c30]">
                    Sustainable
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#0b1c30] mb-2">
                  Recommended Pivots
                </h4>

                <div className="space-y-3">
                  {/* Option 1 */}
                  <div className="p-3 bg-white rounded-lg border border-[#c5c6cd]/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#9a4152]" />
                        {pivot.option1Title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#44474d] mb-2 leading-relaxed">
                      {pivot.option1Desc}
                    </p>
                    {pivot.needed && (
                      <button
                        onClick={() => onApplyPivot(pivot.option1Changes, 'Applied Delay Pivot: Built buffer before commitment.')}
                        className="w-full py-1.5 px-2 rounded bg-[#0d1c32] hover:bg-black text-white text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Apply Delay Pivot to Simulation</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Option 2 */}
                  <div className="p-3 bg-white rounded-lg border border-[#c5c6cd]/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-[#515f78]" />
                        {pivot.option2Title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#44474d] mb-2 leading-relaxed">
                      {pivot.option2Desc}
                    </p>
                    {pivot.needed && (
                      <button
                        onClick={() => onApplyPivot(pivot.option2Changes, 'Applied Down Payment Pivot: Compressed loan principal.')}
                        className="w-full py-1.5 px-2 rounded bg-white border border-[#0d1c32] hover:bg-[#eff4ff] text-[#0b1c30] text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Apply Down Payment Pivot</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#c5c6cd]/40 text-xs font-mono text-[#0b1c30] flex justify-between">
                <span>Projected Runway After Pivot:</span>
                <strong className="text-[#0d1c32]">
                  {pivot.needed ? `${pivot.expectedRunwayGainMonths} Months` : `${currentRunway} Months`}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
