import React from 'react';
import { 
  Cpu, 
  Database, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  LineChart, 
  Zap,
  GitCompare
} from 'lucide-react';

export const TechAndResearchSection: React.FC = () => {
  return (
    <>
      {/* TECHNOLOGY SECTION */}
      <section id="technology" className="py-16 md:py-24 bg-[#f8f9ff] border-b border-[#c5c6cd]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9a4152] font-semibold mb-2 block">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
              Engineered for Computational Integrity
            </h2>
            <p className="text-xs sm:text-sm text-[#44474d] mt-2">
              Combining exact deterministic mathematical kernels with generative reasoning models.
            </p>
          </div>

          {/* Execution Pipeline Ribbon */}
          <div className="mb-12 p-6 sm:p-7 rounded-xl bg-white border border-[#c5c6cd]/40 shadow-xs">
            <div className="text-xs font-mono text-[#9a4152] uppercase font-bold mb-4 text-center">
              Deterministic Simulation Pipeline
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-semibold border border-[#c5c6cd]/30">
                User Query
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#75777e]" />
              <span className="px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-semibold border border-[#c5c6cd]/30">
                Decision Parser
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#75777e]" />
              <span className="px-3 py-1.5 rounded-lg bg-[#0d1c32] text-white font-semibold">
                Simulation Kernel
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#75777e]" />
              <span className="px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-semibold border border-[#c5c6cd]/30">
                Risk & Stress Testing
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#75777e]" />
              <span className="px-3 py-1.5 rounded-lg bg-[#ffd9dd]/60 text-[#9a4152] font-bold border border-[#9a4152]/30">
                AI Second Opinion
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#75777e]" />
              <span className="px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-semibold border border-[#c5c6cd]/30">
                Auto-Pivot
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#75777e]" />
              <span className="px-3 py-1.5 rounded-lg bg-[#d3e4fe] text-[#0b1c30] font-bold">
                Decision Dashboard
              </span>
            </div>
          </div>

          {/* Tech Stack 5 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#c5c6cd]/40">
              <div className="text-[11px] font-mono uppercase font-bold text-[#9a4152] mb-1">Frontend</div>
              <div className="text-sm font-bold text-[#0b1c30]">React / TypeScript</div>
              <div className="text-xs text-[#44474d] mt-1">Tailwind CSS & Motion</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#c5c6cd]/40">
              <div className="text-[11px] font-mono uppercase font-bold text-[#9a4152] mb-1">Math Core</div>
              <div className="text-sm font-bold text-[#0b1c30]">Deterministic Engine</div>
              <div className="text-xs text-[#44474d] mt-1">36-Month Amortization Kernel</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#c5c6cd]/40">
              <div className="text-[11px] font-mono uppercase font-bold text-[#9a4152] mb-1">AI Reasoning</div>
              <div className="text-sm font-bold text-[#0b1c30]">Gemini 2.5 / Flash</div>
              <div className="text-xs text-[#44474d] mt-1">Institutional Second Opinion</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#c5c6cd]/40">
              <div className="text-[11px] font-mono uppercase font-bold text-[#9a4152] mb-1">Data Model</div>
              <div className="text-sm font-bold text-[#0b1c30]">Multiverse Matrix</div>
              <div className="text-xs text-[#44474d] mt-1">Zero-Latency State Sync</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#c5c6cd]/40">
              <div className="text-[11px] font-mono uppercase font-bold text-[#9a4152] mb-1">Governance</div>
              <div className="text-sm font-bold text-[#0b1c30]">Strict Verification</div>
              <div className="text-xs text-[#44474d] mt-1">Zero Mathematical Hallucination</div>
            </div>
          </div>
        </div>
      </section>

      {/* RESEARCH & EMPIRICAL FOUNDATION SECTION */}
      <section id="research" className="py-16 md:py-24 bg-white border-b border-[#c5c6cd]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9a4152] font-semibold mb-2 block">
              Empirical Foundation
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
              Research-Driven Decision Support
            </h2>
            <p className="text-xs sm:text-sm text-[#44474d] mt-2">
              Bridging academic quantitative research with production financial software execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/40 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#9a4152]" />
                <span className="text-xs font-mono uppercase font-bold text-[#75777e]">
                  Academic Theory
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0b1c30]">
                LLMs for Financial Advice & Calculation
              </h3>
              <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                Raw LLMs suffer hallucinations and arithmetic instability when processing multi-tiered financial compounding and amortizations.
              </p>
              <div className="p-3 rounded-lg bg-white border-l-2 border-[#0d1c32] text-xs font-mono text-[#0b1c30]">
                <strong className="text-[#0d1c32]">FutureFund Architecture:</strong> Calculations run via a strict deterministic math kernel. AI models are constrained strictly to qualitative narrative synthesis.
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/40 space-y-3">
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-[#9a4152]" />
                <span className="text-xs font-mono uppercase font-bold text-[#75777e]">
                  Academic Theory
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0b1c30]">
                AI Financial Decision Making & Counterfactuals
              </h3>
              <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                Single-point forecasts create false certainty and ignore behavioural biases during market contractions or life disruptions.
              </p>
              <div className="p-3 rounded-lg bg-white border-l-2 border-[#0d1c32] text-xs font-mono text-[#0b1c30]">
                <strong className="text-[#0d1c32]">FutureFund Architecture:</strong> Counterfactual multi-universe modeling compares alternate execution paths simultaneously instead of fragile single-point predictions.
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/40 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#9a4152]" />
                <span className="text-xs font-mono uppercase font-bold text-[#75777e]">
                  Academic Theory
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0b1c30]">
                Financial Shocks & Liquidity Resilience
              </h3>
              <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                Gaussian distributions fail to capture fat-tailed emergency life events in personal and household balance sheets.
              </p>
              <div className="p-3 rounded-lg bg-white border-l-2 border-[#0d1c32] text-xs font-mono text-[#0b1c30]">
                <strong className="text-[#0d1c32]">FutureFund Architecture:</strong> Dynamic stress-testing based on fat-tailed behavioral finance shocks, health events, and liquidity floors.
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/40 space-y-3">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-[#9a4152]" />
                <span className="text-xs font-mono uppercase font-bold text-[#75777e]">
                  Academic Theory
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0b1c30]">
                Long-Term Financial Outcomes & Opportunity Drag
              </h3>
              <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                Individuals heavily discount secondary effects beyond 6 months, causing systemic long-term under-saving and interest drag.
              </p>
              <div className="p-3 rounded-lg bg-white border-l-2 border-[#0d1c32] text-xs font-mono text-[#0b1c30]">
                <strong className="text-[#0d1c32]">FutureFund Architecture:</strong> Full 36-month horizon tracking accounting for compounding opportunity costs and net equity evolution.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
