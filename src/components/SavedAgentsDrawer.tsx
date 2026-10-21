import React from 'react';
import { Problem, AgentSolution } from '../types';
import { X, Bot, Play, Trash2, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';

interface SavedAgentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProblems: Problem[];
  onOpenAgentStudio: (problem: Problem) => void;
  onRemoveSaved: (problemId: string) => void;
}

export const SavedAgentsDrawer: React.FC<SavedAgentsDrawerProps> = ({
  isOpen,
  onClose,
  savedProblems,
  onOpenAgentStudio,
  onRemoveSaved,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between text-slate-100 shadow-2xl">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Saved Automation Agents
                  </h3>
                  <span className="text-xs text-slate-400">
                    {savedProblems.length} active solution{savedProblems.length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            {savedProblems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Bot className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">No saved agents in your portfolio yet.</p>
                <p className="text-[11px] text-slate-500">
                  Click "Solve with AI Agent" on any problem card to architect and save a custom agent.
                </p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
                {savedProblems.map((problem) => {
                  const agent = problem.agentSolution;
                  return (
                    <div
                      key={problem.id}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="text-emerald-400 font-mono font-medium">
                            {problem.source.subreddit}
                          </span>
                          <span className="capitalize">{problem.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mb-1">
                          {agent ? agent.agentName : problem.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {agent?.tagline || problem.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenAgentStudio(problem);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Run Agent Console</span>
                        </button>

                        <button
                          onClick={() => onRemoveSaved(problem.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Remove from saved"
                          aria-label={`Remove ${problem.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center font-mono">
            All agents execute server-side via Gemini 3.8 Flash
          </div>
        </div>
      </div>
    </div>
  );
};
