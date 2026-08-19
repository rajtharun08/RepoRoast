import React, { useState } from 'react';
import { 
  GitBranch, 
  Search, 
  ShieldCheck, 
  Rocket, 
  Lock, 
  HeartHandshake, 
  UserCog, 
  ArrowRight, 
  Star, 
  FolderGit2, 
  Check, 
  Loader2,
  Sliders,
  Layers,
  Code2,
  Zap,
  Terminal,
  Cpu
} from 'lucide-react';
import { USE_MOCK_DATA, setMockMode } from '../services/api';

const PRESET_LIST = [
  { 
    key: 'FAANG Gatekeeper', 
    title: 'FAANG Gatekeeper',
    badge: 'Strict & Analytical',
    desc: 'Probes time & space complexity, memory bounds, and large-scale concurrency.', 
    icon: ShieldCheck
  },
  { 
    key: 'Startup CTO', 
    title: 'Startup CTO',
    badge: 'Pragmatic & Fast',
    desc: 'Focuses on developer velocity, code maintainability, and architectural trade-offs.', 
    icon: Rocket
  },
  { 
    key: 'Pedantic Security Auditor', 
    title: 'Security Auditor',
    badge: 'Paranoid & Deep',
    desc: 'Audits input validation, auth bypasses, secret leaks, and data sanitization.', 
    icon: Lock
  },
  { 
    key: 'Empathetic Mentor', 
    title: 'Empathetic Mentor',
    badge: 'Constructive Coach',
    desc: 'Asks challenging technical questions while offering guidance when you get stuck.', 
    icon: HeartHandshake
  },
  { 
    key: 'Custom Persona', 
    title: 'Custom Persona',
    badge: 'User Defined',
    desc: 'Specify custom interviewer background, tone, and specific code review priorities.', 
    icon: UserCog
  }
];

