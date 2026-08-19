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
  Sparkles
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
    desc: 'Focuses on developer velocity, code maintainability, and pragmatic architectural trade-offs.', 
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

const QUICK_SUGGESTIONS = [
  { name: 'fastapi/fastapi', label: 'FastAPI' },
  { name: 'facebook/react', label: 'React' },
  { name: 'expressjs/express', label: 'Express' },
  { name: 'pallets/flask', label: 'Flask' },
  { name: 'rajtharun08/RepoRoast', label: 'RepoRoast' }
];

export default function Home({ onStartInterview, isLoading }) {
  const [inputMode, setInputMode] = useState('search');
  const [isMockMode, setIsMockModeState] = useState(USE_MOCK_DATA);

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

  const handleQuickChipSelect = (repoFullName) => {
    const parts = repoFullName.split('/');
    const user = parts[0];
    setGithubUser(user);
    const fullUrl = `https://github.com/${repoFullName}`;
    setSelectedRepoUrl(fullUrl);
    setDirectUrl(fullUrl);
    handleFetchUserRepos(user);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const finalRepoUrl = inputMode === 'search' ? selectedRepoUrl : directUrl.trim();
    if (!finalRepoUrl) {
      alert('Please select or enter a GitHub repository');
      return;
    }
    onStartInterview({
      repoUrl: finalRepoUrl,
      level,
      persona,
      customPersona: persona === 'Custom Persona' ? customPersonaPrompt : ''
    });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans p-4 md:p-8 flex flex-col justify-center selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-4xl w-full mx-auto space-y-8 my-auto">
        
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Interview Setup
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Select a GitHub repository, choose your escalation difficulty level, and set your interviewer persona.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">
          
          {/* Section 1: Target Repository */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                Target Repository
              </label>

              {/* Input Mode Switcher */}
              <div className="flex items-center p-1 bg-[#090d16] border border-slate-800 rounded-xl text-xs font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setInputMode('search')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    inputMode === 'search' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  GitHub Username
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    inputMode === 'url' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Direct URL
                </button>
              </div>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 font-medium mr-1">Quick Select:</span>
              {QUICK_SUGGESTIONS.map((chip) => (
                <button
                  key={chip.name}
                  type="button"
                  onClick={() => handleQuickChipSelect(chip.name)}
                  className="bg-[#090d16] hover:bg-slate-800 text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-all cursor-pointer font-mono"
                >
                  {chip.label}
                </button>
              ))}
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
                      placeholder="Enter GitHub user or org (e.g. fastapi, facebook)..."
                      className="w-full bg-[#090d16] text-slate-100 placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isFetchingRepos}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isFetchingRepos ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Fetch</span>
                  </button>
                </form>

                {/* Repos Cards Grid */}
                {userRepos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
                    {userRepos.map((repo) => (
                      <div
                        key={repo.id || repo.name}
                        onClick={() => setSelectedRepoUrl(repo.html_url)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedRepoUrl === repo.html_url
                            ? 'bg-indigo-600/15 border-indigo-500 ring-1 ring-indigo-500/50 text-white shadow-md'
                            : 'bg-[#090d16] border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs font-mono text-slate-200 truncate">{repo.name}</span>
                          {selectedRepoUrl === repo.html_url && (
                            <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
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
                className="w-full bg-[#090d16] text-slate-100 placeholder-slate-500 text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition-all"
              />
            )}
          </div>

          <hr className="border-slate-800/60" />

          {/* Section 2: Escalation Level Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Escalation Difficulty Level
              </label>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30 font-mono">
                Level {level}: {level <= 3 ? 'Screening' : level <= 7 ? 'System Design' : 'Deep Code Review'}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2.5"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>L1–3: README & Manifests</span>
              <span>L4–7: Architecture & Routers</span>
              <span>L8–10: Complete Code Review</span>
            </div>
          </div>

          <hr className="border-slate-800/60" />

          {/* Section 3: Persona Selection */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Interviewer Persona
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {PRESET_LIST.map(({ key, title, badge, desc, icon: Icon }) => {
                const isSelected = persona === key;
                return (
                  <div
                    key={key}
                    onClick={() => setPersona(key)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md'
                        : 'bg-[#090d16] border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-sm text-slate-100">{title}</div>
                      <span className="text-[10px] text-indigo-400 font-mono font-medium block mt-0.5">{badge}</span>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {persona === 'Custom Persona' && (
              <div className="p-4 rounded-2xl bg-[#090d16] border border-indigo-500/40 space-y-2">
                <label className="text-xs font-bold text-indigo-300 flex items-center gap-2 font-mono">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Custom Persona System Instructions
                </label>
                <textarea
                  rows={3}
                  value={customPersonaPrompt}
                  onChange={(e) => setCustomPersonaPrompt(e.target.value)}
                  placeholder="e.g., You are a strict Senior Staff Engineer focusing on microservices resiliency, rate limiting, and memory efficiency..."
                  className="w-full bg-[#111726] text-slate-100 placeholder-slate-500 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-all font-mono leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-base py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Ingesting Repository Context...</span>
              </>
            ) : (
              <>
                <span>Start Mock Interview</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
