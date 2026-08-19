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
  Sparkles, 
  Star, 
  FolderGit2, 
  CheckCircle2, 
  Loader2,
  Sliders,
  Layers,
  Code2,
  Zap
} from 'lucide-react';
import { USE_MOCK_DATA, setMockMode } from '../services/api';

const PRESET_LIST = [
  { 
    key: 'FAANG Gatekeeper', 
    desc: 'Strict, highly analytical. Probes scalability, memory management, and time complexity.', 
    icon: ShieldCheck,
    color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/40 text-indigo-400'
  },
  { 
    key: 'Startup CTO', 
    desc: 'Pragmatic & fast-paced. Values developer velocity, maintainability, and architectural trade-offs.', 
    icon: Rocket,
    color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400'
  },
  { 
    key: 'Pedantic Security Auditor', 
    desc: 'Paranoid security architect. Audits input validation, auth bypasses, and data flow leaks.', 
    icon: Lock,
    color: 'from-rose-500/20 to-red-500/20 border-red-500/40 text-red-400'
  },
  { 
    key: 'Empathetic Mentor', 
    desc: 'Constructive interview coach. Asks tough questions but guides you when stuck.', 
    icon: HeartHandshake,
    color: 'from-emerald-500/20 to-teal-500/20 border-teal-500/40 text-teal-400'
  },
  { 
    key: 'Custom Persona', 
    desc: 'Define your own specialized interviewer background and technical demeanor.', 
    icon: UserCog,
    color: 'from-violet-500/20 to-purple-500/20 border-purple-500/40 text-purple-400'
  }
];

