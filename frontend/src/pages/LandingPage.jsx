import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Mic, 
  ShieldCheck, 
  GitBranch, 
  Terminal, 
  Code2, 
  Flame,
  Zap,
  Sliders
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 md:px-8 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-red-500/15 border border-orange-500/40 text-orange-400 px-4 py-2 rounded-full text-xs font-extrabold tracking-wide shadow-lg shadow-orange-500/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
          <span>Repository-Based Technical Interview Simulator</span>
        </div>

        {/* Tagline Header */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none">
          Don't just review code.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-red-500">
            Roast your repository.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
          Subject your codebase to realistic, escalating technical interviews. Starts with high-level architectural screening and progresses to deep line-by-line code review while optimizing LLM token context.
        </p>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/setup"
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:via-amber-600 hover:to-red-600 text-white font-black text-base px-9 py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center justify-center gap-3 transition-all cursor-pointer group hover:-translate-y-0.5"
          >
            <span>Start Mock Interview</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com/rajtharun08/RepoRoast"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#0d1424] hover:bg-slate-800 text-slate-300 font-bold text-base px-7 py-4 rounded-2xl border border-slate-800 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:border-slate-700"
          >
            <GitBranch className="w-5 h-5 text-orange-400" />
            <span>GitHub Repository</span>
          </a>
        </div>

        {/* Code Preview Terminal Card */}
        <div className="pt-6">
          <div className="bg-[#0e1424]/90 border border-slate-800/90 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/60 text-left max-w-3xl mx-auto relative overflow-hidden backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">RepoRoast Escalation • Level 5 (System Design)</span>
              </div>
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
                FAANG Gatekeeper
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs leading-relaxed">
              <div className="bg-[#060913] p-4 rounded-2xl border border-slate-800/80 text-slate-200">
                <div className="text-orange-400 font-bold mb-1.5 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-orange-400" />
                  <span>Interviewer (Question #3):</span>
                </div>
                "Looking at your route handlers in <code>routes/auth.py</code>, how do you prevent event loop blocking when CPU-bound password hashing handles high concurrent traffic?"
              </div>

              <div className="bg-blue-950/20 p-4 rounded-2xl border border-blue-500/30 text-blue-100">
                <div className="text-cyan-400 font-bold mb-1.5 flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Candidate Response:</span>
                </div>
                "We offload CPU-bound hashing execution to a thread pool executor using FastAPI's <code>run_in_threadpool</code> to ensure event loop non-blocking behavior."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-white">Engineered for Technical Depth</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Combines realistic escalation pipelines with token-efficient prompt scoping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg">
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">Context Window Scoping</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trims repo context based on level: README & manifests for Screening; routing entrypoints for System Design; complete filtered code for Deep Review.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">Native Voice Recognition</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Speak your technical answers naturally using native Web Speech API audio recording with real-time text transcription directly inside the answer box.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">Custom Interviewer Personas</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose preset personas (FAANG Gatekeeper, Startup CTO, Security Auditor, Empathetic Mentor) or define your custom persona system instructions.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto text-center space-y-12 border-t border-slate-800/60">
        <h2 className="text-3xl font-black text-white">How It Works in 3 Simple Steps</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
              1
            </div>
            <h4 className="font-bold text-base text-white">Select Repository</h4>
            <p className="text-xs text-slate-400">Search any GitHub user/org or paste a direct repository link.</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              2
            </div>
            <h4 className="font-bold text-base text-white">Choose Level & Persona</h4>
            <p className="text-xs text-slate-400">Select difficulty (Level 1–10) and set your interviewer persona.</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
              3
            </div>
            <h4 className="font-bold text-base text-white">Face the Roast</h4>
            <p className="text-xs text-slate-400">Answer 5 technical questions and receive your evaluation report.</p>
          </div>
        </div>

        <Link
          to="/setup"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 text-white font-black text-base px-10 py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all cursor-pointer hover:-translate-y-0.5"
        >
          <span>Start Your Interview Now</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

    </div>
  );
}
