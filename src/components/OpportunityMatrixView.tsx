import React from 'react';
import { Problem } from '../types';
import { TrendingUp, Bot, ArrowUpRight } from 'lucide-react';

interface OpportunityMatrixViewProps {
  problems: Problem[];
  onOpenDetail: (problem: Problem) => void;
  onOpenAgentStudio: (problem: Problem) => void;
}

export const OpportunityMatrixView: React.FC<OpportunityMatrixViewProps> = ({
  problems,
  onOpenDetail,
  onOpenAgentStudio,
}) => {
  // Categorize problems into quadrants
  const goldmines = problems.filter((p) => p.frequencyScore >= 85 && p.willingnessToPayScore >= 75);
  const everydayRelief = problems.filter((p) => p.frequencyScore >= 85 && p.willingnessToPayScore < 75);
  const highTicket = problems.filter((p) => p.frequencyScore < 85 && p.willingnessToPayScore >= 75);
  const nicheUtilities = problems.filter((p) => p.frequencyScore < 85 && p.willingnessToPayScore < 75);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
            Problem Opportunity Quadrant Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-referencing Problem Frequency against Commercial Willingness to Pay to prioritize AI Automation builds.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            Goldmine (High WTP + High Freq)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            Daily Life Relief
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quadrant 1: Goldmine Automations */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-emerald-500/40 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                Quadrant 1: Goldmine Automations
              </span>
              <p className="text-[11px] text-slate-400">
                Extremely frequent pain point with high commercial willingness to pay.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              {goldmines.length} Problems
            </span>
          </div>

          <div className="space-y-2.5">
            {goldmines.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                    <span className="text-slate-300 font-medium">{p.source.subreddit}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-mono font-bold">{p.opportunityScore}/100</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate group-hover:text-emerald-300 transition-colors">
                    {p.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onOpenAgentStudio(p)}
                    className="p-1.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 transition-colors"
                    title="Solve with Agent"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenDetail(p)}
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Deep Dive"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 2: High-Ticket Operations */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-blue-500/30 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider block">
                Quadrant 2: High-Ticket Operations
              </span>
              <p className="text-[11px] text-slate-400">
                Critical severity transactions where mistakes cost thousands.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/30">
              {highTicket.length} Problems
            </span>
          </div>

          <div className="space-y-2.5">
            {highTicket.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                    <span className="text-slate-300 font-medium">{p.source.subreddit}</span>
                    <span>·</span>
                    <span className="text-blue-400 font-mono font-bold">{p.opportunityScore}/100</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                    {p.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onOpenAgentStudio(p)}
                    className="p-1.5 rounded-md bg-blue-950/80 hover:bg-blue-900 text-blue-300 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenDetail(p)}
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 3: Daily Life & Habit Relief */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-amber-500/30 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                Quadrant 3: Everyday Life & Friction Relief
              </span>
              <p className="text-[11px] text-slate-400">
                High frequency daily annoyance that drains energy and leads to burnout.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
              {everydayRelief.length} Problems
            </span>
          </div>

          <div className="space-y-2.5">
            {everydayRelief.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                    <span className="text-slate-300 font-medium">{p.source.subreddit}</span>
                    <span>·</span>
                    <span className="text-amber-400 font-mono font-bold">{p.opportunityScore}/100</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
                    {p.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onOpenAgentStudio(p)}
                    className="p-1.5 rounded-md bg-amber-950/80 hover:bg-amber-900 text-amber-300 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenDetail(p)}
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 4: Specialized Utilities */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
                Quadrant 4: Specialized Utilities
              </span>
              <p className="text-[11px] text-slate-400">
                Focused micro-problems with simple automation pipelines.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {nicheUtilities.length} Problems
            </span>
          </div>

          <div className="space-y-2.5">
            {nicheUtilities.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                    <span className="text-slate-300 font-medium">{p.source.subreddit}</span>
                    <span>·</span>
                    <span className="text-slate-400 font-mono font-bold">{p.opportunityScore}/100</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate">
                    {p.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onOpenAgentStudio(p)}
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
