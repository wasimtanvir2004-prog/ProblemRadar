import React, { useState } from 'react';
import { Problem, ProblemStats } from '../types';
import { Clock, DollarSign, Zap, BarChart3, ShieldCheck } from 'lucide-react';
import { estimateSavedHoursPerMonth } from '../utils/problemRules';

interface AnalyticsROIViewProps {
  problems: Problem[];
  stats: ProblemStats;
  onOpenAgentStudio: (problem: Problem) => void;
}

export const AnalyticsROIView: React.FC<AnalyticsROIViewProps> = ({
  problems,
  stats,
  onOpenAgentStudio,
}) => {
  const [hourlyRate, setHourlyRate] = useState<number>(45);

  const totalMonthlySavings = stats.estimatedMonthlyHoursSavable * hourlyRate;
  const annualSavings = totalMonthlySavings * 12;

  // Group problems by category
  const categoryStats = problems.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group problems by subreddit
  const subredditStats = problems.reduce((acc, p) => {
    const sub = p.source.subreddit || 'r/all';
    acc[sub] = (acc[sub] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Top Banner ROI Calculator */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
            Autonomous Agent Financial ROI
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            ${totalMonthlySavings.toLocaleString()}{' '}
            <span className="text-sm font-normal text-slate-400">/ month reclaimed across tracked problems</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Based on eliminating manual data entry, repetitive client emails, recipe brainstorming, and administrative follow-ups via Gemini 3.8 Flash automation agents.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4 shrink-0">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Your Hourly Labor Valuation ($/hr)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400 font-mono">$</span>
              <input
                type="number"
                min="10"
                max="500"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
                className="w-20 p-1.5 text-xs font-mono bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="pl-4 border-l border-slate-800 text-xs">
            <span className="text-slate-500 block">Annualized Yield</span>
            <span className="font-mono font-bold text-emerald-400 text-base">
              ${annualSavings.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Concentration */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Pain Point Volume by Category</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {Object.keys(categoryStats).length} Verticals
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryStats).map(([cat, count]) => {
              const percentage = Math.round((count / problems.length) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize text-slate-300 font-medium">{cat}</span>
                    <span className="font-mono text-slate-400">{count} problems ({percentage}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subreddit Complaint Sources */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Top Reddit Community Ingestion Points</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Live Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(subredditStats).map(([sub, count]) => (
              <div
                key={sub}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{sub}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-mono">
                  <span>{count} pain point{count === 1 ? '' : 's'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
