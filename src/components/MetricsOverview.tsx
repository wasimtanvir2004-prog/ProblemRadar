import React from 'react';
import { ProblemStats } from '../types';
import { Target, Clock, Zap, Building2, Coffee, DollarSign, Award, Calendar } from 'lucide-react';
import { formatMRR } from '../utils/problemRules';

interface MetricsOverviewProps {
  stats: ProblemStats;
  onFilterDomain: (domain: 'all' | 'business' | 'daily_life') => void;
  activeDomain: 'all' | 'business' | 'daily_life';
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  stats,
  onFilterDomain,
  activeDomain,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 my-6">
      {/* Metric 1: Total Internet Pain Points (Past 1 Year) */}
      <div 
        onClick={() => onFilterDomain('all')}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          activeDomain === 'all'
            ? 'bg-slate-900/90 border-emerald-500/50 shadow-sm'
            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Past 1 Year Archive</span>
          <Calendar className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-white">
          {stats.totalTracked}
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {stats.businessCount} B2B · {stats.dailyLifeCount} Daily Life
        </div>
      </div>

      {/* Metric 2: Total Online Revenue Tracked */}
      <div className="p-4 rounded-xl border bg-slate-900/50 border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Total Online Business MRR</span>
          <DollarSign className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
          ${stats.totalMonthlyRevenueTracked.toLocaleString()}
          <span className="text-xs font-normal text-slate-400 font-sans">/mo</span>
        </div>
        <div className="text-xs text-slate-400 mt-1 font-mono">
          Avg ${stats.avgMonthlyRevenue.toLocaleString()}/mo per solution
        </div>
      </div>

      {/* Metric 3: Top Revenue Business */}
      <div className="p-4 rounded-xl border bg-slate-900/50 border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Top Earning Business</span>
          <Award className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-base font-bold text-white truncate pt-0.5">
          {stats.topEarningBusiness.name}
        </div>
        <div className="text-xs text-emerald-400 mt-1 font-mono font-semibold tabular-nums">
          {formatMRR(stats.topEarningBusiness.revenue)}
        </div>
      </div>

      {/* Metric 4: Monthly Hours Reclaimable with AI */}
      <div className="p-4 rounded-xl border bg-slate-900/50 border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Reclaimable Time / Mo</span>
          <Clock className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-blue-400 flex items-baseline gap-1">
          <span>{stats.estimatedMonthlyHoursSavable.toLocaleString()}</span>
          <span className="text-sm font-normal text-slate-400">hrs</span>
        </div>
        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Avg {stats.avgSolvabilityScore}% AI solvable</span>
        </div>
      </div>
    </div>
  );
};
