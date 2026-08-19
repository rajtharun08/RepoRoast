import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, HelpCircle, AlertOctagon, FileCode, Check, Home } from 'lucide-react';

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
    <header className="bg-[#09090b] border-b border-zinc-800/80 px-4 md:px-8 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Brand & Repository Info */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="bg-zinc-800 text-zinc-100 p-1.5 rounded-lg border border-zinc-700">
            <Terminal className="w-4 h-4 text-zinc-200" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-100 tracking-tight">
                RepoRoast Arena
              </span>
              <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] px-2 py-0.5 rounded-md font-mono font-bold">
                L{level}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono truncate max-w-[160px] sm:max-w-xs mt-0.5">
              {repoSlug} • <span className="text-zinc-300 font-medium">{persona}</span>
            </p>
          </div>
        </Link>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center gap-1.5 bg-zinc-900/90 px-3.5 py-1.5 rounded-xl border border-zinc-800">
        <span className="text-[11px] text-zinc-400 font-medium mr-1 hidden sm:inline font-mono">Progress:</span>
        {[1, 2, 3, 4, 5].map((q) => (
          <div key={q} className="flex items-center">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
              q < questionCount 
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                : q === questionCount
                ? 'bg-zinc-100 text-zinc-900 font-bold shadow-sm'
                : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
            }`}>
              {q < questionCount ? <Check className="w-3 h-3 text-emerald-400" /> : q}
            </div>
            {q < 5 && <div className={`w-2 h-0.5 ${q < questionCount ? 'bg-zinc-700' : 'bg-zinc-800'}`} />}
          </div>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onInspectContext}
          title="Inspect code context Gemini sees at this level"
          className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-800 transition-all cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Context</span>
        </button>

        <button
          onClick={onTriggerHint}
          disabled={isStreaming}
          title="Request a constructive hint & pivot"
          className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Hint</span>
        </button>

        <button
          onClick={onTriggerPanic}
          disabled={isStreaming}
          title="Force AI to reveal solution"
          className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>Reveal Answer</span>
        </button>

        <button
          onClick={onRestart}
          title="Exit Session"
          className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium p-1.5 rounded-lg border border-zinc-800 transition-all cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
