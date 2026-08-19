import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, HelpCircle, AlertOctagon, FileCode, CheckCircle2, Home } from 'lucide-react';

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
  const repoSlug = (repoName || 'fastapi/fastapi').replace('https://github.com/', '');

  return (
    <header className="bg-[#161b22] border-b border-[#30363d] px-4 md:px-8 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
      {/* Brand & Repository Info */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-wide group-hover:text-blue-400 transition-colors">
                RepoRoast Arena
              </span>
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                L{level}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-[160px] sm:max-w-xs mt-0.5">
              {repoSlug} • <span className="text-slate-200 font-medium">{persona}</span>
            </p>
          </div>
        </Link>
      </div>

      {/* Question 1-5 Stepper */}
      <div className="flex items-center gap-1.5 bg-[#0d1117] px-3.5 py-1.5 rounded-xl border border-[#30363d]">
        <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline font-mono">Progress:</span>
        {[1, 2, 3, 4, 5].map((q) => (
          <div key={q} className="flex items-center">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
              q < questionCount 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : q === questionCount
                ? 'bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-500/40'
                : 'bg-[#161b22] text-slate-600 border border-[#30363d]'
            }`}>
              {q < questionCount ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : q}
            </div>
            {q < 5 && <div className={`w-2 h-0.5 ${q < questionCount ? 'bg-emerald-500/40' : 'bg-[#30363d]'}`} />}
          </div>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onInspectContext}
          title="Inspect code context Gemini sees at this level"
          className="flex items-center gap-1.5 bg-[#0d1117] hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#30363d] transition-all cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Context</span>
        </button>

        <button
          onClick={onTriggerHint}
          disabled={isStreaming}
          title="Request a constructive hint & pivot"
          className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Hint</span>
        </button>

        <button
          onClick={onTriggerPanic}
          disabled={isStreaming}
          title="Force AI to reveal solution"
          className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>Reveal Answer</span>
        </button>

        <button
          onClick={onRestart}
          title="Exit Session"
          className="flex items-center gap-1.5 bg-[#0d1117] hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold p-1.5 rounded-lg border border-[#30363d] transition-all cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
