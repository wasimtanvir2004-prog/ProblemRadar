import React, { useState, useEffect, useMemo } from 'react';
import { Problem, FilterOptions, AgentSolution } from './types';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { ProblemStream } from './components/ProblemStream';
import { ProblemDetailModal } from './components/ProblemDetailModal';
import { AgentStudioModal } from './components/AgentStudioModal';
import { BusinessSolutionModal } from './components/BusinessSolutionModal';
import { ScanModal } from './components/ScanModal';
import { AddProblemModal } from './components/AddProblemModal';
import { SavedAgentsDrawer } from './components/SavedAgentsDrawer';
import { OpportunityMatrixView } from './components/OpportunityMatrixView';
import { AnalyticsROIView } from './components/AnalyticsROIView';
import { filterProblems, sortProblems, calculateStats } from './utils/problemRules';
import { Sparkles, Plus, Radio, ArrowRight, Rocket } from 'lucide-react';

export default function App() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stream' | 'matrix' | 'analytics'>('stream');

  // Filter state including 1-year timeline and MRR tier
  const [filters, setFilters] = useState<FilterOptions>({
    domain: 'all',
    category: 'all',
    searchQuery: '',
    severity: 'all',
    sortBy: 'opportunity',
    timeRange: 'all_year',
    revenueTier: 'all',
  });

  // Modal states
  const [detailProblem, setDetailProblem] = useState<Problem | null>(null);
  const [studioProblem, setStudioProblem] = useState<Problem | null>(null);
  const [businessProblem, setBusinessProblem] = useState<Problem | null>(null);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Saved Agent IDs
  const [savedProblemIds, setSavedProblemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('problem_radar_saved');
      return saved ? JSON.parse(saved) : ['prob-invoice-ghosting', 'prob-fridge-rot-dinner'];
    } catch {
      return ['prob-invoice-ghosting'];
    }
  });

  // Fetch problems from server
  const loadProblems = async () => {
    try {
      const res = await fetch('/api/problems');
      const data = await res.json();
      if (data.success && data.problems) {
        setProblems(data.problems);
      }
    } catch (err) {
      console.error('Failed to load problems from server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  // Sync saved agents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('problem_radar_saved', JSON.stringify(savedProblemIds));
    } catch (e) {
      // ignore
    }
  }, [savedProblemIds]);

  const handleToggleSave = (problemId: string) => {
    setSavedProblemIds((prev) => {
      const exists = prev.includes(problemId);
      if (exists) {
        return prev.filter((id) => id !== problemId);
      } else {
        return [...prev, problemId];
      }
    });
  };

  const handleSaveAgent = (problemId: string, solution: AgentSolution) => {
    // update problem in local state with latest solution
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return { ...p, agentSolution: solution, status: 'agent_ready' };
        }
        return p;
      })
    );

    if (!savedProblemIds.includes(problemId)) {
      setSavedProblemIds((prev) => [...prev, problemId]);
    }

    setNotification(`Agent "${solution.agentName}" saved to your portfolio.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRemoveSaved = (problemId: string) => {
    setSavedProblemIds((prev) => prev.filter((id) => id !== problemId));
  };

  // Filtered & sorted problem set
  const filteredProblems = useMemo(() => {
    const matched = filterProblems(problems, filters);
    return sortProblems(matched, filters.sortBy);
  }, [problems, filters]);

  // Overall stats
  const stats = useMemo(() => {
    return calculateStats(problems);
  }, [problems]);

  // Saved problems list
  const savedProblems = useMemo(() => {
    return problems.filter((p) => savedProblemIds.includes(p.id));
  }, [problems, savedProblemIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Header
        onScanClick={() => setIsScanOpen(true)}
        onAddClick={() => setIsAddOpen(true)}
        onSavedClick={() => setIsSavedDrawerOpen(true)}
        savedCount={savedProblemIds.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subtle Toast Notification */}
        {notification && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
            <span>{notification}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-400 hover:text-white text-xs ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Section (Presented on primary stream tab) */}
        {activeTab === 'stream' && (
          <section className="mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-10">
              {/* Background Radial Glow */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 mb-3">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  <span>Internet Problem Radar & Online Business Blueprint</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Past 1 Year Archive (Oct 2025 - Oct 2026)</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight text-balance leading-tight mb-3">
                  Discover Everyday & Business Problems. See How Online Businesses Make Money Solving Them.
                </h1>

                <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6 max-w-2xl">
                  We track real complaints shared across Reddit and forums over the past 12 months. Every problem is paired with a live online business making verified monthly revenue (MRR), plus an AI automation blueprint you can clone.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsScanOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-md shadow-emerald-500/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Scan Reddit for Fresh Problems</span>
                  </button>

                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, sortBy: 'revenue' }))}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-lg transition-colors"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Sort by Highest Revenue ($/mo)</span>
                  </button>

                  <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Paste Custom Problem</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('matrix')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    <span>Opportunity Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Global Key Metrics Overview Strip */}
        <MetricsOverview
          stats={stats}
          onFilterDomain={(domain) => {
            setFilters((prev) => ({ ...prev, domain }));
            setActiveTab('stream');
          }}
          activeDomain={filters.domain}
        />

        {/* Primary View Switching */}
        {activeTab === 'stream' && (
          <ProblemStream
            problems={filteredProblems}
            filters={filters}
            setFilters={setFilters}
            onOpenDetail={(problem) => setDetailProblem(problem)}
            onOpenAgentStudio={(problem) => setStudioProblem(problem)}
            onOpenBusiness={(problem) => setBusinessProblem(problem)}
            onToggleSave={handleToggleSave}
            onScanClick={() => setIsScanOpen(true)}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'matrix' && (
          <OpportunityMatrixView
            problems={problems}
            onOpenDetail={(problem) => setDetailProblem(problem)}
            onOpenAgentStudio={(problem) => setStudioProblem(problem)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsROIView
            problems={problems}
            stats={stats}
            onOpenAgentStudio={(problem) => setStudioProblem(problem)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 text-xs text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">ProblemRadar</span>
            <span>·</span>
            <span>Internet Pain Points, Online Businesses & AI Automation Studio</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Past 1-Year Archive</span>
            <span>·</span>
            <span>Online Revenue Tracking</span>
            <span>·</span>
            <span>Server-side Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProblemDetailModal
        problem={detailProblem}
        onClose={() => setDetailProblem(null)}
        onOpenAgentStudio={(p) => {
          setDetailProblem(null);
          setStudioProblem(p);
        }}
        onOpenBusiness={(p) => {
          setDetailProblem(null);
          setBusinessProblem(p);
        }}
      />

      <BusinessSolutionModal
        problem={businessProblem}
        onClose={() => setBusinessProblem(null)}
        onOpenAgentStudio={(p) => {
          setBusinessProblem(null);
          setStudioProblem(p);
        }}
      />

      <AgentStudioModal
        problem={studioProblem}
        onClose={() => setStudioProblem(null)}
        onSaveAgent={handleSaveAgent}
        isSaved={studioProblem ? savedProblemIds.includes(studioProblem.id) : false}
      />

      <ScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onProblemsDiscovered={(count) => {
          setNotification(`Radar scan complete: ${count} fresh internet problems added to your stream.`);
          setTimeout(() => setNotification(null), 4000);
        }}
        refreshProblems={loadProblems}
      />

      <AddProblemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onProblemAdded={async () => {
          await loadProblems();
          setNotification('Custom problem analyzed and ingested into your stream.');
          setTimeout(() => setNotification(null), 4000);
        }}
      />

      <SavedAgentsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProblems={savedProblems}
        onOpenAgentStudio={(p) => setStudioProblem(p)}
        onRemoveSaved={handleRemoveSaved}
      />
    </div>
  );
}
