import React from 'react';
import { Flame, HelpCircle, AlertOctagon, FileCode, CheckCircle2 } from 'lucide-react';

export default function Header({ 
  questionCount, 
  level, 
  persona, 
  repoName, 
  onInspectContext, 
  onTriggerHint, 
  onTriggerPanic,
  isStreaming 
}) {
  return (
    <header className="bg-roast-card border-b border-roast-border px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-20 shadow-lg">
      {/* Brand & Persona Info */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-orange-600 to-red-500 p-2 rounded-xl text-white shadow-md">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-white tracking-wide">RepoRoast</h1>
            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Level {level}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {repoName || 'repository'} • <span className="text-slate-300 font-semibold">{persona}</span>
          </p>
        </div>
      </div>

      {/* Question 1-5 Stepper */}
      <div className="flex items-center gap-2 bg-roast-dark px-4 py-2 rounded-xl border border-roast-border">
        <span className="text-xs text-slate-400 font-medium mr-1">Progress:</span>
        {[1, 2, 3, 4, 5].map((q) => (
          <div key={q} className="flex items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              q < questionCount 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : q === questionCount
                ? 'bg-orange-500 text-white font-extrabold ring-2 ring-orange-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              {q < questionCount ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : q}
            </div>
            {q < 5 && <div className={`w-3 h-0.5 ${q < questionCount ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onInspectContext}
          title="See what source code Gemini is allowed to inspect at this level"
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 transition-colors"
        >
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Context</span>
        </button>

        <button
          onClick={onTriggerHint}
          disabled={isStreaming}
          title="Get a constructive hint and pivot"
          className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium px-3 py-2 rounded-lg border border-amber-500/30 transition-colors disabled:opacity-50"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Hint</span>
        </button>

        <button
          onClick={onTriggerPanic}
          disabled={isStreaming}
          title="Panic Button: Force AI to reveal solution & move on"
          className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium px-3 py-2 rounded-lg border border-red-500/30 transition-colors disabled:opacity-50"
        >
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <span>Reveal Answer</span>
        </button>
      </div>
    </header>
  );
}
