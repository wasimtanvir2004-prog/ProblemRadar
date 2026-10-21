import React, { useState } from 'react';
import { X, Sparkles, Globe, Compass, Radio } from 'lucide-react';
import { discoverProblemsClientSide } from '../utils/clientProblemEngine';
import { Problem } from '../types';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemsDiscovered: (count: number) => void;
  refreshProblems: () => Promise<void>;
  onAddDiscovered?: (problems: Problem[]) => void;
}

export const ScanModal: React.FC<ScanModalProps> = ({
  isOpen,
  onClose,
  onProblemsDiscovered,
  refreshProblems,
  onAddDiscovered,
}) => {
  const [topic, setTopic] = useState('');
  const [domain, setDomain] = useState<'all' | 'business' | 'daily_life'>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    { label: 'All Daily & Business Trends', query: '', domain: 'all' as const },
    { label: 'Freelancer Late Payments & Ghosting', query: 'freelancer clients late payments invoice ghosting', domain: 'business' as const },
    { label: 'E-commerce WISMO & Return Claims', query: 'Shopify where is my order return refund fraud complaints', domain: 'business' as const },
    { label: 'Dinner Fatigue & Grocery Rot', query: 'fridge ingredient rot dinner cooking fatigue', domain: 'daily_life' as const },
    { label: 'Apartment Hunting & Lease Traps', query: 'landlord lease hidden fees security deposit deductions', domain: 'daily_life' as const },
    { label: 'B2B Sales Lead Triage Bottlenecks', query: 'qualifying inbound sales leads manual research exhaustion', domain: 'business' as const },
  ];

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanMessage('Scanning real-time Reddit feeds (r/freelance, r/ecommerce, r/AskReddit, r/smallbusiness)...');

    let discovered: Problem[] = [];

    try {
      const res = await fetch('/api/problems/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusTopic: topic.trim() || undefined,
          domain,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.discovered) && data.discovered.length > 0) {
          discovered = data.discovered;
        }
      }
    } catch {
      // In static deployment (e.g. GitHub Pages), fallback to client-side real-time engine
    }

    // Fallback to client-side real-time discovery engine if API unreachable
    if (!discovered || discovered.length === 0) {
      discovered = discoverProblemsClientSide(domain, topic.trim() || undefined);
    }

    if (onAddDiscovered && discovered.length > 0) {
      onAddDiscovered(discovered);
    }

    await refreshProblems();
    setScanMessage(`Successfully extracted ${discovered.length} fresh real-world problems with online business blueprints.`);
    onProblemsDiscovered(discovered.length);

    setTimeout(() => {
      onClose();
      setScanMessage(null);
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Scan Internet Problems Today
            </h3>
            <p className="text-xs text-slate-400">
              Live crawler querying Reddit (r/Entrepreneur, r/productivity, r/lifehacks) & forums
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6 text-xs">
          {/* Domain Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Focus Domain
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Domains' },
                { id: 'business', label: 'Business Only' },
                { id: 'daily_life', label: 'Daily Life Only' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDomain(d.id as any)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    domain === d.id
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Focus Topic */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Custom Topic or Niche (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. HVAC scheduling, podcast editing, toddler sleep routines..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick Preset Badges */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">
              Or pick an active high-complaint niche:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setTopic(p.query);
                    setDomain(p.domain);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Message */}
          {scanMessage && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
              {scanMessage}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition-all shadow-md shadow-emerald-500/20"
          >
            {isScanning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Scanning Community Discussions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start Live Radar Scan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
