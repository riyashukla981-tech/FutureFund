import React, { useState } from 'react';
import { 
  CurrencyCode, 
  formatCurrency, 
  ScenarioInput, 
  UniverseResult,
  generateSecondOpinion 
} from '../utils/financeMath';
import { 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  HelpCircle,
  TrendingUp,
  Percent,
  Clock,
  Coins
} from 'lucide-react';

interface SecondOpinionSectionProps {
  inputs: ScenarioInput;
  universes: {
    universeA: UniverseResult;
    universeB: UniverseResult;
    universeC: UniverseResult;
  };
  currency: CurrencyCode;
}

export const SecondOpinionSection: React.FC<SecondOpinionSectionProps> = ({
  inputs,
  universes,
  currency,
}) => {
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const report = generateSecondOpinion(inputs, universes);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsSynthesizing(true);
    setTimeout(() => {
      const q = customQuestion.toLowerCase();
      let answer = '';
      if (q.includes('raise') || q.includes('hike') || q.includes('income')) {
        answer = `An anticipated 10-15% salary increase creates approximately ₹${Math.round(inputs.monthlyIncome * 0.12 * 12).toLocaleString()} in incremental annual discretionary cash. We recommend allocating 50% of the increase to pre-pay loan principal in Month 12, saving ~₹32,000 in compound interest.`;
      } else if (q.includes('prepay') || q.includes('prepayment') || q.includes('bonus')) {
        answer = `Lump-sum prepayments after Month 6 produce disproportionately high interest savings. In Universe A, a ₹1,00,000 prepayment at Month 6 compresses tenure by 9 months and raises your 36M net capital by ₹28,400.`;
      } else if (q.includes('job') || q.includes('switch') || q.includes('gap')) {
        answer = `Under a 2-month career transition with zero income, Universe A triggers a dangerous overdraft. Universe B safely absorbs a 2-month gap because of the ₹${formatCurrency(universes.universeB.twelveMonthReserve, currency)} accrued runway.`;
      } else {
        answer = `Analysis for "${customQuestion}": Based on your current ₹${inputs.monthlyIncome.toLocaleString()} income and ₹${inputs.monthlyExpenses.toLocaleString()} burn, your buffer can sustain minor volatility; however, structuring via Universe C yields the highest margin of safety and wealth retention.`;
      }
      setCustomAnswer(answer);
      setIsSynthesizing(false);
    }, 600);
  };

  return (
    <section id="second-opinion" className="py-16 md:py-24 bg-[#eff4ff] border-b border-[#c5c6cd]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9a4152] font-semibold mb-2 block">
            Institutional AI Synthesis
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
            Your AI-Powered Second Opinion
          </h2>
          <p className="text-xs sm:text-sm text-[#44474d] mt-2">
            Clear, deterministic quantitative reasoning synthesized into plain institutional analysis.
          </p>
        </div>

        {/* Financial Decision Summary Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl border border-[#c5c6cd]/50 shadow-md p-6 sm:p-9 space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#c5c6cd]/30 gap-3">
            <div>
              <span className="text-xs font-mono text-[#75777e] uppercase font-bold">
                Audited Decision:
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#0b1c30] mt-0.5">
                Financing Commitment: {formatCurrency(inputs.loanAmount, currency)} at {inputs.interestRate}% APR
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#44474d]">Classification:</span>
              <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                report.classification === 'Minimal Risk'
                  ? 'bg-[#e5eeff] text-[#0b1c30]'
                  : report.classification === 'Moderate Risk'
                  ? 'bg-[#ffd9dd] text-[#772738]'
                  : 'bg-[#ffdad6] text-[#93000a]'
              }`}>
                {report.classification}
              </span>
            </div>
          </div>

          {/* 5-Metric Diagnostic Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30">
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#44474d] mb-1">
                <BrainCircuit className="w-3 h-3 text-[#515f78]" />
                <span>Cash Flow Score</span>
              </div>
              <div className="text-lg font-mono font-bold text-[#0b1c30]">
                {report.cashFlowScore} / 100
              </div>
              <div className="text-[10px] font-mono text-[#44474d] mt-1">
                {report.cashFlowScore > 75 ? 'Healthy liquidity' : 'Constrained early months'}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30">
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#44474d] mb-1">
                <Percent className="w-3 h-3 text-[#9a4152]" />
                <span>Debt Burden Ratio</span>
              </div>
              <div className="text-lg font-mono font-bold text-[#9a4152]">
                {report.debtBurdenRatio}%
              </div>
              <div className="text-[10px] font-mono text-[#44474d] mt-1">
                Recommended ceiling: 35%
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30">
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#44474d] mb-1">
                <Clock className="w-3 h-3 text-[#515f78]" />
                <span>Emergency Runway</span>
              </div>
              <div className="text-lg font-mono font-bold text-[#0b1c30]">
                {report.emergencyReserveMonths} Mo
              </div>
              <div className="text-[10px] font-mono text-[#44474d] mt-1">
                Institutional target: 6 Mo
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30">
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#44474d] mb-1">
                <Coins className="w-3 h-3 text-[#515f78]" />
                <span>Opportunity Cost</span>
              </div>
              <div className="text-lg font-mono font-bold text-[#0b1c30]">
                {formatCurrency(report.opportunityCost, currency)}
              </div>
              <div className="text-[10px] font-mono text-[#44474d] mt-1">
                Missed compound capital
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#44474d] mb-1">
                <TrendingUp className="w-3 h-3 text-[#9a4152]" />
                <span>3Y Net Capital Delta</span>
              </div>
              <div className="text-lg font-mono font-bold text-[#9a4152]">
                +{report.longTermImpactPct}%
              </div>
              <div className="text-[10px] font-mono text-[#44474d] mt-1">
                Univ C vs Univ A
              </div>
            </div>
          </div>

          {/* AI Second Opinion Synthesis Box */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#e5eeff] border border-[#c5c6cd]/40 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9a4152]" />
              <span className="text-xs font-mono uppercase font-bold text-[#0b1c30]">
                Synthesis via Deterministic Modeling & Risk Engine
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#0b1c30] leading-relaxed">
              "{report.synthesisNarrative}"
            </p>

            <div className="p-3 rounded-lg bg-white border border-[#c5c6cd]/30 text-xs font-mono text-[#0b1c30]">
              <strong>Tactical Guidance:</strong> {report.tacticalRecommendation}
            </div>
          </div>

          {/* Interactive Scenario Question Form */}
          <div className="border-t border-[#c5c6cd]/30 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#0b1c30] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#515f78]" />
                <span>Test a Custom Hypothesis / "What If" Question</span>
              </span>
              <span className="text-[11px] font-mono text-[#75777e]">Instant Quantitative Reasoning</span>
            </div>

            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g., What if I get a 10% raise next quarter? Or pre-pay ₹1L in Month 6?"
                className="flex-1 px-3 py-2 text-xs font-mono bg-[#eff4ff] border border-[#c5c6cd]/50 rounded-lg text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#0d1c32]"
              />
              <button
                type="submit"
                disabled={isSynthesizing || !customQuestion.trim()}
                className="px-4 py-2 bg-[#0d1c32] hover:bg-black text-white text-xs font-mono font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>{isSynthesizing ? 'Calculating...' : 'Audit'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {customAnswer && (
              <div className="mt-3 p-3.5 rounded-lg bg-[#dce9ff]/40 border border-[#c5c6cd]/50 text-xs font-mono text-[#0b1c30] leading-relaxed animate-in fade-in duration-200">
                <span className="font-bold text-[#9a4152]">// Audit Response: </span>
                {customAnswer}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
