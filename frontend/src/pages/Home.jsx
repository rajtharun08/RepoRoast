import React, { useState } from 'react';
import { Flame, GitBranch, Shield, Zap, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import { PERSONA_PRESETS } from '../../../backend/app/services/persona_service'; // fallback preset list

const PRESET_LIST = [
  { key: 'FAANG Gatekeeper', desc: 'Strict, analytical, focuses on complexity & scalability.', icon: Shield },
  { key: 'Startup CTO', desc: 'Pragmatic, values execution, maintainability & speed.', icon: Zap },
  { key: 'Pedantic Security Auditor', desc: 'Paranoid about auth, validation & security leaks.', icon: Flame },
  { key: 'Empathetic Mentor', desc: 'Constructive coach, provides helpful guidance.', icon: UserCheck }
];

export default function Home({ onStartInterview, isLoading }) {
  const [repoUrl, setRepoUrl] = useState('https://github.com/fastapi/fastapi');
  const [level, setLevel] = useState(1);
  const [persona, setPersona] = useState('FAANG Gatekeeper');
  const [customPersona, setCustomPersona] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    onStartInterview({ repoUrl: repoUrl.trim(), level, persona, customPersona });
  };

  return (
    <div className="min-h-screen bg-roast-dark flex items-center justify-center p-4 md:p-8">
      <div className="max-w-3xl w-full space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>AI Repository Interview Simulator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            RepoRoast <span className="text-orange-500">🔥</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Face realistic, escalating technical interviews tailored directly to your codebase. 
            Starts with architecture screening and scales up to deep code review.
          </p>
        </div>

        {/* Config Form Card */}
        <form onSubmit={handleSubmit} className="bg-roast-card border border-roast-border rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          {/* GitHub Repo Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-orange-400" />
              Target GitHub Repository URL
            </label>
            <input
              type="text"
              required
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="w-full bg-roast-dark text-slate-100 placeholder-slate-500 text-sm px-4 py-3 rounded-xl border border-roast-border focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono"
            />
          </div>

          {/* Level Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Starting Difficulty Level: <span className="text-orange-400 font-mono">Level {level}</span>
              </label>
              <span className="text-xs font-medium text-slate-400">
                {level <= 3 ? 'Screening (README & Manifests)' : level <= 7 ? 'System Design (File Tree & Routers)' : 'Deep Code Review (Full Source)'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="w-full accent-orange-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>L1: Screening</span>
              <span>L5: Architecture</span>
              <span>L10: Deep Code</span>
            </div>
          </div>

          {/* Persona Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Interviewer Persona
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRESET_LIST.map(({ key, desc, icon: Icon }) => (
                <div
                  key={key}
                  onClick={() => setPersona(key)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    persona === key
                      ? 'bg-orange-500/10 border-orange-500/50 text-white ring-1 ring-orange-500/40'
                      : 'bg-roast-dark border-roast-border text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${persona === key ? 'text-orange-400' : 'text-slate-500'}`} />
                    <span className="font-bold text-sm text-slate-200">{key}</span>
                  </div>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-extrabold text-base py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{isLoading ? 'Ingesting Repository & Initializing...' : 'Start Repo Roast Session'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
