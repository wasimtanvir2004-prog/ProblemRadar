import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import { analyzeRawProblemClientSide } from '../utils/clientProblemEngine';
import { Problem } from '../types';

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemAdded: () => Promise<void>;
  onAddProblemDirectly?: (problem: Problem) => void;
}

export const AddProblemModal: React.FC<AddProblemModalProps> = ({
  isOpen,
  onClose,
  onProblemAdded,
  onAddProblemDirectly,
}) => {
  const [rawText, setRawText] = useState('');
  const [optionalUrl, setOptionalUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    let added = false;

    try {
      const res = await fetch('/api/problems/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: rawText.trim(),
          optionalUrl: optionalUrl.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.problem) {
          if (onAddProblemDirectly) onAddProblemDirectly(data.problem);
          added = true;
        }
      }
    } catch {
      // In static GitHub Pages deployment, fallback to client-side analyzer
    }

    if (!added) {
      // Fallback: analyze client-side
      const newProblem = analyzeRawProblemClientSide(rawText.trim(), optionalUrl.trim() || undefined);
      if (onAddProblemDirectly) onAddProblemDirectly(newProblem);
    }

    await onProblemAdded();
    onClose();
    setRawText('');
    setOptionalUrl('');
    setIsSubmitting(false);
  };

  const handlePasteExample = () => {
    setRawText(`Reddit post from r/smallbusiness:
"I run a commercial window cleaning company with 8 employees. Every week I spend 6 hours matching our paper technician log sheets to our customer QuickBooks invoices. If a technician forgets to write down the extra ladder fee, we undercharge by $75. It drives me crazy and our cash flow is always 2 weeks behind."`);
    setOptionalUrl('https://reddit.com/r/smallbusiness/comments/paper_log_invoicing');
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
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Ingest Custom Internet Problem
            </h3>
            <p className="text-xs text-slate-400">
              Paste any Reddit post, forum rant, or tweet. AI will extract problem intelligence & build agent solutions.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-300 font-medium">
                Problem Text / Reddit Post Content
              </label>
              <button
                type="button"
                onClick={handlePasteExample}
                className="text-[11px] text-emerald-400 hover:underline font-mono"
              >
                Insert Sample Reddit Post
              </button>
            </div>
            <textarea
              rows={5}
              required
              placeholder="Paste the user complaint, forum thread text, or frustration excerpt here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Source URL / Subreddit Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://reddit.com/r/..."
              value={optionalUrl}
              onChange={(e) => setOptionalUrl(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded bg-red-950/50 border border-red-500/40 text-red-300 text-[11px]">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !rawText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition-all shadow-md shadow-emerald-500/20"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Extracting Problem Intelligence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze & Add to Stream</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