export default function Home({ onStartInterview, isLoading }) {
  // Navigation & Selection Modes: 'search' | 'url'
  const [inputMode, setInputMode] = useState('search');
  const [isMockMode, setIsMockModeState] = useState(USE_MOCK_DATA);

  const toggleMockMode = () => {
    const nextVal = !isMockMode;
    setIsMockModeState(nextVal);
    setMockMode(nextVal);
  };
  
  // GitHub Username Search state
  const [githubUser, setGithubUser] = useState('fastapi');
  const [userRepos, setUserRepos] = useState([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [repoSearchError, setRepoSearchError] = useState(null);
  const [selectedRepoUrl, setSelectedRepoUrl] = useState('');

  // Direct URL Input state
  const [directUrl, setDirectUrl] = useState('https://github.com/fastapi/fastapi');

  // Config state
  const [level, setLevel] = useState(1);
  const [persona, setPersona] = useState('FAANG Gatekeeper');
  const [customPersonaPrompt, setCustomPersonaPrompt] = useState('');

  // Sample fallback repositories when GitHub public API rate-limits (403 Forbidden)
  const SAMPLE_REPOS = [
    { id: 1, name: 'fastapi', html_url: 'https://github.com/fastapi/fastapi', description: 'FastAPI framework, high performance, easy to learn, fast to code', stargazers_count: 68500, language: 'Python' },
    { id: 2, name: 'react', html_url: 'https://github.com/facebook/react', description: 'The library for web and native user interfaces', stargazers_count: 220000, language: 'JavaScript' },
    { id: 3, name: 'express', html_url: 'https://github.com/expressjs/express', description: 'Fast, unopinionated, minimalist web framework for node', stargazers_count: 63000, language: 'JavaScript' },
    { id: 4, name: 'flask', html_url: 'https://github.com/pallets/flask', description: 'The Python micro framework for building web applications', stargazers_count: 65000, language: 'Python' },
    { id: 5, name: 'RepoRoast', html_url: 'https://github.com/rajtharun08/RepoRoast', description: 'Realistic technical interview escalation platform', stargazers_count: 15, language: 'Python' }
  ];

  // Fetch Public Repos for GitHub Username
  const handleFetchUserRepos = async (e) => {
    if (e) e.preventDefault();
    if (!githubUser.trim()) return;
    setIsFetchingRepos(true);
    setRepoSearchError(null);
    try {
      let res = await fetch(`/api/repo/user/${githubUser.trim()}`);
      if (!res.ok) {
        res = await fetch(`https://api.github.com/users/${githubUser.trim()}/repos?sort=updated&per_page=12`);
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
        setRepoSearchError(`No public repositories found for "${githubUser}". Loaded sample repositories.`);
        setUserRepos(SAMPLE_REPOS);
        setSelectedRepoUrl(SAMPLE_REPOS[0].html_url);
      }
    } catch (err) {
      setRepoSearchError('GitHub Public API limit reached. Loaded sample repositories below.');
      setUserRepos(SAMPLE_REPOS);
      setSelectedRepoUrl(SAMPLE_REPOS[0].html_url);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalRepoUrl = inputMode === 'search' ? selectedRepoUrl : directUrl.trim();
    if (!finalRepoUrl) {
      alert('Please select or enter a valid GitHub repository URL');
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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-4xl w-full mx-auto space-y-8 my-auto py-6">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Interview Setup & Repository Selection</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Configure Your Roast
          </h1>
          
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Select your target codebase, set your starting escalation level, and choose your interviewer persona.
          </p>
        </div>

        {/* Configuration Card */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8 backdrop-blur-xl">
          
          {/* STEP 1: Repository Selection Mode */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                Step 1: Select Target Repository
              </label>
              
              {/* Tab Selector */}
              <div className="flex items-center p-1 bg-[#0b0f19] border border-slate-800 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setInputMode('search')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    inputMode === 'search' 
                      ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Search GitHub User
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    inputMode === 'url' 
                      ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Direct Repo URL
                </button>
              </div>
            </div>

            {/* Mode 1: Search GitHub Username */}
            {inputMode === 'search' ? (
              <div className="space-y-4">
                <form onSubmit={handleFetchUserRepos} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={githubUser}
                      onChange={(e) => setGithubUser(e.target.value)}
                      placeholder="Enter GitHub username or organization (e.g. fastapi, octocat)..."
                      className="w-full bg-[#0b0f19] text-slate-100 placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isFetchingRepos}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 shrink-0"
                  >
                    {isFetchingRepos ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : <Search className="w-4 h-4 text-indigo-400" />}
                    <span>Fetch Repos</span>
                  </button>
                </form>

                {repoSearchError && (
                  <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl font-mono">
                    ⚠️ {repoSearchError}
                  </p>
                )}

                {/* Grid of Public Repositories */}
                {userRepos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
                    {userRepos.map((repo) => (
                      <div
                        key={repo.id}
                        onClick={() => setSelectedRepoUrl(repo.html_url)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedRepoUrl === repo.html_url
                            ? 'bg-indigo-500/10 border-indigo-500/60 ring-1 ring-indigo-500/40 text-white'
                            : 'bg-[#0b0f19] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs font-mono truncate text-slate-200">{repo.name}</span>
                          {selectedRepoUrl === repo.html_url && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
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
              /* Mode 2: Direct URL Input */
              <div className="space-y-2">
                <input
                  type="url"
                  required
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="w-full bg-[#0b0f19] text-slate-100 placeholder-slate-500 text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition-all"
                />
              </div>
            )}
          </div>

          <hr className="border-slate-800/80" />

          {/* STEP 2: Difficulty Level Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Step 2: Difficulty Escalation: <span className="text-indigo-400 font-mono font-bold text-sm">Level {level}</span>
              </label>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                {level <= 3 ? 'Screening (README & Manifests)' : level <= 7 ? 'System Design (File Tree & Routers)' : 'Deep Code Review (Full Source)'}
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
              <span>L1-3: Screening</span>
              <span>L4-7: System Design</span>
              <span>L8-10: Deep Code Review</span>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* STEP 3: Interviewer Persona Selector */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-indigo-400" />
              Step 3: Select Interviewer Persona
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRESET_LIST.map(({ key, desc, icon: Icon, color }) => (
                <div
                  key={key}
                  onClick={() => setPersona(key)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
                    persona === key
                      ? `bg-gradient-to-br ${color} ring-1 ring-indigo-500/50 shadow-lg`
                      : 'bg-[#0b0f19] border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${persona === key ? 'bg-slate-900 border-slate-700 text-indigo-400' : 'bg-slate-800/50 border-slate-800 text-slate-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm text-slate-100 group-hover:text-white">{key}</span>
                    </div>
                    {persona === key && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Expandable Custom Persona Text Area */}
            {persona === 'Custom Persona' && (
              <div className="mt-4 p-4 rounded-2xl bg-[#0b0f19] border border-purple-500/40 space-y-2 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-purple-300 flex items-center gap-2 font-mono">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  Define Custom System Instructions & Demeanor
                </label>
                <textarea
                  rows={3}
                  value={customPersonaPrompt}
                  onChange={(e) => setCustomPersonaPrompt(e.target.value)}
                  placeholder="e.g., You are a strict Senior Security Architect specializing in microservices. Probe every endpoint for rate-limiting, auth bypasses, and data validation..."
                  className="w-full bg-[#131b2e] text-slate-100 placeholder-slate-500 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Launch Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || (inputMode === 'search' && !selectedRepoUrl) || (inputMode === 'url' && !directUrl)}
            className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-base py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Ingesting Repository & Initializing...</span>
              </>
            ) : (
              <>
                <span>Start Repo Roast Session</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 font-mono">
          Lightweight AI System • Powered by Gemini API & LangChain • Max 5 Questions
        </div>
      </div>
    </div>
  );
}
