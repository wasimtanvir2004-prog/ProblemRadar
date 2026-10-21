import React, { useState, useEffect } from 'react';
import { Problem, AgentSolution, AgentExecutionResult } from '../types';
import { 
  X, 
  Bot, 
  Play, 
  CheckCircle2, 
  Code2, 
  Copy, 
  Check, 
  ArrowRight, 
  Zap, 
  Clock, 
  Sparkles,
  Layers,
  Terminal,
  Bookmark
} from 'lucide-react';
import { validateAgentInputs } from '../utils/problemRules';

interface AgentStudioModalProps {
  problem: Problem | null;
  onClose: () => void;
  onSaveAgent: (problemId: string, solution: AgentSolution) => void;
  isSaved: boolean;
}

export const AgentStudioModal: React.FC<AgentStudioModalProps> = ({
  problem,
  onClose,
  onSaveAgent,
  isSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'playground' | 'code'>('playground');
  const [agentSolution, setAgentSolution] = useState<AgentSolution | null>(null);
  const [isGeneratingAgent, setIsGeneratingAgent] = useState(false);
  const [inputData, setInputData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<AgentExecutionResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load existing agent or generate a new one
  useEffect(() => {
    if (!problem) return;

    if (problem.agentSolution) {
      setAgentSolution(problem.agentSolution);
      setInputData(problem.agentSolution.samplePayload || {});
      if (problem.agentSolution.lastRunResult) {
        setExecutionResult(problem.agentSolution.lastRunResult);
      }
    } else {
      generateAgent();
    }
  }, [problem?.id]);

  const generateAgent = async () => {
    if (!problem) return;
    setIsGeneratingAgent(true);
    try {
      const res = await fetch('/api/agents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: problem.id }),
      });
      const data = await res.json();
      if (data.success && data.agentSolution) {
        setAgentSolution(data.agentSolution);
        setInputData(data.agentSolution.samplePayload || {});
      }
    } catch (err) {
      console.error('Failed to generate agent:', err);
    } finally {
      setIsGeneratingAgent(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setInputData((prev) => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleRunAgent = async () => {
    if (!problem || !agentSolution) return;

    // Validate inputs
    const validation = validateAgentInputs(agentSolution.inputSchema, inputData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const res = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          inputData,
          systemPromptOverride: agentSolution.systemPrompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setExecutionResult(data.result);
      }
    } catch (err) {
      console.error('Agent execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {agentSolution ? agentSolution.agentName : 'Architecting AI Agent...'}
                </h2>
                {agentSolution && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
                    Gemini 3.8 Flash
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {agentSolution?.tagline || `Solving: ${problem.title}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {agentSolution && (
              <button
                onClick={() => onSaveAgent(problem.id, agentSolution)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                  isSaved
                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                aria-label="Save agent to portfolio"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Saved' : 'Save Agent'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 flex items-center gap-6 text-xs font-medium bg-slate-950/30">
          <button
            onClick={() => setActiveTab('playground')}
            className={`py-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Test Console</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Agent Architecture & Logic</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Export Automation (Python / n8n)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isGeneratingAgent && (
            <div className="py-16 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-white">
                Designing Autonomous Agent Architecture...
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Analyzing Reddit pain points, structuring input schema, and crafting high-precision system prompts.
              </p>
            </div>
          )}

          {!isGeneratingAgent && agentSolution && (
            <>
              {/* TAB 1: INTERACTIVE TEST PLAYGROUND */}
              {activeTab === 'playground' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Input Form Parameters (5 cols) */}
                  <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Agent Inputs & Test Data
                      </h4>
                      <button
                        onClick={() => setInputData(agentSolution.samplePayload || {})}
                        className="text-[11px] text-emerald-400 hover:underline font-mono"
                      >
                        Reset to Sample Data
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">
                      Configure or test run the agent with live values to inspect real outputs:
                    </p>

                    <div className="space-y-3">
                      {agentSolution.inputSchema.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="block text-xs font-medium text-slate-300">
                            {field.label}
                          </label>

                          {field.type === 'textarea' ? (
                            <textarea
                              rows={3}
                              placeholder={field.placeholder}
                              value={inputData[field.key] ?? ''}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              className={`w-full p-2.5 text-xs bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none ${
                                formErrors[field.key]
                                  ? 'border-red-500 focus:border-red-500'
                                  : 'border-slate-700 focus:border-emerald-500'
                              }`}
                            />
                          ) : field.type === 'select' && field.options ? (
                            <select
                              value={inputData[field.key] ?? field.defaultValue ?? field.options[0]}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              className="w-full p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                            >
                              {field.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type === 'number' ? 'number' : 'text'}
                              placeholder={field.placeholder}
                              value={inputData[field.key] ?? ''}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              className={`w-full p-2.5 text-xs bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none ${
                                formErrors[field.key]
                                  ? 'border-red-500 focus:border-red-500'
                                  : 'border-slate-700 focus:border-emerald-500'
                              }`}
                            />
                          )}

                          {formErrors[field.key] && (
                            <span className="text-[11px] text-red-400 block">
                              {formErrors[field.key]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleRunAgent}
                        disabled={isExecuting}
                        className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                      >
                        {isExecuting ? (
                          <>
                            <Sparkles className="w-4 h-4 animate-spin" />
                            <span>Agent Executing Solution...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Run Live Agent Simulation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right: Real Execution Output (7 cols) */}
                  <div className="lg:col-span-7 bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                          Agent Execution Output
                        </h4>
                      </div>

                      {executionResult && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Reclaims {executionResult.timeSavedEstimate}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress indicator during execution */}
                    {isExecuting && (
                      <div className="py-12 text-center space-y-3">
                        <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                          <Bot className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-semibold text-white">
                          Gemini 3.8 Flash Agent Processing Workflow...
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Executing system prompt & calculating optimal resolution
                        </p>
                      </div>
                    )}

                    {/* Completed output */}
                    {!isExecuting && executionResult && (
                      <div className="space-y-4">
                        {/* Step Breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {executionResult.executionSteps.map((step) => (
                            <div
                              key={step.stepNumber}
                              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                            >
                              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Step {step.stepNumber}</span>
                              </div>
                              <p className="text-slate-300 font-medium line-clamp-1">
                                {step.title}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {step.durationMs}ms
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Generated Solution Deliverable */}
                        <div className="relative p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-[380px] overflow-y-auto">
                          <button
                            onClick={() => handleCopy(executionResult.output, 'exec-output')}
                            className="absolute top-3 right-3 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Copy output"
                          >
                            {copiedKey === 'exec-output' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {executionResult.output}
                        </div>
                      </div>
                    )}

                    {/* Pre-run placeholder */}
                    {!isExecuting && !executionResult && (
                      <div className="py-14 text-center space-y-2">
                        <Bot className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-xs font-medium text-slate-400">
                          Ready to execute. Click "Run Live Agent Simulation" to test this solution.
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Runs server-side using modern Gemini 3.8 Flash SDK.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ARCHITECTURE & SYSTEM PROMPT */}
              {activeTab === 'architecture' && (
                <div className="space-y-6">
                  {/* Pipeline Step Flowchart */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
                      End-to-End Automation Pipeline
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {agentSolution.architecture.steps.map((step, idx) => (
                        <div
                          key={step.stepNumber}
                          className="relative p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <div className="text-[11px] font-mono text-emerald-400 font-semibold mb-1">
                              0{step.stepNumber}. {step.toolOrAction}
                            </div>
                            <h5 className="text-xs font-bold text-white mb-1.5">
                              {step.title}
                            </h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Triggers and Deliverables */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                      <span className="font-semibold text-slate-300 block mb-2">Automated Triggers:</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400">
                        {agentSolution.architecture.triggers.map((trig, i) => (
                          <li key={i}>{trig}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                      <span className="font-semibold text-slate-300 block mb-2">Agent Deliverables:</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400">
                        {agentSolution.architecture.outputs.map((out, i) => (
                          <li key={i}>{out}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* System Prompt Codeblock */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Autonomous Agent System Prompt
                      </h4>
                      <button
                        onClick={() => handleCopy(agentSolution.systemPrompt, 'prompt')}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Prompt</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-60 leading-relaxed">
                      {agentSolution.systemPrompt}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: EXPORT AUTOMATION CODE */}
              {activeTab === 'code' && (
                <div className="space-y-6">
                  {/* Python script export */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                          Python Automation Script (@google/genai SDK)
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCopy(agentSolution.automationCode.pythonScript, 'python')}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
                      >
                        {copiedKey === 'python' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Python Script</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-64 leading-relaxed">
                      {agentSolution.automationCode.pythonScript}
                    </pre>
                  </div>

                  {/* n8n Workflow JSON */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                          n8n Low-Code Workflow Blueprint (Import JSON)
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCopy(agentSolution.automationCode.n8nWorkflowJson, 'n8n')}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
                      >
                        {copiedKey === 'n8n' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy n8n JSON</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-300 overflow-x-auto max-h-48 leading-relaxed">
                      {agentSolution.automationCode.n8nWorkflowJson}
                    </pre>
                  </div>

                  {/* Webhook cURL invocation */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Webhook cURL Trigger
                      </span>
                      <button
                        onClick={() => handleCopy(agentSolution.automationCode.webhookCurl, 'curl')}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy cURL</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
                      {agentSolution.automationCode.webhookCurl}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