export default function Home({ onStartInterview, isLoading }) {
  const [inputMode, setInputMode] = useState('search');

  // Search & input state
  const [githubUser, setGithubUser] = useState('fastapi');
  const [userRepos, setUserRepos] = useState([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [repoSearchError, setRepoSearchError] = useState(null);
  const [selectedRepoUrl, setSelectedRepoUrl] = useState('https://github.com/fastapi/fastapi');
  const [directUrl, setDirectUrl] = useState('https://github.com/fastapi/fastapi');

  // Config state
  const [level, setLevel] = useState(1);
  const [persona, setPersona] = useState('FAANG Gatekeeper');
  const [customPersonaPrompt, setCustomPersonaPrompt] = useState('');

  const SAMPLE_REPOS = [
    { id: 1, name: 'fastapi', html_url: 'https://github.com/fastapi/fastapi', description: 'FastAPI framework, high performance, easy to learn', stargazers_count: 68500, language: 'Python' },
    { id: 2, name: 'react', html_url: 'https://github.com/facebook/react', description: 'The library for web and native user interfaces', stargazers_count: 220000, language: 'JavaScript' },
    { id: 3, name: 'express', html_url: 'https://github.com/expressjs/express', description: 'Fast, unopinionated web framework for Node', stargazers_count: 63000, language: 'JavaScript' },
    { id: 4, name: 'flask', html_url: 'https://github.com/pallets/flask', description: 'Python micro framework for web applications', stargazers_count: 65000, language: 'Python' },
    { id: 5, name: 'RepoRoast', html_url: 'https://github.com/rajtharun08/RepoRoast', description: 'Realistic technical interview escalation platform', stargazers_count: 15, language: 'Python' }
  ];

  const handleFetchUserRepos = async (userToFetch = githubUser) => {
    if (!userToFetch.trim()) return;
    setIsFetchingRepos(true);
    setRepoSearchError(null);
    try {
      let res = await fetch(`/api/repo/user/${userToFetch.trim()}`);
      if (!res.ok) {
        res = await fetch(`https://api.github.com/users/${userToFetch.trim()}/repos?sort=updated&per_page=12`);
      }
      
      if (!res.ok) {
        setRepoSearchError('GitHub Public API limit reached. Loaded sample repositories below.');
        setUserRepos(SAMPLE_REPOS);
        setSelectedRepoUrl(SAMPLE_REPOS[0].html_url);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setUserRepos(data);
        setSelectedRepoUrl(data[0].html_url);
      } else {
        setUserRepos(SAMPLE_REPOS);
        setSelectedRepoUrl(SAMPLE_REPOS[0].html_url);
      }
    } catch (err) {
      setUserRepos(SAMPLE_REPOS);
      setSelectedRepoUrl(SAMPLE_REPOS[0].html_url);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const activeRepoUrl = inputMode === 'search' ? selectedRepoUrl : directUrl;
  const activeRepoName = activeRepoUrl.replace('https://github.com/', '') || 'fastapi/fastapi';

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!activeRepoUrl) {
      alert('Please select or enter a GitHub repository');
      return;
    }
    onStartInterview({
      repoUrl: activeRepoUrl,
      level,
      persona,
      customPersona: persona === 'Custom Persona' ? customPersonaPrompt : ''
    });
  };

  const currentPreset = PRESET_LIST.find((p) => p.key === persona) || PRESET_LIST[0];

  return (
    <div className="min-h-[calc(100vh-57px)] bg-[#0d1117] text-slate-100 font-sans flex flex-col md:flex-row selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* LEFT SIDEBAR: Session Summary & Primary Action */}
      <aside className="w-full md:w-80 lg:w-96 bg-[#161b2e] border-b md:border-b-0 md:border-r border-[#30363d] p-6 flex flex-col justify-between shrink-0 space-y-6">
        <div className="space-y-6">
          
          {/* Header */}
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block mb-1">
              Studio Configuration
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              Roast Session Summary
            </h2>
          </div>

          {/* Selected Repo Card Summary */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
              Target Repository
            </span>
            <div className="font-mono font-bold text-sm text-white truncate">
              {activeRepoName}
            </div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Ready for ingestion
            </div>
          </div>

          {/* Selected Escalation Scope Card */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                Escalation Level
              </span>
              <span className="text-xs font-bold text-blue-400 font-mono">
                L{level}
              </span>
            </div>
            <div className="font-bold text-sm text-white">
              {level <= 3 ? 'Screening Phase' : level <= 7 ? 'System Design Phase' : 'Deep Code Review'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              {level <= 3 
                ? 'Ingests README.md and package manifests.' 
                : level <= 7 
                ? 'Ingests route handlers, entrypoints, and file tree.' 
                : 'Ingests complete filtered source files.'}
            </p>
          </div>

          {/* Selected Persona Summary Card */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Interviewer Persona
            </span>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <span>{currentPreset.title}</span>
            </div>
            <span className="text-[11px] text-blue-400 font-mono block">
              {currentPreset.badge}
            </span>
          </div>

        </div>

        {/* Primary Launch Action */}
        <div className="pt-4 border-t border-[#30363d]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !activeRepoUrl}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-base py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Ingesting Context...</span>
              </>
            ) : (
              <>
                <span>Launch Roast Session</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE: Full Studio Configuration Options */}
      <main className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto max-w-5xl">
        
        {/* Workspace Title */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Repository Roast Studio
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">
            Customize repository scope, escalation difficulty, and interviewer demeanor.
          </p>
        </div>

        {/* SECTION 1: Target Repository Picker */}
        <section className="bg-[#161b2e] border border-[#30363d] rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-blue-400" />
                1. Target Repository
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Fetch public repositories for any GitHub username or enter a direct repo URL.
              </p>
            </div>

            {/* Input Switcher */}
            <div className="flex items-center p-1 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setInputMode('search')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  inputMode === 'search' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                GitHub User
              </button>
              <button
                type="button"
                onClick={() => setInputMode('url')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  inputMode === 'url' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Direct URL
              </button>
            </div>
          </div>

          {inputMode === 'search' ? (
            <div className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleFetchUserRepos(); }} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="Enter GitHub username or organization (e.g. fastapi, facebook)..."
                    className="w-full bg-[#0d1117] text-slate-100 placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#30363d] focus:outline-none focus:border-blue-500 transition-all font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isFetchingRepos}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isFetchingRepos ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Fetch Repos</span>
                </button>
              </form>

              {/* Repos Grid */}
              {userRepos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1 pt-1">
                  {userRepos.map((repo) => (
                    <div
                      key={repo.id || repo.name}
                      onClick={() => setSelectedRepoUrl(repo.html_url)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedRepoUrl === repo.html_url
                          ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/50 text-white shadow-sm'
                          : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs font-mono text-slate-200 truncate">{repo.name}</span>
                        {selectedRepoUrl === repo.html_url && (
                          <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                        {repo.description || 'Public repository'}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>{repo.language || 'Code'}</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {repo.stargazers_count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <input
              type="url"
              required
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="w-full bg-[#0d1117] text-slate-100 placeholder-slate-500 text-sm px-4 py-3 rounded-xl border border-[#30363d] focus:outline-none focus:border-blue-500 font-mono transition-all"
            />
          )}
        </section>

        {/* SECTION 2: Escalation Level */}
        <section className="bg-[#161b2e] border border-[#30363d] rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              2. Escalation Difficulty Level
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Controls prompt context trimming and technical interview question depth.
            </p>
          </div>

          {/* Preset Phase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              onClick={() => setLevel(1)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                level <= 3 
                  ? 'bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50' 
                  : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-sm text-slate-200">Levels 1–3</div>
              <div className="text-xs text-blue-400 font-mono mt-0.5">Screening Phase</div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Evaluates high-level project goals, README, and dependency manifests.
              </p>
            </div>

            <div
              onClick={() => setLevel(5)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                level >= 4 && level <= 7
                  ? 'bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50' 
                  : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-sm text-slate-200">Levels 4–7</div>
              <div className="text-xs text-blue-400 font-mono mt-0.5">System Design Phase</div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Evaluates file tree layout, route handlers, middleware, and architectural boundaries.
              </p>
            </div>

            <div
              onClick={() => setLevel(9)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                level >= 8
                  ? 'bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50' 
                  : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-sm text-slate-200">Levels 8–10</div>
              <div className="text-xs text-blue-400 font-mono mt-0.5">Deep Code Review</div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Ingests complete source code files for intense line-by-line algorithm review.
              </p>
            </div>
          </div>

          {/* Fine Level Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Exact Level: <strong className="text-blue-400 font-bold">Level {level}</strong></span>
              <span className="text-slate-500">Scale 1 to 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="w-full accent-blue-500 bg-[#0d1117] rounded-lg cursor-pointer h-2.5"
            />
          </div>
        </section>

        {/* SECTION 3: Interviewer Persona Selector */}
        <section className="bg-[#161b2e] border border-[#30363d] rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              3. Interviewer Persona
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sets system prompt behavior, questioning style, and technical evaluation strictness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {PRESET_LIST.map(({ key, title, badge, desc, icon: Icon }) => {
              const isSelected = persona === key;
              return (
                <div
                  key={key}
                  onClick={() => setPersona(key)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/50 text-white shadow-sm'
                      : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-bold text-sm text-slate-100">{title}</div>
                    <span className="text-[10px] text-blue-400 font-mono font-semibold block mt-0.5">{badge}</span>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {persona === 'Custom Persona' && (
            <div className="p-4 rounded-xl bg-[#0d1117] border border-blue-500/40 space-y-2">
              <label className="text-xs font-bold text-blue-300 flex items-center gap-2 font-mono">
                <Code2 className="w-4 h-4 text-blue-400" />
                Custom Persona Instructions
              </label>
              <textarea
                rows={3}
                value={customPersonaPrompt}
                onChange={(e) => setCustomPersonaPrompt(e.target.value)}
                placeholder="e.g., You are a strict Senior Staff Engineer focusing on microservices resiliency, rate limiting, and memory efficiency..."
                className="w-full bg-[#161b2e] text-slate-100 placeholder-slate-500 text-xs p-3 rounded-xl border border-[#30363d] focus:outline-none focus:border-blue-500 transition-all font-mono leading-relaxed"
              />
            </div>
          )}
        </section>

      </main>

    </div>
  );
}
