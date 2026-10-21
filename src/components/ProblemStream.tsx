import React, { useState } from 'react';
import { Problem, FilterOptions } from '../types';
import { ProblemCard } from './ProblemCard';
import { Search, Sparkles, AlertCircle, Calendar, DollarSign, ArrowUpDown, Zap, History, Globe } from 'lucide-react';
import { formatMRR } from '../utils/problemRules';

interface ProblemStreamProps {
  problems: Problem[];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onOpenDetail: (problem: Problem) => void;
  onOpenAgentStudio: (problem: Problem) => void;
  onOpenBusiness?: (problem: Problem) => void;
  onToggleSave: (problemId: string) => void;
  onScanClick: () => void;
  onSearchInternetLive?: (query: string) => void;
  isLoading: boolean;
}

export const ProblemStream: React.FC<ProblemStreamProps> = ({
  problems,
  filters,
  setFilters,
  onOpenDetail,
  onOpenAgentStudio,
  onOpenBusiness,
  onToggleSave,
  onScanClick,
  onSearchInternetLive,
  isLoading,
}) => {
  // Calculate total MRR of the currently filtered view
  const currentTotalMRR = problems.reduce((acc, p) => acc + (p.onlineBusiness?.monthlyRevenue || 0), 0);
  const [isSearchingLive, setIsSearchingLive] = useState(false);

  const handleTriggerLiveSearch = async (queryText?: string) => {
    const q = (queryText || filters.searchQuery || '').trim();
    if (!q || !onSearchInternetLive) return;
    setIsSearchingLive(true);
    try {
      await onSearchInternetLive(q);
    } finally {
      setIsSearchingLive(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Controls Bar: Domain Tabs + Search */}
      <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        {/* Source Mode Switcher: All | Live Real-Time | 1-Year Archive */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, sourceType: 'all' }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                (!filters.sourceType || filters.sourceType === 'all')
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Problems</span>
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, sourceType: 'live' }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                filters.sourceType === 'live'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>⚡ Live Real-Time</span>
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, sourceType: 'archive' }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                filters.sourceType === 'archive'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>🗂 1-Year Archive</span>
            </button>
          </div>

          {/* Automatic Save Indicator */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Auto-Saved to Storage</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Left: Domain Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, domain: 'all' }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                filters.domain === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Domains
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, domain: 'business' }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                filters.domain === 'business'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Business & B2B
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, domain: 'daily_life' }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                filters.domain === 'daily_life'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Life & Habits
            </button>
          </div>

          {/* Search Box with Real-Time Internet Search Action */}
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search archive or type requirement (e.g. shopify, invoices)..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filters.searchQuery.trim()) {
                    handleTriggerLiveSearch();
                  }
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Direct 1-Click "Find Live" button */}
            {onSearchInternetLive && (
              <button
                type="button"
                onClick={() => handleTriggerLiveSearch()}
                disabled={isSearchingLive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 rounded-lg shrink-0 transition-colors shadow-sm"
                title="Search internet for this requirement in real-time"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isSearchingLive ? 'Scanning...' : 'Find Live'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Requirement Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
          <span className="text-slate-500 font-mono">Popular:</span>
          {[
            'Freelance Invoicing',
            'Shopify Inventory',
            'Lease Security Deposits',
            'Meal Planning & Food Waste',
            'Elderly Care & Medication',
            'Solopreneur Tax Receipts',
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setFilters((prev) => ({ ...prev, searchQuery: topic }));
                handleTriggerLiveSearch(topic);
              }}
              className="px-2 py-0.5 rounded bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Time Range (1-Year Archive), Revenue Tier, Category, Sort */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-800/80">
          {/* Time Range Filter (Past 1 Year Archive) */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={filters.timeRange || 'all_year'}
              onChange={(e) => setFilters((prev) => ({ ...prev, timeRange: e.target.value }))}
              className="bg-transparent text-slate-300 focus:outline-none text-xs cursor-pointer"
              aria-label="Filter by time archive"
            >
              <option value="all_year" className="bg-slate-900 text-slate-200">Past 1 Year Archive (All 12 Months)</option>
              <option value="last_30_days" className="bg-slate-900 text-slate-200">Last 30 Days</option>
              <option value="last_90_days" className="bg-slate-900 text-slate-200">Last 90 Days</option>
              <option value="last_6_months" className="bg-slate-900 text-slate-200">Last 6 Months</option>
              <option value="last_1_year" className="bg-slate-900 text-slate-200">Full 1 Year Window</option>
              <optgroup label="Filter by Specific Month" className="bg-slate-900 text-slate-400">
                <option value="2026-10" className="bg-slate-900 text-slate-200">October 2026</option>
                <option value="2026-09" className="bg-slate-900 text-slate-200">September 2026</option>
                <option value="2026-08" className="bg-slate-900 text-slate-200">August 2026</option>
                <option value="2026-07" className="bg-slate-900 text-slate-200">July 2026</option>
                <option value="2026-06" className="bg-slate-900 text-slate-200">June 2026</option>
                <option value="2026-05" className="bg-slate-900 text-slate-200">May 2026</option>
                <option value="2026-04" className="bg-slate-900 text-slate-200">April 2026</option>
                <option value="2026-03" className="bg-slate-900 text-slate-200">March 2026</option>
                <option value="2026-02" className="bg-slate-900 text-slate-200">February 2026</option>
                <option value="2026-01" className="bg-slate-900 text-slate-200">January 2026</option>
                <option value="2025-12" className="bg-slate-900 text-slate-200">December 2025</option>
                <option value="2025-11" className="bg-slate-900 text-slate-200">November 2025</option>
                <option value="2025-10" className="bg-slate-900 text-slate-200">October 2025</option>
              </optgroup>
            </select>
          </div>

          {/* Revenue Tier Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={filters.revenueTier || 'all'}
              onChange={(e) => setFilters((prev) => ({ ...prev, revenueTier: e.target.value as any }))}
              className="bg-transparent text-slate-300 focus:outline-none text-xs cursor-pointer"
              aria-label="Filter by monthly revenue tier"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Revenue Tiers</option>
              <option value="high_mrr" className="bg-slate-900 text-slate-200">High Revenue (&gt; $20k/mo MRR)</option>
              <option value="mid_mrr" className="bg-slate-900 text-slate-200">Mid Revenue ($5k - $20k/mo MRR)</option>
              <option value="starter_mrr" className="bg-slate-900 text-slate-200">Starter Tier (&lt; $5k/mo MRR)</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="px-2.5 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            aria-label="Filter by category"
          >
            <option value="all" className="bg-slate-900 text-slate-200">All Categories</option>
            <option value="operations" className="bg-slate-900 text-slate-200">Operations</option>
            <option value="productivity" className="bg-slate-900 text-slate-200">Productivity</option>
            <option value="freelance" className="bg-slate-900 text-slate-200">Freelance & Agency</option>
            <option value="ecommerce" className="bg-slate-900 text-slate-200">E-Commerce</option>
            <option value="finance" className="bg-slate-900 text-slate-200">Finance</option>
            <option value="lifestyle" className="bg-slate-900 text-slate-200">Lifestyle</option>
            <option value="marketing" className="bg-slate-900 text-slate-200">Marketing</option>
          </select>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-transparent text-slate-300 focus:outline-none text-xs cursor-pointer"
              aria-label="Sort problems"
            >
              <option value="opportunity" className="bg-slate-900 text-slate-200">Highest Opportunity Score</option>
              <option value="revenue" className="bg-slate-900 text-slate-200">Highest Monthly Revenue (MRR)</option>
              <option value="trending" className="bg-slate-900 text-slate-200">Trending (Reddit Upvotes)</option>
              <option value="solvability" className="bg-slate-900 text-slate-200">Highest AI Feasibility</option>
              <option value="newest" className="bg-slate-900 text-slate-200">Most Recent Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stream Metrics Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-1 font-mono">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tabular-nums">{problems.length}</span>
          <span>problems matched in view</span>
          <span className="text-slate-600">·</span>
          <span>Spanning past 12-month archive (Oct 2025 - Oct 2026)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Total Online Business MRR:</span>
          <span className="font-bold text-emerald-400 tabular-nums">
            {formatMRR(currentTotalMRR)}
          </span>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 animate-pulse space-y-4">
              <div className="h-4 bg-slate-800 rounded w-1/3"></div>
              <div className="h-6 bg-slate-800 rounded w-3/4"></div>
              <div className="h-14 bg-slate-800/60 rounded"></div>
              <div className="h-10 bg-slate-800/40 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Main Problems Grid */}
      {!isLoading && problems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onOpenDetail={onOpenDetail}
              onOpenAgentStudio={onOpenAgentStudio}
              onOpenBusiness={onOpenBusiness}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && problems.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white mb-1">
            No matching problems found
          </h4>
          <p className="text-xs text-slate-400 mb-5">
            Try adjusting your time range, revenue tier, or search filters, or trigger a live radar scan to scrape fresh pain points from Reddit discussions.
          </p>
          <button
            onClick={onScanClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan Internet Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
