import React, { useState } from 'react';
import { 
  UserCheck, 
  Terminal, 
  Workflow, 
  Activity, 
  Sparkles, 
  LayoutDashboard,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'Financial Profile Aggregation',
      icon: UserCheck,
      summary: 'Aggregates baseline net cash flow: recurring income, fixed commitments, existing debt amortizations, liquid reserves, and discretionary ceilings.',
      technicalDetails: 'Ingests salary inflows, living expense baseline, tax liabilities, and liquid bank reserves. Establishes the initial conditions for deterministic vector iteration.',
      telemetryOutput: 'Inputs: { Income: ₹1,20,000, Baseline Burn: ₹55,000, Initial Liquid: ₹4,50,000 }'
    },
    {
      num: '02',
      title: 'Multi-Variable Decision Parser',
      icon: Terminal,
      summary: 'Converts financial scenarios (e.g., “Take ₹5L loan vs delay purchase 6 months”) into structured multi-variable parameters ready for math kernels.',
      technicalDetails: 'Translates principal, interest rate curves, amortization periods, and opportunity cost horizons into structured matrix arguments.',
      telemetryOutput: 'Kernel Params: { P: 500000, r_annual: 0.115, N: 36, Shock_delta: 75000 }'
    },
    {
      num: '03',
      title: 'Multi-Universe Simulator',
      icon: Workflow,
      summary: 'Deterministic simulation kernels compute continuous parallel futures across 12-to-36-month horizons, isolating timing variations and capital drawdowns.',
      technicalDetails: 'Runs parallel month-by-month cashflow iterations for Universe A, B, and C. Calculates compound equity curves and remaining debt balances.',
      telemetryOutput: 'State Iterations: Universe A (36 epochs), Universe B (36 epochs), Universe C (36 epochs)'
    },
    {
      num: '04',
      title: 'Risk & Stress Engine',
      icon: Activity,
      summary: 'Simulates exogenous shocks: abrupt salary reductions, inflation hikes, and large emergency liquidity drains to expose vulnerabilities in each trajectory.',
      technicalDetails: 'Applies localized stochastic or step-function stress vectors to test reserve resilience, insolvency horizons, and minimum cash thresholds.',
      telemetryOutput: 'Shock Event: -20% income in M2-M5; Emergency medical expenditure ₹1,50,000 in M3'
    },
    {
      num: '05',
      title: 'Auto-Pivot Engine',
      icon: Sparkles,
      summary: 'Identifies systemic failure points and generates algorithmic counter-measures: optimal delayed dates, down-payment augmentations, and tenure shifts.',
      technicalDetails: 'Detects whenever cash reserves dip below 2 months of living costs and calculates exact capital reallocation to restore solvency.',
      telemetryOutput: 'Recommended Pivot: Delay 4 Months (+₹2.6L buffer) OR 25% down payment'
    },
    {
      num: '06',
      title: 'Decision Dashboard & Second Opinion',
      icon: LayoutDashboard,
      summary: 'Renders an executive-grade dashboard containing trajectory curves, liquidity runways, opportunity costs, and plain-language institutional analysis.',
      technicalDetails: 'Produces comparative vector visual plots, solvency matrices, DTI scorecards, and institutional narrative reviews synthesized for clarity.',
      telemetryOutput: 'Synthesis: Cash Flow Score 78/100, Debt Burden 28%, Opportunity Cost ₹48,000'
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#f8f9ff] border-b border-[#c5c6cd]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9a4152] font-semibold mb-2 block">
            System Process
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
            Six Stages of Quantitative Foresight
          </h2>
          <p className="text-sm sm:text-base text-[#44474d] mt-3">
            How our deterministic simulation framework models parallel lifelines with zero guesswork.
          </p>
        </div>

        {/* 6 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-xl bg-white border transition-all cursor-pointer text-left relative ${
                  isSelected
                    ? 'border-[#0d1c32] shadow-md ring-1 ring-[#0d1c32]'
                    : 'border-[#c5c6cd]/40 hover:border-[#c5c6cd] hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-bold text-[#9a4152]">
                    {step.num}
                  </span>
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#0d1c32] text-white' : 'bg-[#eff4ff] text-[#0b1c30]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#0b1c30] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed mb-3">
                  {step.summary}
                </p>

                <div className="flex items-center gap-1 text-[11px] font-mono text-[#9a4152] font-semibold">
                  <span>{isSelected ? 'Viewing Pipeline Telemetry' : 'Click to inspect telemetry'}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Stage Deep-Dive Inspection Box */}
        <div className="p-6 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/50 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#c5c6cd]/30 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0d1c32] text-white">
                Stage {steps[activeStep].num}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-[#0b1c30]">
                {steps[activeStep].title} — Architecture Breakdown
              </h4>
            </div>
            <span className="text-xs font-mono text-[#515f78]">Status: Deterministic Pipeline Nominal</span>
          </div>

          <p className="text-xs sm:text-sm text-[#0b1c30] mb-3 leading-relaxed">
            {steps[activeStep].technicalDetails}
          </p>

          <div className="bg-white p-3 rounded-lg border border-[#c5c6cd]/40 font-mono text-xs text-[#0b1c30] overflow-x-auto">
            <span className="text-[#9a4152] font-semibold">// Live Data Vector: </span>
            <span>{steps[activeStep].telemetryOutput}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
