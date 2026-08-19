import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Mic, 
  Award, 
  ShieldCheck, 
  Rocket, 
  Lock, 
  Code2, 
  CheckCircle2, 
  TrendingUp,
  Cpu,
  GitBranch
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 md:px-8 max-w-6xl mx-auto text-center space-y-8">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-red-500/10 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-md">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Realistic Technical Interview Escalation Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
          Don't just review code.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-red-500">
            Roast your repository.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
          Subject your codebase to realistic, escalating technical interviews. Starts with high-level architectural screening and progresses to deep line-by-line code review while optimizing LLM token context.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/setup"
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:via-amber-600 hover:to-red-600 text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer group"
          >
            <span>Start Mock Interview</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com/rajtharun08/RepoRoast"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#111726] hover:bg-slate-800 text-slate-300 font-bold text-base px-6 py-4 rounded-2xl border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <GitBranch className="w-5 h-5 text-orange-400" />
            <span>View GitHub Source</span>
          </a>
        </div>

        {/* Visual Preview Card */}
        <div className="pt-8">
          <div className="bg-[#111726]/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-left max-w-4xl mx-auto backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">RepoRoast Interactive Session • Level 5 (System Design)</span>
              </div>
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
                FAANG Gatekeeper
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs leading-relaxed text-slate-300">
              <div className="bg-[#080c14] p-4 rounded-2xl border border-slate-800 text-orange-300">
                <strong className="text-orange-400 font-bold block mb-1">Interviewer (Q3):</strong>
                "Looking at your route handlers in <code>routes/auth.py</code>, how do you prevent event loop blocking when password hashing receives high concurrent traffic?"
              </div>

              <div className="bg-blue-950/30 p-4 rounded-2xl border border-blue-500/30 text-blue-200">
                <strong className="text-blue-400 font-bold block mb-1">Candidate Answer:</strong>
                "We offload CPU-bound Argon2 hashing to a thread pool executor using FastAPI's <code>run_in_threadpool</code> to keep the async loop non-blocking."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-white">Engineered for Technical Depth</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Combines realistic escalation pipelines with token-efficient prompt scoping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#111726] border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Context Window Scoping</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trims repository context based on level. Screening uses README & manifests; System Design uses route structures; Deep Code Review ingests complete filtered source files.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111726] border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Native Speech Recognition</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Speak your answers naturally using native Web Speech API audio recording with real-time text transcription directly inside the answer box.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111726] border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Sharable Scorecards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every completed interview produces a unique, standalone sharable URL with grade badges, quantitative skill breakdown matrices, and full transcript logs.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Timeline Section */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto text-center space-y-12">
        <h2 className="text-3xl font-black text-white">How It Works in 3 Simple Steps</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg">
              1
            </div>
            <h4 className="font-bold text-base text-white">Select Repository</h4>
            <p className="text-xs text-slate-400">Search any GitHub user/org or paste a direct repository URL.</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg">
              2
            </div>
            <h4 className="font-bold text-base text-white">Choose Level & Persona</h4>
            <p className="text-xs text-slate-400">Pick starting difficulty (Level 1–10) and select or write a custom persona.</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg">
              3
            </div>
            <h4 className="font-bold text-base text-white">Face the Roast</h4>
            <p className="text-xs text-slate-400">Answer 5 technical questions and receive your final evaluation report card.</p>
          </div>
        </div>

        <Link
          to="/setup"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 text-white font-black text-base px-10 py-4 rounded-2xl shadow-xl transition-all cursor-pointer"
        >
          <span>Start Your Interview Now</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

    </div>
  );
}
