import React from 'react';
import { Radar, Plus, Sparkles, Bookmark } from 'lucide-react';

interface HeaderProps {
  onScanClick: () => void;
  onAddClick: () => void;
  onSavedClick: () => void;
  savedCount: number;
  activeTab: 'stream' | 'matrix' | 'analytics';
  setActiveTab: (tab: 'stream' | 'matrix' | 'analytics') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onScanClick,
  onAddClick,
  onSavedClick,
  savedCount,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            ProblemRadar
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('stream')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'stream' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Internet Problems
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'matrix' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Opportunity Matrix
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'analytics' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Automation ROI
          </button>
          <button
            onClick={onSavedClick}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Bookmark className="w-4 h-4 text-slate-400" />
            <span>Saved Agents</span>
            {savedCount > 0 && (
              <span className="text-xs font-mono tabular-nums text-emerald-400">
                ({savedCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onAddClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            aria-label="Add custom pain point"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Pain Point</span>
          </button>
          <button
            onClick={onScanClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-sm shadow-emerald-500/20 whitespace-nowrap shrink-0"
            aria-label="Scan internet for fresh problems"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan Internet Today</span>
          </button>
        </div>
      </div>
    </header>
  );
};
