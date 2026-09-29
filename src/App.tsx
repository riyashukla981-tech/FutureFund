/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { HowItWorks } from './components/HowItWorks';
import { SimulationStudio } from './components/SimulationStudio';
import { StressTestSection } from './components/StressTestSection';
import { AutoPivotSection } from './components/AutoPivotSection';
import { SecondOpinionSection } from './components/SecondOpinionSection';
import { BenefitsSection } from './components/BenefitsSection';
import { TechAndResearchSection } from './components/TechAndResearchSection';
import { AmortizationModal } from './components/AmortizationModal';
import { SavedScenariosDrawer } from './components/SavedScenariosDrawer';
import { Footer } from './components/Footer';

import { 
  CurrencyCode, 
  ScenarioInput, 
  simulateUniverses 
} from './utils/financeMath';
import { SavedScenario } from './types/finance';
import { CheckCircle2, Info, ArrowUp } from 'lucide-react';

const INITIAL_INPUTS: ScenarioInput = {
  loanAmount: 500000,
  interestRate: 11.5,
  tenureMonths: 36,
  monthlyIncome: 120000,
  monthlyExpenses: 55000,
  currentSavings: 450000,
  emergencyShock: 75000,
};

export default function App() {
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [inputs, setInputs] = useState<ScenarioInput>(INITIAL_INPUTS);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    try {
      const stored = localStorage.getItem('futurefund_saved_scenarios');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspectUniverseId, setInspectUniverseId] = useState<'A' | 'B' | 'C'>('A');
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync saved scenarios to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('futurefund_saved_scenarios', JSON.stringify(savedScenarios));
    } catch {
      // storage quota or private mode
    }
  }, [savedScenarios]);

  // Handle toast timeout
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Handle scroll to top visibility
  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // Compute multi-universe simulations deterministically
  const universes = useMemo(() => {
    return simulateUniverses(inputs);
  }, [inputs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleSaveScenario = () => {
    const newSaved: SavedScenario = {
      id: `scen_${Date.now()}`,
      name: `Benchmark: ₹${(inputs.loanAmount / 100000).toFixed(1)}L @ ${inputs.interestRate}%`,
      timestamp: Date.now(),
      inputs: { ...inputs },
      results: {
        emiA: universes.universeA.emi,
        reserveA: universes.universeA.twelveMonthReserve,
        netWorthA: universes.universeA.thirtySixMonthNetCapital,
        emiB: universes.universeB.emi,
        reserveB: universes.universeB.twelveMonthReserve,
        netWorthB: universes.universeB.thirtySixMonthNetCapital,
        emiC: universes.universeC.emi,
        reserveC: universes.universeC.twelveMonthReserve,
        netWorthC: universes.universeC.thirtySixMonthNetCapital,
      },
    };

    setSavedScenarios((prev) => [newSaved, ...prev]);
    showToast('Saved current simulation snapshot to benchmarks.');
  };

  const handleLoadScenario = (scenario: SavedScenario) => {
    setInputs(scenario.inputs);
    setIsSavedDrawerOpen(false);
    showToast(`Loaded benchmark "${scenario.name}".`);

    // Smooth scroll to simulation section
    const el = document.getElementById('simulation');
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleDeleteScenario = (id: string) => {
    setSavedScenarios((prev) => prev.filter((s) => s.id !== id));
    showToast('Scenario benchmark removed.');
  };

  const handleClearAllSaved = () => {
    setSavedScenarios([]);
    showToast('Cleared all saved benchmarks.');
  };

  const handleApplyPivot = (pivotChanges: Partial<ScenarioInput>, msg: string) => {
    setInputs((prev: ScenarioInput) => ({
      ...prev,
      ...pivotChanges,
    }));
    showToast(msg);

    // Scroll to simulation section to observe updated trajectories
    const el = document.getElementById('simulation');
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleInspectUniverse = (univId: 'A' | 'B' | 'C') => {
    setInspectUniverseId(univId);
    setIsModalOpen(true);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#9a4152] selection:text-white">
      {/* 1. STICKY TOP NAVBAR */}
      <Navbar
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        savedCount={savedScenarios.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />

      {/* 2. HERO SECTION */}
      <main className="flex-1">
        <Hero
          inputs={inputs}
          universes={universes}
          currency={currency}
          onExploreClick={() => scrollTo('how-it-works')}
          onSimulateClick={() => scrollTo('simulation')}
        />

        {/* 3. PROBLEM -> SOLUTION SECTION */}
        <ProblemSolution />

        {/* 4. HOW IT WORKS SECTION */}
        <HowItWorks />

        {/* 5. MAIN INTERACTIVE SIMULATION STUDIO */}
        <SimulationStudio
          inputs={inputs}
          onInputChange={setInputs}
          universes={universes}
          currency={currency}
          onInspectUniverse={handleInspectUniverse}
          onSaveScenario={handleSaveScenario}
          onToast={showToast}
        />

        {/* 6. STRESS TEST SECTION */}
        <StressTestSection
          baseInputs={inputs}
          currency={currency}
        />

        {/* 7. AUTO-PIVOT SECTION */}
        <AutoPivotSection
          inputs={inputs}
          universeA={universes.universeA}
          currency={currency}
          onApplyPivot={handleApplyPivot}
        />

        {/* 8. SECOND OPINION ENGINE */}
        <SecondOpinionSection
          inputs={inputs}
          universes={universes}
          currency={currency}
        />

        {/* 9. IMPACT & BENEFITS */}
        <BenefitsSection />

        {/* 10 & 11. TECHNOLOGY ARCHITECTURE & EMPIRICAL RESEARCH */}
        <TechAndResearchSection />

        {/* 12. CALL TO ACTION STRIP */}
        <section className="py-16 md:py-20 bg-[#0d1c32] text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#d3e4fe] text-xs font-mono uppercase font-semibold mb-5">
              <span>Deterministic Foresight Engine</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold max-w-3xl mx-auto mb-3 tracking-tight">
              Before you sign the agreement, simulate the consequences.
            </h2>
            <p className="text-sm sm:text-base text-[#b9c7e4] max-w-xl mx-auto mb-8 font-mono">
              Compare trajectories. Stress-test unexpected shocks. Optimize before you commit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => scrollTo('simulation')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#9a4152] text-white font-mono text-xs font-semibold hover:bg-[#772738] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Launch Simulation Studio
              </button>
              <button
                onClick={() => scrollTo('hero')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold border border-white/20 transition-all cursor-pointer"
              >
                Review Overview
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 13. FOOTER */}
      <Footer />

      {/* AMORTIZATION MODAL */}
      <AmortizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        universeA={universes.universeA}
        universeB={universes.universeB}
        universeC={universes.universeC}
        initialUniverseId={inspectUniverseId}
        currency={currency}
      />

      {/* SAVED SCENARIOS DRAWER */}
      <SavedScenariosDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedScenarios={savedScenarios}
        onLoadScenario={handleLoadScenario}
        onDeleteScenario={handleDeleteScenario}
        onClearAll={handleClearAllSaved}
        currency={currency}
      />

      {/* FLOATING ACTION: SCROLL TO TOP */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-[#0d1c32] text-white shadow-xl hover:bg-black transition-all active:scale-95 z-40 cursor-pointer border border-white/20"
          title="Scroll back to top"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0d1c32] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-white/20 text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#d3e4fe] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
