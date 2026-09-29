import React, { useState } from 'react';
import { 
  CurrencyCode, 
  formatCurrency, 
  ScenarioInput, 
  UniverseResult,
  MonthData,
  exportTrajectoriesToCSV 
} from '../utils/financeMath';
import { 
  Sliders, 
  RotateCcw, 
  Download, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  Info,
  BookmarkPlus,
  Layers,
  Sparkles
} from 'lucide-react';

interface SimulationStudioProps {
  inputs: ScenarioInput;
  onInputChange: (newInputs: ScenarioInput) => void;
  universes: {
    universeA: UniverseResult;
    universeB: UniverseResult;
    universeC: UniverseResult;
  };
  currency: CurrencyCode;
  onInspectUniverse: (univId: 'A' | 'B' | 'C') => void;
  onSaveScenario: () => void;
  onToast: (msg: string) => void;
}

type ChartMetric = 'cash' | 'netCapital' | 'debt';

export const SimulationStudio: React.FC<SimulationStudioProps> = ({
  inputs,
  onInputChange,
  universes,
  currency,
  onInspectUniverse,
  onSaveScenario,
  onToast,
}) => {
  const [activePreset, setActivePreset] = useState<string>('loan');
  const [chartMetric, setChartMetric] = useState<ChartMetric>('cash');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const { universeA, universeB, universeC } = universes;

  // Presets
  const applyPreset = (type: string) => {
    setActivePreset(type);
    if (type === 'loan') {
      onInputChange({
        ...inputs,
        loanAmount: 500000,
        interestRate: 11.5,
        tenureMonths: 36,
      });
      onToast('Loaded Personal Loan preset (₹5,00,000 @ 11.5%)');
    } else if (type === 'renovation') {
      onInputChange({
        ...inputs,
        loanAmount: 800000,
        interestRate: 9.5,
        tenureMonths: 48,
      });
      onToast('Loaded Home Renovation preset (₹8,00,000 @ 9.5%)');
    } else if (type === 'ev') {
      onInputChange({
        ...inputs,
        loanAmount: 1200000,
        interestRate: 8.5,
        tenureMonths: 60,
      });
      onToast('Loaded EV Purchase preset (₹12,00,000 @ 8.5%)');
    } else if (type === 'startup') {
      onInputChange({
        ...inputs,
        loanAmount: 350000,
        interestRate: 14.0,
        tenureMonths: 24,
      });
      onToast('Loaded Career / Startup Check preset (₹3,50,000 @ 14.0%)');
    }
  };

  const handleSlider = (key: keyof ScenarioInput, value: number) => {
    setActivePreset('custom');
    onInputChange({
      ...inputs,
      [key]: value,
    });
  };

  const handleDownloadCSV = () => {
    const csvContent = exportTrajectoriesToCSV(universeA, universeB, universeC);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `futurefund_simulation_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast('Exported 36-month trajectory CSV dataset.');
  };

  // Trajectory SVG coordinates generator
  const getMetricValue = (univ: UniverseResult, monthIdx: number): number => {
    const item = univ.monthlyTrajectory[monthIdx];
    if (!item) return 0;
    if (chartMetric === 'cash') return item.endingCash;
    if (chartMetric === 'netCapital') return item.totalNetEquity;
    if (chartMetric === 'debt') return item.remainingDebt;
    return item.endingCash;
  };

  // Find max and min across all 3 trajectories for SVG scaling
  const allValues = [
    ...universeA.monthlyTrajectory.map((_: MonthData, i: number) => getMetricValue(universeA, i)),
    ...universeB.monthlyTrajectory.map((_: MonthData, i: number) => getMetricValue(universeB, i)),
    ...universeC.monthlyTrajectory.map((_: MonthData, i: number) => getMetricValue(universeC, i)),
  ];

  const maxVal = Math.max(100000, Math.max(...allValues) * 1.15);
  const minVal = Math.min(0, Math.min(...allValues));

  const svgWidth = 700;
  const svgHeight = 220;
  const paddingX = 20;
  const paddingY = 20;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const getSvgY = (val: number) => {
    const range = maxVal - minVal;
    if (range <= 0) return svgHeight / 2;
    const norm = (val - minVal) / range;
    return paddingY + graphHeight * (1 - norm);
  };

  const getSvgX = (month: number) => {
    return paddingX + (month / 36) * graphWidth;
  };

  const buildPath = (univ: UniverseResult) => {
    return univ.monthlyTrajectory.map((m: MonthData, idx: number) => {
      const x = getSvgX(m.month);
      const y = getSvgY(getMetricValue(univ, idx));
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  const activeHoverData = hoveredMonth !== null ? {
    month: hoveredMonth,
    valA: getMetricValue(universeA, hoveredMonth),
    valB: getMetricValue(universeB, hoveredMonth),
    valC: getMetricValue(universeC, hoveredMonth),
  } : null;

  return (
    <section id="simulation" className="py-16 md:py-24 bg-white border-b border-[#c5c6cd]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header & Preset Switchers */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9a4152] font-semibold mb-2 block">
              Live Scenario Modeling
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
              Explore Your Financial Universes
            </h2>
            <p className="text-xs sm:text-sm text-[#44474d] mt-2 max-w-xl">
              Tweak parameters in real-time. Watch how minor adjustments in timing or down payment reshape your liquidity, debt amortization, and 36-month net equity.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#44474d] mr-1">Scenario Presets:</span>
            {[
              { id: 'loan', label: 'Personal Loan' },
              { id: 'renovation', label: 'Home Renovation' },
              { id: 'ev', label: 'EV Purchase' },
              { id: 'startup', label: 'Startup Check' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activePreset === p.id
                    ? 'bg-[#0d1c32] text-white shadow-xs font-semibold'
                    : 'bg-[#eff4ff] border border-[#c5c6cd]/50 text-[#0b1c30] hover:bg-[#e5eeff]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 12-Column Layout: Controls (4 cols) + Outputs & Chart (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Parameter Sliders Panel */}
          <div className="lg:col-span-4 p-5 sm:p-6 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-[#c5c6cd]/30 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0d1c32]" />
                <h3 className="text-base font-bold text-[#0b1c30]">Parameter Controls</h3>
              </div>
              <button
                onClick={onSaveScenario}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-[#c5c6cd]/60 text-[11px] font-mono text-[#0b1c30] hover:bg-[#dce9ff] transition-all cursor-pointer"
                title="Save current parameters to comparison drawer"
              >
                <BookmarkPlus className="w-3 h-3 text-[#9a4152]" />
                <span>Save Snapshot</span>
              </button>
            </div>

            {/* Slider 1: Loan Amount */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-mono">
                <span className="text-[#0b1c30] font-medium">Loan / Commitment Amount</span>
                <span className="font-bold text-[#9a4152]">
                  {formatCurrency(inputs.loanAmount, currency)}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="50000"
                value={inputs.loanAmount}
                onChange={(e) => handleSlider('loanAmount', parseFloat(e.target.value))}
                className="w-full h-2 bg-[#dce9ff] rounded-lg cursor-pointer accent-[#0d1c32]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#44474d] mt-0.5">
                <span>{formatCurrency(100000, currency)}</span>
                <span>{formatCurrency(2000000, currency)}</span>
              </div>
            </div>

            {/* Slider 2: Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-mono">
                <span className="text-[#0b1c30] font-medium">Annual Interest Rate (APR)</span>
                <span className="font-bold text-[#0b1c30]">{inputs.interestRate}%</span>
              </div>
              <input
                type="range"
                min="7.5"
                max="18"
                step="0.5"
                value={inputs.interestRate}
                onChange={(e) => handleSlider('interestRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-[#dce9ff] rounded-lg cursor-pointer accent-[#0d1c32]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#44474d] mt-0.5">
                <span>7.5%</span>
                <span>18.0%</span>
              </div>
            </div>

            {/* Slider 3: Tenure Months */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-mono">
                <span className="text-[#0b1c30] font-medium">Financing Tenure</span>
                <span className="font-bold text-[#0b1c30]">{inputs.tenureMonths} Months</span>
              </div>
              <input
                type="range"
                min="12"
                max="60"
                step="6"
                value={inputs.tenureMonths}
                onChange={(e) => handleSlider('tenureMonths', parseInt(e.target.value))}
                className="w-full h-2 bg-[#dce9ff] rounded-lg cursor-pointer accent-[#0d1c32]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#44474d] mt-0.5">
                <span>12 Months</span>
                <span>60 Months</span>
              </div>
            </div>

            <div className="border-t border-[#c5c6cd]/30 pt-3 space-y-3.5">
              {/* Slider 4: Monthly Income */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-mono">
                  <span className="text-[#0b1c30] font-medium">Monthly Net Income</span>
                  <span className="font-bold text-[#0b1c30]">
                    {formatCurrency(inputs.monthlyIncome, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="350000"
                  step="10000"
                  value={inputs.monthlyIncome}
                  onChange={(e) => handleSlider('monthlyIncome', parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#dce9ff] rounded-lg cursor-pointer accent-[#0d1c32]"
                />
              </div>

              {/* Slider 5: Living Expenses */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-mono">
                  <span className="text-[#0b1c30] font-medium">Monthly Living Expenses</span>
                  <span className="font-bold text-[#0b1c30]">
                    {formatCurrency(inputs.monthlyExpenses, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="160000"
                  step="5000"
                  value={inputs.monthlyExpenses}
                  onChange={(e) => handleSlider('monthlyExpenses', parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#dce9ff] rounded-lg cursor-pointer accent-[#0d1c32]"
                />
              </div>

              {/* Slider 6: Current Savings */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-mono">
                  <span className="text-[#0b1c30] font-medium">Liquid Savings Buffer</span>
                  <span className="font-bold text-[#0b1c30]">
                    {formatCurrency(inputs.currentSavings, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1500000"
                  step="50000"
                  value={inputs.currentSavings}
                  onChange={(e) => handleSlider('currentSavings', parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#dce9ff] rounded-lg cursor-pointer accent-[#0d1c32]"
                />
              </div>

              {/* Slider 7: Emergency Shock */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-mono">
                  <span className="text-[#0b1c30] font-medium">Simulated Emergency Shock</span>
                  <span className="font-bold text-[#9a4152]">
                    {formatCurrency(inputs.emergencyShock, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250000"
                  step="25000"
                  value={inputs.emergencyShock}
                  onChange={(e) => handleSlider('emergencyShock', parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#dce9ff] rounded-lg cursor-pointer accent-[#0d1c32]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onInputChange({
                    loanAmount: 500000,
                    interestRate: 11.5,
                    tenureMonths: 36,
                    monthlyIncome: 120000,
                    monthlyExpenses: 55000,
                    currentSavings: 450000,
                    emergencyShock: 75000,
                  });
                  setActivePreset('loan');
                  onToast('Reset simulation parameters to default baseline.');
                }}
                className="w-full py-2.5 rounded-lg bg-white border border-[#c5c6cd]/60 text-[#0b1c30] text-xs font-mono font-medium hover:bg-[#eff4ff] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#515f78]" />
                <span>Reset to Default Parameters</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Universe Cards + Vector Trajectory Chart */}
          <div className="lg:col-span-8 space-y-6">
            {/* 3 Dynamic Universe Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Universe A Card */}
              <div className="p-5 rounded-xl border border-[#9a4152]/30 bg-white shadow-xs hover:border-[#9a4152] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase font-bold text-[#9a4152]">Universe A</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      universeA.riskTier === 'Critical'
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : universeA.riskTier === 'Warning'
                        ? 'bg-[#ffd9dd] text-[#772738]'
                        : 'bg-[#e5eeff] text-[#0b1c30]'
                    }`}>
                      {universeA.riskTier}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#0b1c30]">Take Loan Now</h4>
                  <p className="text-xs text-[#44474d] mb-4">
                    Immediate execution under current savings buffer.
                  </p>
                </div>

                <div className="space-y-2 border-t border-[#c5c6cd]/30 pt-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">Monthly EMI:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeA.emi, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">12M Reserve:</span>
                    <span className="font-bold text-[#9a4152]">{formatCurrency(universeA.twelveMonthReserve, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">Peak Debt:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeA.peakDebt, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">36M Net Capital:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeA.thirtySixMonthNetCapital, currency)}</span>
                  </div>

                  <button
                    onClick={() => onInspectUniverse('A')}
                    className="w-full mt-3 py-1.5 rounded bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-[11px] font-mono font-medium flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Inspect 36M Schedule</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Universe B Card */}
              <div className="p-5 rounded-xl border border-[#0d1c32]/25 bg-white shadow-xs hover:border-[#0d1c32] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase font-bold text-[#0b1c30]">Universe B</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#d3e4fe] text-[#0b1c30]">
                      Resilient
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#0b1c30]">Delay 6 Months</h4>
                  <p className="text-xs text-[#44474d] mb-4">
                    Compounded safety runway accumulation.
                  </p>
                </div>

                <div className="space-y-2 border-t border-[#c5c6cd]/30 pt-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">Monthly EMI:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeB.emi, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">12M Reserve:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeB.twelveMonthReserve, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">Peak Debt:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeB.peakDebt, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">36M Net Capital:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeB.thirtySixMonthNetCapital, currency)}</span>
                  </div>

                  <button
                    onClick={() => onInspectUniverse('B')}
                    className="w-full mt-3 py-1.5 rounded bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-[11px] font-mono font-medium flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Inspect 36M Schedule</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Universe C Card */}
              <div className="p-5 rounded-xl border border-[#515f78]/30 bg-[#eff4ff]/60 shadow-xs hover:border-[#515f78] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase font-bold text-[#515f78]">Universe C</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#0b1c30]">
                      Optimal
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#0b1c30]">Alternative Plan</h4>
                  <p className="text-xs text-[#44474d] mb-4">
                    Down payment + compressed tenure.
                  </p>
                </div>

                <div className="space-y-2 border-t border-[#c5c6cd]/30 pt-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">Monthly EMI:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeC.emi, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">12M Reserve:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeC.twelveMonthReserve, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">Peak Debt:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeC.peakDebt, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">36M Net Capital:</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(universeC.thirtySixMonthNetCapital, currency)}</span>
                  </div>

                  <button
                    onClick={() => onInspectUniverse('C')}
                    className="w-full mt-3 py-1.5 rounded bg-white hover:bg-[#e5eeff] text-[#0b1c30] text-[11px] font-mono font-medium flex items-center justify-center gap-1 transition-all cursor-pointer border border-[#c5c6cd]/40"
                  >
                    <span>Inspect 36M Schedule</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive SVG Trajectory Chart */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#eff4ff] border border-[#c5c6cd]/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#c5c6cd]/30 gap-3">
                <div>
                  <h4 className="text-base font-bold text-[#0b1c30]">
                    Projected Multi-Universe Trajectory (36-Month Horizon)
                  </h4>
                  <p className="text-xs text-[#44474d]">
                    Hover over chart to inspect month-by-month values across all 3 universes
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Metric Switcher */}
                  <div className="inline-flex items-center bg-white rounded-md p-0.5 border border-[#c5c6cd]/40 text-xs font-mono">
                    <button
                      onClick={() => setChartMetric('cash')}
                      className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                        chartMetric === 'cash'
                          ? 'bg-[#0d1c32] text-white font-bold'
                          : 'text-[#44474d] hover:text-[#0b1c30]'
                      }`}
                    >
                      Cash Buffer
                    </button>
                    <button
                      onClick={() => setChartMetric('netCapital')}
                      className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                        chartMetric === 'netCapital'
                          ? 'bg-[#0d1c32] text-white font-bold'
                          : 'text-[#44474d] hover:text-[#0b1c30]'
                      }`}
                    >
                      Net Capital
                    </button>
                    <button
                      onClick={() => setChartMetric('debt')}
                      className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                        chartMetric === 'debt'
                          ? 'bg-[#0d1c32] text-white font-bold'
                          : 'text-[#44474d] hover:text-[#0b1c30]'
                      }`}
                    >
                      Remaining Debt
                    </button>
                  </div>

                  {/* Export CSV button */}
                  <button
                    onClick={handleDownloadCSV}
                    className="p-1.5 rounded-lg bg-white border border-[#c5c6cd]/50 text-[#0b1c30] hover:bg-[#dce9ff] transition-all cursor-pointer"
                    title="Export 36-month trajectory dataset to CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono py-2 text-[#44474d]">
                <div className="flex items-center gap-4">
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

                <div className="text-[11px] text-[#75777e]">
                  Max Scale: {formatCurrency(maxVal, currency)}
                </div>
              </div>

              {/* Interactive SVG Chart Container */}
              <div 
                className="relative mt-2 h-60 w-full bg-white rounded-lg border border-[#c5c6cd]/30 p-2 cursor-crosshair select-none"
                onMouseLeave={() => setHoveredMonth(null)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - paddingX;
                  const ratio = Math.max(0, Math.min(1, x / graphWidth));
                  const m = Math.round(ratio * 36);
                  setHoveredMonth(m);
                }}
              >
                <svg 
                  className="w-full h-full overflow-visible" 
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  preserveAspectRatio="none"
                >
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                    const y = paddingY + graphHeight * pct;
                    return (
                      <line
                        key={idx}
                        x1={paddingX}
                        x2={svgWidth - paddingX}
                        y1={y}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="4,4"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Month Vertical Guidelines */}
                  {[0, 6, 12, 18, 24, 30, 36].map((m) => {
                    const x = getSvgX(m);
                    return (
                      <line
                        key={m}
                        x1={x}
                        x2={x}
                        y1={paddingY}
                        y2={svgHeight - paddingY}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Curve A (Wine Red) */}
                  <path
                    d={buildPath(universeA)}
                    fill="none"
                    stroke="#9a4152"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Curve B (Navy Blue) */}
                  <path
                    d={buildPath(universeB)}
                    fill="none"
                    stroke="#0d1c32"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Curve C (Slate Tint) */}
                  <path
                    d={buildPath(universeC)}
                    fill="none"
                    stroke="#515f78"
                    strokeDasharray="5,4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Hover Scrubber Line & Dot */}
                  {hoveredMonth !== null && (
                    <g>
                      <line
                        x1={getSvgX(hoveredMonth)}
                        x2={getSvgX(hoveredMonth)}
                        y1={paddingY}
                        y2={svgHeight - paddingY}
                        stroke="#0b1c30"
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                      />
                      <circle
                        cx={getSvgX(hoveredMonth)}
                        cy={getSvgY(getMetricValue(universeA, hoveredMonth))}
                        r="4"
                        fill="#9a4152"
                      />
                      <circle
                        cx={getSvgX(hoveredMonth)}
                        cy={getSvgY(getMetricValue(universeB, hoveredMonth))}
                        r="4"
                        fill="#0d1c32"
                      />
                      <circle
                        cx={getSvgX(hoveredMonth)}
                        cy={getSvgY(getMetricValue(universeC, hoveredMonth))}
                        r="4"
                        fill="#515f78"
                      />
                    </g>
                  )}
                </svg>

                {/* Floating Tooltip during scrub */}
                {activeHoverData && (
                  <div
                    className="absolute top-2 z-20 pointer-events-none bg-[#0d1c32] text-white p-2.5 rounded-lg text-xs font-mono shadow-xl border border-white/20 transition-all"
                    style={{
                      left: Math.min(window.innerWidth > 640 ? 440 : 150, Math.max(10, (activeHoverData.month / 36) * (graphWidth * 0.75))),
                    }}
                  >
                    <div className="font-bold text-[#d3e4fe] border-b border-white/20 pb-1 mb-1">
                      Month {activeHoverData.month} Telemetry
                    </div>
                    <div className="space-y-0.5 text-[11px]">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#ffd9dd]">Univ A:</span>
                        <span className="font-bold">{formatCurrency(activeHoverData.valA, currency)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#d6e3ff]">Univ B:</span>
                        <span className="font-bold">{formatCurrency(activeHoverData.valB, currency)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#e2dfff]">Univ C:</span>
                        <span className="font-bold">{formatCurrency(activeHoverData.valC, currency)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* X-Axis Month Legend */}
              <div className="flex justify-between text-[11px] font-mono text-[#44474d] pt-2 px-3">
                <span>Month 0</span>
                <span>Month 6</span>
                <span>Month 12</span>
                <span>Month 18</span>
                <span>Month 24</span>
                <span>Month 30</span>
                <span>Month 36</span>
              </div>

              {/* Analytical Takeaway strip */}
              <div className="mt-4 p-3 rounded-lg bg-white border border-[#c5c6cd]/40 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#0b1c30]">
                  <Sparkles className="w-4 h-4 text-[#9a4152] shrink-0" />
                  <span>
                    <strong>Insight:</strong> Universe B builds {formatCurrency(Math.max(0, universeB.twelveMonthReserve - universeA.twelveMonthReserve), currency)} more cash runway before debt servicing begins.
                  </span>
                </div>
                <span className="font-bold text-[#0d1c32] shrink-0 bg-[#e5eeff] px-2 py-0.5 rounded">
                  0% Insolvent Overdraft
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
