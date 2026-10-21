import React, { useState, useEffect } from 'react';
import { Problem } from '../types';
import { X, ExternalLink, Bot, CheckCircle, TrendingUp, Sparkles, Rocket, DollarSign } from 'lucide-react';
import { formatTimeAgo, formatMRR } from '../utils/problemRules';

interface ProblemDetailModalProps {
  problem: Problem | null;
  onClose: () => void;
  onOpenAgentStudio: (problem: Problem) => void;
  onOpenBusiness?: (problem: Problem) => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problem,
  onClose,
  onOpenAgentStudio,
  onOpenBusiness,
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!problem) {
      setAnalysis(null);
      return;
    }

    const fetchAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const res = await fetch('/api/problems/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ problemId: problem.id }),
        });
        const data = await res.json();
        if (data.success) {
          setAnalysis(data.analysis);
        }
      } catch (err) {
        console.error('Failed to analyze problem:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    fetchAnalysis();
  }, [problem?.id]);

  if (!problem) return null;

  const biz = problem.onlineBusiness;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Source and Category header */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
          <span className="font-semibold text-emerald-400">{problem.source.subreddit}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{problem.source.author}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{formatTimeAgo(problem.source.postedAt)}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono tabular-nums">{problem.source.upvotes.toLocaleString()} upvotes</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="capitalize">{problem.domain === 'business' ? 'Business Operations' : 'Daily Life Problem'}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-4">
          {problem.title}
        </h2>

        {/* Authentic Community Post Quote */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 italic mb-6">
          <p className="not-italic text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 font-mono">
            Original Community Discussion Excerpt
          </p>
          "{problem.originalQuote}"
        </div>

        {/* Problem Description & Target Audience */}
        <div className="space-y-4 mb-6 text-sm text-slate-300 leading-relaxed">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Core Problem Breakdown
            </h4>
            <p>{problem.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Target Sufferer</span>
              <span className="font-medium text-white">{problem.targetAudience}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Commercial Opportunity</span>
              <span className="font-mono font-bold text-emerald-400">{problem.opportunityScore}/100 Score</span>
            </div>
          </div>
        </div>

        {/* Online Business & Monetization Model Strip */}
        {biz && (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                  <Rocket className="w-4 h-4" />
                  <span>Proven Online Business Solution</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {biz.businessName} <span className="text-xs font-normal text-slate-400 font-mono">({biz.businessModel.replace('_', ' ')})</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {biz.monetizationStrategy}
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0">
                <span className="text-[11px] text-slate-400 block">Monthly Revenue (MRR)</span>
                <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  {formatMRR(biz.monthlyRevenue)}
                </span>
                <div className="mt-2">
                  <button
                    onClick={() => {
                      if (onOpenBusiness) {
                        onClose();
                        onOpenBusiness(problem);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
                  >
                    View Full Business Blueprint →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Root Cause & Market Analysis (Live Gemini Breakdown) */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">
                Deep Root Cause & Friction Diagnosis
              </h3>
            </div>
            {isAnalyzing && (
              <span className="text-xs text-slate-400 animate-pulse font-mono">
                Analyzing with Gemini 3.8 Flash...
              </span>
            )}
          </div>

          {analysis ? (
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="font-semibold text-slate-200">Fundamental Root Cause: </span>
                <span>{analysis.rootCause}</span>
              </div>
              {analysis.brokenWorkarounds && (
                <div>
                  <span className="font-semibold text-slate-200 block mb-1">Why Current Workarounds Fail:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    {analysis.brokenWorkarounds.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.economicCost && (
                <div className="pt-1 text-slate-400">
                  <span className="font-semibold text-slate-200">Annual Economic Cost: </span>
                  <span>{analysis.economicCost}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Performing architectural inspection...
            </p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Recommended Solution: <span className="text-emerald-400 font-medium capitalize">{problem.aiSolvability.bestApproach.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Close
            </button>
            {biz && onOpenBusiness && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBusiness(problem);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-lg transition-colors"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Business Blueprint</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onOpenAgentStudio(problem);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
            >
              <Bot className="w-4 h-4" />
              <span>Solve with AI Agent</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
