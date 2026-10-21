import React from 'react';
import { Problem } from '../types';
import { X, DollarSign, Users, Rocket, Target, CheckCircle2, Bot, ArrowRight, TrendingUp } from 'lucide-react';
import { formatMRR } from '../utils/problemRules';

interface BusinessSolutionModalProps {
  problem: Problem | null;
  onClose: () => void;
  onOpenAgentStudio: (problem: Problem) => void;
}

export const BusinessSolutionModal: React.FC<BusinessSolutionModalProps> = ({
  problem,
  onClose,
  onOpenAgentStudio,
}) => {
  if (!problem || !problem.onlineBusiness) return null;
  const biz = problem.onlineBusiness;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tagline */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
          <span className="font-semibold text-emerald-400 uppercase tracking-wider font-mono">
            Online Business & Monetization Blueprint
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="capitalize">{biz.businessModel.replace('_', ' ')}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Launch in {biz.launchTimeframe}</span>
        </div>

        {/* Business Name */}
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
          {biz.businessName}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Solving: <span className="text-slate-300 font-medium">"{problem.title}"</span>
        </p>

        {/* Financial KPI Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-emerald-500/30 mb-6">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">Monthly Revenue (MRR)</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {formatMRR(biz.monthlyRevenue)}
            </div>
            <span className="text-[10px] text-slate-500">Verified / Estimated online income</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">Active Paying Customers</span>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {biz.activeCustomers.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Subscription & repeat buyers</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">Pricing Model</span>
            <div className="text-sm font-semibold font-mono text-blue-300 pt-1">
              {biz.pricingModel}
            </div>
            <span className="text-[10px] text-slate-500">Tiered software & service tiers</span>
          </div>
        </div>

        {/* How They Make Money Online */}
        <div className="space-y-4 mb-6 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>How They Monetize & Collect Revenue</span>
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {biz.monetizationStrategy}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Founder Story & Traction */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="font-semibold text-white mb-1.5 flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Founder Traction Proof</span>
              </h5>
              <p className="text-slate-400 leading-relaxed">
                {biz.founderStoryOrTraction}
              </p>
            </div>

            {/* Acquisition Channel */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="font-semibold text-white mb-1.5 flex items-center gap-1.5 font-mono">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Customer Acquisition Channel</span>
              </h5>
              <p className="text-slate-400 leading-relaxed">
                {biz.acquisitionChannel}
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Blueprint to Clone & Launch */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2 mb-3">
            <Rocket className="w-4 h-4" />
            <span>How to Launch Your Own Version Online</span>
          </h4>

          <div className="space-y-2.5">
            {biz.cloneBlueprint.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Estimated Monthly Market Potential: <span className="font-mono text-emerald-400 font-semibold">{formatMRR(biz.monthlyRevenue)}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAgentStudio(problem);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
            >
              <Bot className="w-4 h-4" />
              <span>Build AI Automation for this Business</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
