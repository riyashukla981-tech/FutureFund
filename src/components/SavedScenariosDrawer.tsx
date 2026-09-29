import React from 'react';
import { CurrencyCode, formatCurrency } from '../utils/financeMath';
import { SavedScenario, ScenarioInput } from '../types/finance';
import { X, Bookmark, Trash2, ArrowUpRight, Plus, FolderOpen } from 'lucide-react';

interface SavedScenariosDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedScenarios: SavedScenario[];
  onLoadScenario: (scenario: SavedScenario) => void;
  onDeleteScenario: (id: string) => void;
  onClearAll: () => void;
  currency: CurrencyCode;
}

export const SavedScenariosDrawer: React.FC<SavedScenariosDrawerProps> = ({
  isOpen,
  onClose,
  savedScenarios,
  onLoadScenario,
  onDeleteScenario,
  onClearAll,
  currency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#c5c6cd]/50 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#c5c6cd]/40 flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#9a4152]" />
            <h3 className="text-base font-bold text-[#0b1c30]">
              Saved Scenario Benchmarks ({savedScenarios.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#44474d] hover:bg-[#eff4ff] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedScenarios.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#75777e] space-y-3">
              <FolderOpen className="w-10 h-10 stroke-[1.5]" />
              <p className="text-xs font-mono">
                No scenarios saved yet. Use "Save Snapshot" in the simulation studio to bookmark and compare multivariate decisions.
              </p>
            </div>
          ) : (
            savedScenarios.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-[#c5c6cd]/50 bg-[#eff4ff]/40 hover:bg-[#eff4ff] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#0b1c30]">{s.name}</h4>
                    <span className="text-[10px] font-mono text-[#75777e]">
                      {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {formatCurrency(s.inputs.loanAmount, currency)} ({s.inputs.interestRate}% APR)
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDeleteScenario(s.id)}
                      className="p-1.5 text-[#75777e] hover:text-[#ba1a1a] rounded hover:bg-white transition-colors cursor-pointer"
                      title="Delete this scenario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onLoadScenario(s)}
                      className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#0d1c32] hover:bg-black text-white rounded flex items-center gap-1 transition-all cursor-pointer"
                      title="Load into simulation workspace"
                    >
                      <span>Load</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Comparative metrics breakdown */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#c5c6cd]/30 text-[11px] font-mono">
                  <div className="p-2 bg-white rounded border border-[#c5c6cd]/30">
                    <div className="text-[9px] text-[#75777e]">Univ A EMI</div>
                    <div className="font-bold text-[#9a4152]">{formatCurrency(s.results.emiA, currency)}</div>
                  </div>
                  <div className="p-2 bg-white rounded border border-[#c5c6cd]/30">
                    <div className="text-[9px] text-[#75777e]">12M Buffer</div>
                    <div className="font-bold text-[#0b1c30]">{formatCurrency(s.results.reserveA, currency)}</div>
                  </div>
                  <div className="p-2 bg-white rounded border border-[#c5c6cd]/30">
                    <div className="text-[9px] text-[#75777e]">36M Equity</div>
                    <div className="font-bold text-[#0d1c32]">{formatCurrency(s.results.netWorthA, currency)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedScenarios.length > 0 && (
          <div className="p-4 border-t border-[#c5c6cd]/40 bg-[#f8f9ff] flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs font-mono text-[#ba1a1a] hover:underline cursor-pointer"
            >
              Clear All Benchmarks
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#0d1c32] text-white text-xs font-mono font-medium hover:bg-black cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
