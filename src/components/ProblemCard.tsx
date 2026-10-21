import React from 'react';
import { Problem } from '../types';
import { Bot, ArrowUpRight, TrendingUp, CheckCircle2, DollarSign, Rocket } from 'lucide-react';
import { formatTimeAgo, formatMRR } from '../utils/problemRules';

interface ProblemCardProps {
  problem: Problem;
  onOpenDetail: (problem: Problem) => void;
  onOpenAgentStudio: (problem: Problem) => void;
  onOpenBusiness?: (problem: Problem) => void;
  onToggleSave: (problemId: string) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onOpenDetail,
  onOpenAgentStudio,
  onOpenBusiness,
  onToggleSave,
}) => {
  const hasReadyAgent = problem.status === 'agent_ready' || !!problem.agentSolution;
  const biz = problem.onlineBusiness;

  return (
    <article className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 md:p-6 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Unboxed Metadata Line (NO PILLS) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2.5">
          <span className="font-medium text-slate-300">
            {problem.source.subreddit || 'r/all'}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono tabular-nums">
            {problem.source.upvotes.toLocaleString()} upvotes
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{formatTimeAgo(problem.source.postedAt)}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="capitalize">{problem.category}</span>
        </div>

        {/* Primary Title */}
        <h3 className="text-base md:text-lg font-semibold text-white tracking-tight group-hover:text-emerald-300 transition-colors mb-2">
          {problem.title}
        </h3>

        {/* Problem Description */}
        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {problem.description}
        </p>

        {/* Authentic Reddit Quote Excerpt */}
        <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800/80 mb-3 text-xs text-slate-400 italic">
          <span className="text-slate-500 not-italic font-mono mr-1.5 font-bold">"</span>
          {problem.originalQuote}
          <span className="text-slate-500 not-italic font-mono ml-1 font-bold">"</span>
        </div>

        {/* Online Business Solution & Monthly Revenue Strip */}
        {biz && (
          <div 
            onClick={() => onOpenBusiness && onOpenBusiness(problem)}
            className="p-3 rounded-lg bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/30 hover:border-emerald-500/50 transition-all cursor-pointer mb-4 flex items-center justify-between gap-3 group/biz"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-medium">
                <Rocket className="w-3.5 h-3.5" />
                <span>Online Business Solution:</span>
              </div>
              <div className="text-xs font-bold text-white truncate">
                {biz.businessName}
              </div>
              <span className="text-[10px] text-slate-400 capitalize">
                {biz.businessModel.replace('_', ' ')} · {biz.activeCustomers} paying users
              </span>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                {formatMRR(biz.monthlyRevenue)}
              </div>
              <span className="text-[10px] text-emerald-300/80 group-hover/biz:underline font-mono">
                View Blueprint →
              </span>
            </div>
          </div>
        )}

        {/* Opportunity & AI Feasibility Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-slate-800/80 text-xs mb-3">
          <div>
            <div className="text-slate-500 text-[11px]">Opportunity</div>
            <div className="font-mono font-bold tabular-nums text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{problem.opportunityScore}/100</span>
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">AI Solvability</div>
            <div className="font-mono font-semibold tabular-nums text-blue-400">
              {problem.aiSolvability.score}%
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Severity</div>
            <div className="font-medium text-slate-300 capitalize">
              {problem.severity}
            </div>
          </div>
        </div>

        {/* Frustration Keywords as quiet inline text */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-4">
          <span className="text-[11px] text-slate-400">Pains:</span>
          {problem.frustrationKeywords.map((kw, i) => (
            <span key={i} className="text-slate-400">
              #{kw}{i < problem.frustrationKeywords.length - 1 ? ' ·' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3">
        <button
          onClick={() => onOpenDetail(problem)}
          className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 py-1.5"
          aria-label={`Inspect ${problem.title}`}
        >
          <span>Deep Dive</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {biz && onOpenBusiness && (
            <button
              onClick={() => onOpenBusiness(problem)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
              aria-label={`View business blueprint for ${problem.title}`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Business Case</span>
            </button>
          )}

          {hasReadyAgent ? (
            <button
              onClick={() => onOpenAgentStudio(problem)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
              aria-label={`Launch AI Agent for ${problem.title}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Run AI Agent</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAgentStudio(problem)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
              aria-label={`Build AI Agent for ${problem.title}`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solve with AI Agent</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
