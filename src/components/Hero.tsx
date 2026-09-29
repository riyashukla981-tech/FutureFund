import React from 'react';
import { CurrencyCode, formatCurrency, ScenarioInput, UniverseResult } from '../utils/financeMath';
import { PlayCircle, GitFork, ArrowRight, Activity, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  inputs: ScenarioInput;
  universes: {
    universeA: UniverseResult;
    universeB: UniverseResult;
    universeC: UniverseResult;
  };
  currency: CurrencyCode;
  onExploreClick: () => void;
  onSimulateClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  inputs,
  universes,
  currency,
  onExploreClick,
  onSimulateClick,
}) => {
  const { universeA, universeB, universeC } = universes;

  return (
    <section id="hero" className="relative pt-10 pb-16 md:pt-16 md:pb-24 border-b border-[#c5c6cd]/30 overflow-hidden">
      {/* Subtle mathematical grid backdrop */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(#515f78 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff4ff] border border-[#c5c6cd]/50 text-[#0b1c30] mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#9a4152] animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#44474d] font-semibold">
              Deterministic AI Financial Simulator & Stress Engine
            </span>
          </div>

          {/* Large Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0b1c30] mb-5 leading-tight text-balance">
            Don’t Guess Your Financial Future.{' '}
            <span className="text-[#9a4152] underline decoration-[#fd91a2] decoration-wavy underline-offset-6">
              Simulate It.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#44474d] max-w-2xl mx-auto mb-8 leading-relaxed">
            FutureFund lets you compare multiple financial decisions, stress-test them against unexpected life events, and discover how to adapt before you commit capital.
          </p>

          {/* CTA Cluster */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onSimulateClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0d1c32] text-white font-mono text-xs font-semibold hover:bg-black active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-[#d3e4fe]" />
              <span>Launch Live Simulation</span>
            </button>
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-[#c5c6cd]/80 text-[#0b1c30] font-mono text-xs font-semibold hover:bg-[#eff4ff] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <GitFork className="w-4 h-4 text-[#515f78]" />
              <span>Explore How It Works</span>
            </button>
          </div>
        </div>

        {/* Hero Visual: Rich Financial Telemetry Dashboard Preview */}
        <div className="bg-white rounded-xl border border-[#c5c6cd]/60 shadow-lg overflow-hidden p-5 sm:p-7 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-[#c5c6cd]/30 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="uppercase text-[#9a4152] font-bold">Active Engine Snapshot</span>
                <span className="text-[#75777e]">·</span>
                <span className="text-[#44474d]">36-Month Multi-Universe Kernel</span>
              </div>
              <h2 className="text-xl font-bold text-[#0b1c30] mt-0.5">
                Deterministic Trajectory Projection
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#44474d]">Target Commitment:</span>
              <span className="text-xs font-mono font-bold text-[#0b1c30] bg-[#e5eeff] px-2.5 py-1 rounded">
                {formatCurrency(inputs.loanAmount, currency)} ({inputs.interestRate}% APR)
              </span>
            </div>
          </div>

          {/* 6 Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30">
              <div className="text-[11px] font-mono text-[#44474d] mb-0.5">Current Savings</div>
              <div className="text-base font-mono font-bold text-[#0b1c30]">
                {formatCurrency(inputs.currentSavings, currency)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30">
              <div className="text-[11px] font-mono text-[#44474d] mb-0.5">Monthly Income</div>
              <div className="text-base font-mono font-bold text-[#0b1c30]">
                {formatCurrency(inputs.monthlyIncome, currency)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30">
              <div className="text-[11px] font-mono text-[#44474d] mb-0.5">Monthly Expenses</div>
              <div className="text-base font-mono font-bold text-[#0b1c30]">
                {formatCurrency(inputs.monthlyExpenses, currency)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30">
              <div className="text-[11px] font-mono text-[#44474d] mb-0.5">Universe A EMI</div>
              <div className="text-base font-mono font-bold text-[#9a4152]">
                {formatCurrency(universeA.emi, currency)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30">
              <div className="text-[11px] font-mono text-[#44474d] mb-0.5">Emergency Shock</div>
              <div className="text-base font-mono font-bold text-[#0b1c30]">
                {formatCurrency(inputs.emergencyShock, currency)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#c5c6cd]/30">
              <div className="text-[11px] font-mono text-[#44474d] mb-0.5">Baseline Runway</div>
              <div className="text-base font-mono font-bold text-[#0b1c30]">
                {(inputs.currentSavings / Math.max(1, inputs.monthlyExpenses)).toFixed(1)} Months
              </div>
            </div>
          </div>

          {/* 3 Universe Preview Cards with dynamic mini sparkline bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {/* Universe A */}
            <div className="p-4 rounded-xl border border-[#9a4152]/30 bg-[#ffd9dd]/15 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-[#9a4152]">Universe A</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  universeA.riskTier === 'Critical' 
                    ? 'bg-[#ffdad6] text-[#93000a]' 
                    : 'bg-[#eff4ff] text-[#0b1c30]'
                }`}>
                  {universeA.riskTier === 'Critical' ? 'High Debt Spike' : universeA.riskTier}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0b1c30]">Take Loan Now</h3>
              <p className="text-xs text-[#44474d] mt-0.5 mb-3 line-clamp-2">
                {universeA.description}
              </p>
              
              {/* Mini Sparkline Bar representation */}
              <div className="h-9 w-full flex items-end gap-1.5 pt-2 border-t border-[#c5c6cd]/30">
                <div className="h-4/5 flex-1 bg-[#9a4152]/60 rounded-xs" title="Month 0" />
                <div className="h-2/5 flex-1 bg-[#9a4152]/80 rounded-xs" title="Month 6 (Dip)" />
                <div className="h-1/5 flex-1 bg-[#9a4152] rounded-xs" title="Month 12 (Minimum)" />
                <div className="h-3/6 flex-1 bg-[#9a4152]/70 rounded-xs" title="Month 18" />
                <div className="h-4/6 flex-1 bg-[#9a4152]/60 rounded-xs" title="Month 24" />
                <div className="h-5/6 flex-1 bg-[#9a4152]/50 rounded-xs" title="Month 36" />
              </div>
              <div className="flex justify-between items-center mt-2 text-[11px] font-mono text-[#44474d]">
                <span>12M Reserve: <strong className="text-[#0b1c30]">{formatCurrency(universeA.twelveMonthReserve, currency)}</strong></span>
                <span>Peak: {formatCurrency(universeA.peakDebt, currency)}</span>
              </div>
            </div>

            {/* Universe B */}
            <div className="p-4 rounded-xl border border-[#0d1c32]/20 bg-[#eff4ff] relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-[#0b1c30]">Universe B</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#d3e4fe] text-[#0b1c30]">
                  Resilient Pace
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0b1c30]">Delay 6 Months</h3>
              <p className="text-xs text-[#44474d] mt-0.5 mb-3 line-clamp-2">
                {universeB.description}
              </p>

              {/* Mini Sparkline Bar representation */}
              <div className="h-9 w-full flex items-end gap-1.5 pt-2 border-t border-[#c5c6cd]/30">
                <div className="h-3/6 flex-1 bg-[#0d1c32]/40 rounded-xs" title="Month 0" />
                <div className="h-4/6 flex-1 bg-[#0d1c32]/50 rounded-xs" title="Month 6 (Buffer Built)" />
                <div className="h-5/6 flex-1 bg-[#0d1c32]/60 rounded-xs" title="Month 12" />
                <div className="h-4/6 flex-1 bg-[#0d1c32]/70 rounded-xs" title="Month 18" />
                <div className="h-5/6 flex-1 bg-[#0d1c32]/80 rounded-xs" title="Month 24" />
                <div className="h-full flex-1 bg-[#0d1c32] rounded-xs" title="Month 36" />
              </div>
              <div className="flex justify-between items-center mt-2 text-[11px] font-mono text-[#44474d]">
                <span>12M Reserve: <strong className="text-[#0b1c30]">{formatCurrency(universeB.twelveMonthReserve, currency)}</strong></span>
                <span>Runway: +6 Mo</span>
              </div>
            </div>

            {/* Universe C */}
            <div className="p-4 rounded-xl border border-[#515f78]/30 bg-[#dce9ff]/30 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-[#515f78]">Universe C</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#0b1c30]">
                  Optimal
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0b1c30]">Alternative Plan</h3>
              <p className="text-xs text-[#44474d] mt-0.5 mb-3 line-clamp-2">
                {universeC.description}
              </p>

              {/* Mini Sparkline Bar representation */}
              <div className="h-9 w-full flex items-end gap-1.5 pt-2 border-t border-[#c5c6cd]/30">
                <div className="h-3/6 flex-1 bg-[#515f78]/50 rounded-xs" title="Month 0" />
                <div className="h-4/6 flex-1 bg-[#515f78]/60 rounded-xs" title="Month 6" />
                <div className="h-4/6 flex-1 bg-[#515f78]/70 rounded-xs" title="Month 12" />
                <div className="h-5/6 flex-1 bg-[#515f78]/80 rounded-xs" title="Month 18" />
                <div className="h-5/6 flex-1 bg-[#515f78] rounded-xs" title="Month 24" />
                <div className="h-full flex-1 bg-[#515f78] rounded-xs" title="Month 36" />
              </div>
              <div className="flex justify-between items-center mt-2 text-[11px] font-mono text-[#44474d]">
                <span>12M Reserve: <strong className="text-[#0b1c30]">{formatCurrency(universeC.twelveMonthReserve, currency)}</strong></span>
                <span>Net Gain: +₹{(universeC.thirtySixMonthNetCapital - universeA.thirtySixMonthNetCapital).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Horizon Bar Strip */}
          <div className="bg-[#eff4ff] p-3.5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono border border-[#c5c6cd]/30">
            <div className="flex flex-wrap items-center gap-4 text-[#44474d]">
              <span className="font-bold text-[#0b1c30]">Multi-Universe Horizon: 12 - 36 Months</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#9a4152] rounded-full" />
                <span>Univ A (Now)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#0d1c32] rounded-full" />
                <span>Univ B (+6M)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#515f78] rounded-full" />
                <span>Univ C (Optimized)</span>
              </div>
            </div>

            <button
              onClick={onSimulateClick}
              className="text-[#9a4152] hover:text-[#772738] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Full Interactive Curves</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
