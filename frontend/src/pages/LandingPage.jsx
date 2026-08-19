import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch, Terminal, ShieldCheck, Rocket, Lock, HeartHandshake, Shield } from 'lucide-react';

const PERSONA_PREVIEWS = [
  {
    id: 'batman',
    name: 'Batman (Gotham Auditor)',
    level: 'Level 5 (Vigilante Audit)',
    icon: Shield,
    question: 'I watched Gotham\'s infrastructure crumble because of unvalidated edge cases. Looking at your route handlers in routes/auth.py, how do you ensure zero single-point-of-failure when your primary database cluster goes offline in the dark?',
    response: 'We implement automatic multi-region failover with read-only replicas and circuit breakers to guarantee zero service interruption during infrastructure outages.'
  },
  {
    id: 'faang',
    name: 'FAANG Gatekeeper',
    level: 'Level 5 (System Design)',
    icon: ShieldCheck,
    question: 'Looking at your route handlers in routes/auth.py, how do you prevent event loop blocking when CPU-bound password hashing handles high concurrent traffic?',
    response: 'We offload CPU-bound hashing execution to a thread pool executor using FastAPI\'s run_in_threadpool to ensure non-blocking event loop execution.'
  },
  {
    id: 'cto',
    name: 'Startup CTO',
    level: 'Level 4 (Pragmatic Design)',
    icon: Rocket,
    question: 'You have 3 separate services sharing DB models directly. How do you prevent schema migrations from breaking production deployments during fast iterations?',
    response: 'We enforce backwards-compatible dual-write migrations and decouple shared database entities into a versioned internal package.'
  },
  {
    id: 'security',
    name: 'Security Auditor',
    level: 'Level 7 (Security Audit)',
    icon: Lock,
    question: 'In your JWT authentication middleware, how do you defend against algorithm confusion attacks if an attacker attempts an alg: none or HMAC/RSA key swap?',
    response: 'We explicitly restrict allowed algorithms to [\'RS256\'], enforce strict public key type checks during verification, and reject unsigned payloads.'
  }
];

export default function LandingPage() {
  const [activePersonaId, setActivePersonaId] = useState('batman');
  const activePreview = PERSONA_PREVIEWS.find((p) => p.id === activePersonaId) || PERSONA_PREVIEWS[0];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 max-w-4xl mx-auto text-center space-y-8">
        
        {/* Main Tagline Header */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Don't just review code.<br />
          <span className="text-zinc-400 font-normal">
            Roast your repository.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
          Subject your codebase to realistic, escalating technical interviews. Starts with high-level architectural screening and progresses to deep code review while optimizing LLM token context.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/setup"
            className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-zinc-900 font-extrabold text-base px-8 py-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <span>Start Mock Interview</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-zinc-900" />
          </Link>
          <a
            href="https://github.com/rajtharun08/RepoRoast"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-base px-7 py-4 rounded-xl border border-zinc-800 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <GitBranch className="w-5 h-5 text-zinc-400" />
            <span>GitHub Repository</span>
          </a>
        </div>

        {/* Interactive Code Preview Terminal Card featuring Batman */}
        <div className="pt-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl text-left max-w-3xl mx-auto space-y-6">
            
            {/* Persona Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono text-zinc-400 mr-2">Trainer Persona:</span>
              {PERSONA_PREVIEWS.map((p) => {
                const Icon = p.icon;
                const isActive = activePersonaId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePersonaId(p.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Terminal Window Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <span className="text-sm font-mono text-zinc-400 ml-2">fastapi/fastapi • {activePreview.level}</span>
              </div>
              <span className="text-xs font-mono text-zinc-100 bg-zinc-800 px-3 py-1 rounded-md border border-zinc-700 font-bold">
                🦇 {activePreview.name}
              </span>
            </div>

            {/* Q&A Exchange Box */}
            <div className="space-y-4 font-mono text-xs md:text-sm leading-relaxed text-zinc-300">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
                <div className="text-zinc-200 font-bold mb-1.5 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-400" />
                  <span>Interviewer ({activePreview.name}):</span>
                </div>
                "{activePreview.question}"
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 text-zinc-300">
                <div className="text-blue-400 font-bold mb-1.5">Candidate Response:</div>
                "{activePreview.response}"
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto border-t border-zinc-800/60 text-center space-y-12">
        <h2 className="text-3xl font-extrabold text-white">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 space-y-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 font-bold text-sm flex items-center justify-center font-mono">
              01
            </div>
            <h4 className="font-bold text-base text-white pt-1">Select Repository</h4>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">Fetch public GitHub user repos or enter a direct URL.</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 space-y-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 font-bold text-xs flex items-center justify-center font-mono">
              02
            </div>
            <h4 className="font-bold text-base text-white pt-1">Choose Level</h4>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">Select difficulty (Level 1–10) and set interviewer persona (e.g. Batman).</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 space-y-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 font-bold text-sm flex items-center justify-center font-mono">
              03
            </div>
            <h4 className="font-bold text-base text-white pt-1">Face the Roast</h4>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">Answer 5 questions and receive your evaluation report.</p>
          </div>
        </div>

        <Link
          to="/setup"
          className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-extrabold text-base px-9 py-4 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <span>Start Technical Interview</span>
          <ArrowRight className="w-5 h-5 text-zinc-900" />
        </Link>
      </section>

    </div>
  );
}
