import React from 'react';
import { ArrowLeftRight, Shield, Zap, TrendingUp } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: ArrowLeftRight,
      title: 'Multivariate Parallel Decisions',
      desc: 'Compare choices concurrently before committing capital. See how delayed timing or adjusted down payments preserve long-term freedom.',
    },
    {
      icon: Shield,
      title: 'Mitigated Solvency Risk',
      desc: 'Pinpoint cash-flow bottlenecks and insolvent debt traps months before they manifest. Eliminate reliance on high-interest emergency borrowing.',
    },
    {
      icon: Zap,
      title: 'Tail-Risk Financial Resilience',
      desc: 'Prepare for unexpected financial shocks before they hit by selecting shock-resistant pathways with pre-calculated liquidity runways.',
    },
    {
      icon: TrendingUp,
      title: '36-Month Compound Growth',
      desc: 'Understand 12–36 month compounding consequences on retirement net worth, interest drag, and opportunity cost equity.',
    },
  ];

  return (
    <section id="benefits" className="py-16 md:py-24 bg-white border-b border-[#c5c6cd]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9a4152] font-semibold mb-2 block">
            Core Value
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
            Institutional Rigor for Individual Capital
          </h2>
          <p className="text-xs sm:text-sm text-[#44474d] mt-2">
            The same mathematical scenario modeling deployed by treasury desks, accessible for personal balance sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/40 hover:border-[#c5c6cd] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#0b1c30] mb-4 border border-[#c5c6cd]/30 shadow-xs">
                    <Icon className="w-5 h-5 text-[#0d1c32]" />
                  </div>
                  <h3 className="text-base font-bold text-[#0b1c30] mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
