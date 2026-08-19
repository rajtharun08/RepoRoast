import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch, Terminal } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 md:px-8 max-w-4xl mx-auto text-center space-y-8">
        
        {/* Main Tagline Header */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Don't just review code.<br />
          <span className="text-zinc-400 font-normal">
            Roast your repository.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Subject your codebase to realistic, escalating technical interviews. Starts with high-level architectural screening and progresses to deep code review while optimizing LLM token context.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/setup"
            className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-sm px-7 py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <span>Start Mock Interview</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-zinc-900" />
          </Link>
          <a
            href="https://github.com/rajtharun08/RepoRoast"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm px-6 py-3.5 rounded-xl border border-zinc-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <GitBranch className="w-4 h-4 text-zinc-400" />
            <span>GitHub Repository</span>
          </a>
        </div>

        {/* Code Preview Terminal Card */}
        <div className="pt-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl text-left max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="text-xs font-mono text-zinc-400 ml-2">fastapi/fastapi • Level 5 (System Design)</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2.5 py-0.5 rounded-md border border-zinc-700">
                FAANG Gatekeeper
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs leading-relaxed text-zinc-300">
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80">
                <div className="text-zinc-400 font-bold mb-1 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Interviewer (Question 3):</span>
                </div>
                "Looking at your route handlers in <code>routes/auth.py</code>, how do you prevent event loop blocking when CPU-bound password hashing handles concurrent traffic?"
              </div>

              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80 text-zinc-300">
                <div className="text-blue-400 font-bold mb-1">Candidate Response:</div>
                "We offload CPU-bound hashing execution to a thread pool executor using FastAPI's <code>run_in_threadpool</code> to ensure event loop non-blocking behavior."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-16 px-4 md:px-8 max-w-3xl mx-auto border-t border-zinc-800/60 text-center space-y-10">
        <h2 className="text-2xl font-bold text-white">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 space-y-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-200 font-bold text-xs flex items-center justify-center font-mono">
              01
            </div>
            <h4 className="font-bold text-sm text-white pt-1">Select Repository</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Fetch public GitHub user repos or enter a direct URL.</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 space-y-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-200 font-bold text-xs flex items-center justify-center font-mono">
              02
            </div>
            <h4 className="font-bold text-sm text-white pt-1">Choose Level</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Select difficulty (Level 1–10) and set interviewer persona.</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 space-y-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-200 font-bold text-xs flex items-center justify-center font-mono">
              03
            </div>
            <h4 className="font-bold text-sm text-white pt-1">Face the Roast</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Answer 5 questions and receive your evaluation report.</p>
          </div>
        </div>

        <Link
          to="/setup"
          className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-sm px-8 py-3.5 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <span>Start Technical Interview</span>
          <ArrowRight className="w-4 h-4 text-zinc-900" />
        </Link>
      </section>

    </div>
  );
}
