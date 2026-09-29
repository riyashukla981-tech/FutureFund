import React, { useState, useEffect } from 'react';
import { CurrencyCode, CURRENCIES } from '../utils/financeMath';
import { 
  Compass, 
  Bookmark, 
  Menu, 
  X, 
  ArrowRight,
  Sliders,
  ShieldAlert,
  Sparkles,
  GitBranch
} from 'lucide-react';

interface NavbarProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency,
  onCurrencyChange,
  savedCount,
  onOpenSavedDrawer,
}) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['hero', 'how-it-works', 'simulation', 'stress-test', 'auto-pivot', 'second-opinion', 'research'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'stress-test', label: 'Stress Engine' },
    { id: 'auto-pivot', label: 'Auto-Pivot' },
    { id: 'second-opinion', label: 'Second Opinion' },
    { id: 'research', label: 'Research' },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        isScrolled 
          ? 'bg-[#f8f9ff]/95 backdrop-blur-md border-[#c5c6cd]/50 shadow-sm' 
          : 'bg-[#f8f9ff] border-[#c5c6cd]/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Zone 1: Single element Brand Wordmark */}
        <button 
          onClick={() => scrollTo('hero')} 
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0d1c32] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-95 duration-150">
            <Compass className="w-4 h-4 text-[#d3e4fe]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#0b1c30]">
            FutureFund
          </span>
        </button>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`py-1 text-xs font-mono tracking-wide uppercase transition-colors relative cursor-pointer ${
                  isActive 
                    ? 'text-[#0b1c30] font-semibold' 
                    : 'text-[#44474d] hover:text-[#0b1c30]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0b1c30] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Currency Picker, Saved Drawer, Launch CTA) */}
        <div className="flex items-center gap-3">
          {/* Currency Toggle */}
          <div className="relative inline-flex items-center bg-[#e5eeff] rounded-md p-0.5 border border-[#c5c6cd]/40">
            {(['INR', 'USD', 'EUR'] as const).map((curr) => {
              const info = CURRENCIES[curr];
              return (
                <button
                  key={curr}
                  onClick={() => onCurrencyChange(curr)}
                  className={`px-2 py-1 text-[11px] font-mono font-medium rounded transition-all cursor-pointer ${
                    currentCurrency === curr
                      ? 'bg-white text-[#0b1c30] shadow-xs font-bold'
                      : 'text-[#44474d] hover:text-[#0b1c30]'
                  }`}
                  title={`Switch to ${info.label}`}
                >
                  {info.symbol}
                </button>
              );
            })}
          </div>

          {/* Saved Scenarios Comparison Trigger */}
          <button
            onClick={onOpenSavedDrawer}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c5c6cd]/60 text-xs font-mono font-medium text-[#0b1c30] bg-white hover:bg-[#eff4ff] transition-all cursor-pointer"
            title="View saved scenarios"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#9a4152]" />
            <span>Saved ({savedCount})</span>
          </button>

          {/* Try Simulation Button */}
          <button
            onClick={() => scrollTo('simulation')}
            className="px-3.5 py-1.5 rounded-lg bg-[#0d1c32] text-white text-xs font-mono font-medium hover:bg-black active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Try Simulation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#0b1c30] hover:bg-[#e5eeff] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#c5c6cd]/50 px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3 mb-2 border-b border-[#c5c6cd]/30">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-mono ${
                  activeSection === link.id
                    ? 'bg-[#eff4ff] text-[#0b1c30] font-bold'
                    : 'text-[#44474d] hover:bg-[#f8f9ff]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-mono text-[#44474d]">Saved Scenarios:</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSavedDrawer();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c5c6cd]/60 text-xs font-mono font-medium text-[#0b1c30] bg-[#eff4ff]"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#9a4152]" />
              <span>Review ({savedCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
