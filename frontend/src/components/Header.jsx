import React from 'react';
import { Flame, HelpCircle, AlertOctagon, FileCode, CheckCircle2, RotateCcw } from 'lucide-react';

export default function Header({ 
  questionCount, 
  level, 
  persona, 
  repoName, 
  onInspectContext, 
  onTriggerHint, 
  onTriggerPanic,
  onRestart,
  isStreaming 
}) {
  return (
    <header className="bg-[#111726]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-20 shadow-xl">
      {/* Brand & Persona Info */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-orange-600 via-amber-500 to-red-500 p-2.5 rounded-2xl text-white shadow-md">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base text-white tracking-wide">RepoRoast</h1>
              <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold">
                Level {level}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-[200px] sm:max-w-xs mt-0.5">
              {repoName || 'repository'} • <span className="text-slate-200 font-medium">{persona}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onRestart}
          title="Restart Session"
          className="md:hidden text-slate-400 hover:text-slate-200 p-2 rounded-xl bg-slate-900 border border-slate-800"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Question 1-5 Stepper */}
      <div className="flex items-center gap-1.5 bg-[#080c14] px-4 py-2 rounded-2xl border border-slate-800/80">
        <span className="text-[11px] text-slate-400 font-medium mr-1.5 hidden sm:inline">Progress:</span>
        {[1, 2, 3, 4, 5].map((q) => (
          <div key={q} className="flex items-center">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all ${
              q < questionCount 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : q === questionCount
                ? 'bg-orange-500 text-white font-black shadow-md ring-2 ring-orange-500/40'
                : 'bg-slate-900 text-slate-600 border border-slate-800'
            }`}>
              {q < questionCount ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : q}
            </div>
            {q < 5 && <div className={`w-2.5 h-0.5 ${q < questionCount ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <button
          onClick={onInspectContext}
          title="Inspect code context Gemini sees at this level"
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-800 transition-all cursor-pointer"
        >
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Context</span>
        </button>

        <button
          onClick={onTriggerHint}
          disabled={isStreaming}
          title="Request a constructive hint & pivot"
          className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-2 rounded-xl border border-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Hint</span>
        </button>

        <button
          onClick={onTriggerPanic}
          disabled={isStreaming}
          title="Panic Button: Force AI to reveal solution"
          className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold px-3 py-2 rounded-xl border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>Reveal Answer</span>
        </button>

        <button
          onClick={onRestart}
          title="Start New Interview"
          className="hidden md:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold p-2 rounded-xl border border-slate-800 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
