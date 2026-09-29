import React, { useState } from 'react';
import { GitBranch, ShieldAlert, Calculator, Sparkles, ArrowRight } from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<'A' | 'B' | 'C'>('B');

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#c5c6cd]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9a4152] font-semibold mb-2 block">
            Systemic Flaws in Traditional Planning
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
            Financial decisions are rarely black and white.
          </h2>
          <p className="text-sm sm:text-base text-[#44474d] mt-3">
            Traditional loan spreadsheets calculate a single linear formula—assuming unbroken cashflow, zero health emergencies, and zero market turbulence.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="p-7 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/30 hover:border-[#c5c6cd]/80 transition-all">
            <div className="w-11 h-11 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#0b1c30] mb-5">
              <GitBranch className="w-5 h-5 text-[#0d1c32]" />
            </div>
            <h3 className="text-lg font-bold text-[#0b1c30] mb-2">
              One decision creates cascading consequences
            </h3>
            <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
              Taking an unexpected EMI does not simply consume monthly salary; it triggers subtle ripple effects on emergency reserves, tax advantages, and compound retirement trajectories.
            </p>
          </div>

          <div className="p-7 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/30 hover:border-[#c5c6cd]/80 transition-all">
            <div className="w-11 h-11 rounded-lg bg-[#ffd9dd]/60 flex items-center justify-center text-[#9a4152] mb-5">
              <ShieldAlert className="w-5 h-5 text-[#9a4152]" />
            </div>
            <h3 className="text-lg font-bold text-[#0b1c30] mb-2">
              Unexpected expenses can mutate the outcome
            </h3>
            <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
              Sudden medical bills, inflation spikes, or career sabbatical gaps quickly shatter rigid linear budgets that fail to plan for dynamic tail-risk events.
            </p>
          </div>

          <div className="p-7 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/30 hover:border-[#c5c6cd]/80 transition-all">
            <div className="w-11 h-11 rounded-lg bg-[#d3e4fe]/60 flex items-center justify-center text-[#0b1c30] mb-5">
              <Calculator className="w-5 h-5 text-[#515f78]" />
            </div>
            <h3 className="text-lg font-bold text-[#0b1c30] mb-2">
              Traditional calculators show numbers, not futures
            </h3>
            <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
              Standard banking calculators assume static conditions: zero volatility, unbroken employment, and zero surprises. They render single values rather than systemic possibilities.
            </p>
          </div>
        </div>

        {/* Center Transition Callout with Interactive Branch Graphic */}
        <div className="p-7 md:p-9 rounded-xl bg-[#e5eeff] border border-[#c5c6cd]/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#9a4152] font-semibold mb-2 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Universe Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0b1c30] mb-2.5">
              FutureFund turns one financial decision into multiple simulated futures.
            </h3>
            <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
              Map diverging cash reserves, debt milestones, and liquidity thresholds concurrently under deterministic mathematical modeling with full stress simulation.
            </p>
          </div>

          {/* Interactive Branch Mock */}
          <div className="bg-white p-5 rounded-lg border border-[#c5c6cd]/50 w-full md:w-88 shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0d1c32]" />
                Commitment: ₹5,00,000
              </span>
              <span className="text-[#75777e]">Select Path</span>
            </div>

            <div className="pl-2 border-l-2 border-dashed border-[#c5c6cd] space-y-2">
              <button
                onClick={() => setSelectedBranch('A')}
                className={`w-full text-left p-2 rounded transition-all flex items-center justify-between text-xs font-mono cursor-pointer ${
                  selectedBranch === 'A'
                    ? 'bg-[#ffd9dd]/30 border border-[#9a4152]/30 text-[#9a4152] font-bold'
                    : 'hover:bg-[#eff4ff] text-[#44474d]'
                }`}
              >
                <span>Path A: Commit Now</span>
                <span className="text-[#ba1a1a]">-₹1.4L Peak Dip</span>
              </button>

              <button
                onClick={() => setSelectedBranch('B')}
                className={`w-full text-left p-2 rounded transition-all flex items-center justify-between text-xs font-mono cursor-pointer ${
                  selectedBranch === 'B'
                    ? 'bg-[#e5eeff] border border-[#0d1c32]/30 text-[#0b1c30] font-bold'
                    : 'hover:bg-[#eff4ff] text-[#44474d]'
                }`}
              >
                <span>Path B: +6 Mo Strategic Buffer</span>
                <span className="text-[#0b1c30]">+₹4.8L Safe Runway</span>
              </button>

              <button
                onClick={() => setSelectedBranch('C')}
                className={`w-full text-left p-2 rounded transition-all flex items-center justify-between text-xs font-mono cursor-pointer ${
                  selectedBranch === 'C'
                    ? 'bg-[#dce9ff] border border-[#515f78]/30 text-[#0b1c30] font-bold'
                    : 'hover:bg-[#eff4ff] text-[#44474d]'
                }`}
              >
                <span>Path C: Restructured Amortization</span>
                <span className="text-[#515f78]">Optimal Net Worth</span>
              </button>
            </div>

            <div className="mt-3 pt-2 border-t border-[#c5c6cd]/30 text-[11px] font-mono text-[#44474d]">
              {selectedBranch === 'A' && 'Path A experiences cash reserve crunch during Q2.'}
              {selectedBranch === 'B' && 'Path B delays debt service to create ₹4.8L liquid safety cushion.'}
              {selectedBranch === 'C' && 'Path C slashes total interest fees by 38% via 30% down payment.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
