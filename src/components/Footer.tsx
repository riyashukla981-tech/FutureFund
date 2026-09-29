import React from 'react';
import { Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-[#c5c6cd]/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
        {/* Brand & Tagline */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0d1c32] flex items-center justify-center text-white">
              <Compass className="w-3.5 h-3.5 text-[#d3e4fe]" />
            </div>
            <span className="text-base font-bold text-[#0b1c30]">
              FutureFund
            </span>
          </div>
          <p className="text-xs text-[#44474d] max-w-md leading-relaxed font-mono">
            © 2026 FutureFund Analytics Inc. Deterministic financial simulation & algorithmic risk intelligence. All mathematical kernels executed client-side with zero data exfiltration.
          </p>
        </div>

        {/* Links Cluster */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[#44474d]">
          <button 
            onClick={() => scrollTo('hero')} 
            className="hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button 
            onClick={() => scrollTo('how-it-works')} 
            className="hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            Methodology
          </button>
          <button 
            onClick={() => scrollTo('simulation')} 
            className="hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            Live Simulator
          </button>
          <button 
            onClick={() => scrollTo('stress-test')} 
            className="hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            Risk Modeling
          </button>
          <button 
            onClick={() => scrollTo('technology')} 
            className="hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            API & Pipeline
          </button>
          <button 
            onClick={() => scrollTo('research')} 
            className="hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            Academic Foundation
          </button>
        </div>
      </div>
    </footer>
  );
};
