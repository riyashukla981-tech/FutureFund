import React, { useState } from 'react';
import { 
  CurrencyCode, 
  formatCurrency, 
  UniverseResult, 
  MonthData,
  exportTrajectoriesToCSV 
} from '../utils/financeMath';
import { X, Download, Search, Table, CheckCircle2 } from 'lucide-react';

interface AmortizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  universeA: UniverseResult;
  universeB: UniverseResult;
  universeC: UniverseResult;
  initialUniverseId?: 'A' | 'B' | 'C';
  currency: CurrencyCode;
}

export const AmortizationModal: React.FC<AmortizationModalProps> = ({
  isOpen,
  onClose,
  universeA,
  universeB,
  universeC,
  initialUniverseId = 'A',
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C'>(initialUniverseId);
  const [monthFilter, setMonthFilter] = useState('');

  if (!isOpen) return null;

  const currentUniv = activeTab === 'A' ? universeA : activeTab === 'B' ? universeB : universeC;

  const filteredTrajectory = currentUniv.monthlyTrajectory.filter((m: MonthData) => {
    if (!monthFilter.trim()) return true;
    return m.month.toString().includes(monthFilter.trim());
  });

  const handleExportCSV = () => {
    const csv = exportTrajectoriesToCSV(universeA, universeB, universeC);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `futurefund_ledger_${currentUniv.id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-[#c5c6cd]/60 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#c5c6cd]/40 flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#0d1c32] text-white">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0b1c30]">
                36-Month Amortization & Cashflow Schedule
              </h3>
              <p className="text-xs text-[#44474d]">
                Detailed month-by-month cash balances, debt amortization, and equity evolution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#c5c6cd]/60 hover:bg-[#eff4ff] text-xs font-mono font-medium text-[#0b1c30] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#eff4ff] text-[#44474d] hover:text-[#0b1c30] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Controls: Tabs + Filter */}
        <div className="px-6 py-3 border-b border-[#c5c6cd]/30 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Universe Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#eff4ff] rounded-lg text-xs font-mono">
            <button
              onClick={() => setActiveTab('A')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'A'
                  ? 'bg-white text-[#9a4152] shadow-xs'
                  : 'text-[#44474d] hover:text-[#0b1c30]'
              }`}
            >
              Universe A (Do It Now)
            </button>
            <button
              onClick={() => setActiveTab('B')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'B'
                  ? 'bg-white text-[#0d1c32] shadow-xs'
                  : 'text-[#44474d] hover:text-[#0b1c30]'
              }`}
            >
              Universe B (Delay 6M)
            </button>
            <button
              onClick={() => setActiveTab('C')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'C'
                  ? 'bg-white text-[#515f78] shadow-xs'
                  : 'text-[#44474d] hover:text-[#0b1c30]'
              }`}
            >
              Universe C (Optimized)
            </button>
          </div>

          {/* Month Search Filter */}
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#75777e]" />
            <input
              type="text"
              placeholder="Filter month (e.g. 12)..."
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-[#eff4ff] border border-[#c5c6cd]/50 rounded-lg text-[#0b1c30] focus:outline-none"
            />
          </div>
        </div>

        {/* Tabular Schedule */}
        <div className="flex-1 overflow-auto p-6 bg-white">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#c5c6cd]/60 bg-[#eff4ff]/60 text-[#44474d]">
                <th className="py-2.5 px-3 font-semibold">Month</th>
                <th className="py-2.5 px-3 font-semibold">Starting Cash</th>
                <th className="py-2.5 px-3 font-semibold">Net Income</th>
                <th className="py-2.5 px-3 font-semibold">Living Exp</th>
                <th className="py-2.5 px-3 font-semibold">Debt EMI</th>
                <th className="py-2.5 px-3 font-semibold">Ending Cash</th>
                <th className="py-2.5 px-3 font-semibold">Remaining Debt</th>
                <th className="py-2.5 px-3 font-semibold">Total Net Capital</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrajectory.map((row: MonthData) => {
                const isDip = row.endingCash === currentUniv.minCashReserve;
                return (
                  <tr
                    key={row.month}
                    className={`border-b border-[#c5c6cd]/25 hover:bg-[#eff4ff]/50 transition-colors ${
                      isDip ? 'bg-[#ffd9dd]/20 font-bold' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-[#0b1c30] font-bold">
                      M{row.month} {isDip && <span className="text-[#9a4152] text-[10px] ml-1">(Lowest Dip)</span>}
                    </td>
                    <td className="py-2 px-3 text-[#44474d]">{formatCurrency(row.startingCash, currency)}</td>
                    <td className="py-2 px-3 text-[#0b1c30]">{formatCurrency(row.income, currency)}</td>
                    <td className="py-2 px-3 text-[#44474d]">-{formatCurrency(row.livingExpenses, currency)}</td>
                    <td className="py-2 px-3 text-[#9a4152]">
                      {row.emi > 0 ? `-${formatCurrency(row.emi, currency)}` : '₹0'}
                    </td>
                    <td className={`py-2 px-3 font-bold ${row.endingCash < 0 ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'}`}>
                      {formatCurrency(row.endingCash, currency)}
                    </td>
                    <td className="py-2 px-3 text-[#515f78]">{formatCurrency(row.remainingDebt, currency)}</td>
                    <td className="py-2 px-3 font-bold text-[#0d1c32]">{formatCurrency(row.totalNetEquity, currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#c5c6cd]/40 bg-[#f8f9ff] flex items-center justify-between text-xs font-mono text-[#44474d]">
          <span>
            Active Path: <strong>{currentUniv.title}</strong> · EMI: <strong>{formatCurrency(currentUniv.emi, currency)}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0d1c32] text-white text-xs font-semibold hover:bg-black cursor-pointer"
          >
            Close Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
