import React, { useState } from 'react';
import { 
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
  AlertCircle
} from 'lucide-react';

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

export default function Home({ onStartInterview, isLoading }) {
  const [inputMode, setInputMode] = useState('search');

  // Search & input state
  const [githubUser, setGithubUser] = useState('fastapi');
  const [userRepos, setUserRepos] = useState([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [selectedRepoUrl, setSelectedRepoUrl] = useState('https://github.com/fastapi/fastapi');
  const [directUrl, setDirectUrl] = useState('https://github.com/fastapi/fastapi');

  // Config state
  const [level, setLevel] = useState(1);
  const [persona, setPersona] = useState('FAANG Gatekeeper');
  const [customPersonaPrompt, setCustomPersonaPrompt] = useState('');

  const handleFetchUserRepos = async (userToFetch = githubUser) => {
    if (!userToFetch.trim()) return;
    setIsFetchingRepos(true);
    setFetchError(null);
    try {
      let res = await fetch(`/api/repo/user/${userToFetch.trim()}`);
      if (!res.ok) {
        res = await fetch(`https://api.github.com/users/${userToFetch.trim()}/repos?sort=updated&per_page=12`);
      }
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `GitHub user or organization '${userToFetch.trim()}' was not found.`);
      }

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setUserRepos(data);
        setSelectedRepoUrl(data[0].html_url);
      } else {
        setUserRepos([]);
        setFetchError(`No public repositories found for GitHub user '${userToFetch.trim()}'.`);
      }
    } catch (err) {
      console.error('Fetch Repos Error:', err);
      setUserRepos([]);
      setFetchError(err.message || `Could not fetch repositories for '${userToFetch.trim()}'. Check the username or use Direct URL.`);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const activeRepoUrl = inputMode === 'search' ? selectedRepoUrl : directUrl;
  const activeRepoName = activeRepoUrl.replace('https://github.com/', '') || 'fastapi/fastapi';

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!activeRepoUrl) {
      alert('Please select or enter a valid GitHub repository URL.');
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
    <div className="min-h-[calc(100vh-60px)] bg-[#09090b] text-zinc-100 font-sans flex flex-col md:flex-row">
      
      {/* LEFT PANEL: Overview & Action */}
      <aside className="w-full md:w-80 lg:w-96 bg-zinc-900/90 border-b md:border-b-0 md:border-r border-zinc-800/80 p-6 md:p-8 flex flex-col justify-between shrink-0 space-y-6">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Configuration
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Session Overview
            </h2>
          </div>

          {/* Repo Card */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-zinc-400 font-semibold flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-zinc-300" />
              Target Repository
            </span>
            <div className="font-mono font-bold text-base text-white truncate">
              {activeRepoName}
            </div>
          </div>

          {/* Escalation Level Card */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-zinc-400 font-semibold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zinc-300" />
                Escalation Level
              </span>
              <span className="text-xs font-bold text-white font-mono bg-zinc-800 px-2.5 py-1 rounded-md">
                Level {level}
              </span>
            </div>
            <div className="font-bold text-base text-zinc-100">
              {level <= 3 ? 'Screening Phase' : level <= 7 ? 'System Design Phase' : 'Deep Code Review'}
            </div>
          </div>

          {/* Persona Card */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-zinc-400 font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-300" />
              Interviewer Persona
            </span>
            <div className="font-bold text-base text-white">
              {currentPreset.title}
            </div>
            <span className="text-xs text-zinc-400 font-mono block">
              {currentPreset.badge}
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-6 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !activeRepoUrl}
            className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-extrabold text-base py-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-zinc-900" />
                <span>Ingesting Repository...</span>
              </>
            ) : (
              <>
                <span>Start Mock Interview</span>
                <ArrowRight className="w-5 h-5 text-zinc-900 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* RIGHT PANEL: Configuration Options */}
      <main className="flex-1 p-6 md:p-10 space-y-10 max-w-5xl overflow-y-auto">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Interview Studio Setup
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-1.5">
            Configure target repository, difficulty escalation, and interviewer demeanor.
          </p>
        </div>

        {/* Section 1: Target Repo */}
        <section className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <FolderGit2 className="w-5 h-5 text-zinc-300" />
              Target Repository
            </h3>

            {/* Input Switcher */}
            <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setInputMode('search')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  inputMode === 'search' 
                    ? 'bg-zinc-800 text-white font-bold shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                GitHub User Search
              </button>
              <button
                type="button"
                onClick={() => setInputMode('url')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  inputMode === 'url' 
                    ? 'bg-zinc-800 text-white font-bold shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Direct URL Input
              </button>
            </div>
          </div>

          {inputMode === 'search' ? (
            <div className="space-y-5">
              <form onSubmit={(e) => { e.preventDefault(); handleFetchUserRepos(); }} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="Enter GitHub user or org (e.g. fastapi, facebook)..."
                    className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-700 transition-all font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isFetchingRepos}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-bold px-6 py-3 rounded-xl border border-zinc-700 transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isFetchingRepos ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Fetch Repos</span>
                </button>
              </form>

              {fetchError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-xl font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{fetchError}</span>
                </div>
              )}

              {userRepos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-72 overflow-y-auto pr-1">
                  {userRepos.map((repo) => (
                    <div
                      key={repo.id || repo.name}
                      onClick={() => setSelectedRepoUrl(repo.html_url)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        selectedRepoUrl === repo.html_url
                          ? 'bg-zinc-800 border-zinc-500 text-white ring-1 ring-zinc-500'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm font-mono text-zinc-100 truncate">{repo.name}</span>
                        {selectedRepoUrl === repo.html_url && (
                          <Check className="w-4 h-4 text-white shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {repo.description || 'Public repository'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono pt-1">
                        <span>{repo.language || 'Code'}</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-zinc-400" />
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
              className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-sm px-4 py-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-700 font-mono transition-all"
            />
          )}
        </section>

        {/* Section 2: Escalation Level */}
        <section className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-zinc-300" />
            Escalation Difficulty Level
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setLevel(1)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                level <= 3 
                  ? 'bg-zinc-800 border-zinc-500 text-white ring-1 ring-zinc-500' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="font-bold text-sm text-zinc-100">Levels 1–3</div>
              <div className="text-xs text-zinc-300 font-mono mt-0.5">Screening Phase</div>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Evaluates README.md and dependency package manifests.
              </p>
            </div>

            <div
              onClick={() => setLevel(5)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                level >= 4 && level <= 7
                  ? 'bg-zinc-800 border-zinc-500 text-white ring-1 ring-zinc-500' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="font-bold text-sm text-zinc-100">Levels 4–7</div>
              <div className="text-xs text-zinc-300 font-mono mt-0.5">System Design</div>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Evaluates route handlers, entrypoints, and file architecture.
              </p>
            </div>

            <div
              onClick={() => setLevel(9)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                level >= 8
                  ? 'bg-zinc-800 border-zinc-500 text-white ring-1 ring-zinc-500' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="font-bold text-sm text-zinc-100">Levels 8–10</div>
              <div className="text-xs text-zinc-300 font-mono mt-0.5">Deep Code Review</div>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Ingests complete source code files for deep review.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-xs md:text-sm font-mono">
              <span className="text-zinc-400">Selected Difficulty: <strong className="text-white font-bold">Level {level}</strong></span>
              <span className="text-zinc-500">Scale 1–10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="w-full accent-zinc-100 bg-zinc-950 rounded-lg cursor-pointer h-2.5"
            />
          </div>
        </section>

        {/* Section 3: Persona Selection */}
        <section className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-zinc-300" />
            Interviewer Persona
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PRESET_LIST.map(({ key, title, badge, desc, icon: Icon }) => {
              const isSelected = persona === key;
              return (
                <div
                  key={key}
                  onClick={() => setPersona(key)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-zinc-800 border-zinc-500 text-white ring-1 ring-zinc-500'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-zinc-100">
                      {title}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                  </div>
                  <span className="text-xs text-zinc-400 font-mono block">{badge}</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>

          {persona === 'Custom Persona' && (
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-2 font-mono">
                <Code2 className="w-4 h-4 text-zinc-400" />
                Custom Persona Instructions
              </label>
              <textarea
                rows={3}
                value={customPersonaPrompt}
                onChange={(e) => setCustomPersonaPrompt(e.target.value)}
                placeholder="Type any name or character (e.g. 'Batman', 'Linus Torvalds', 'Gordon Ramsay') or custom interviewer instructions..."
                className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 text-xs p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-700 font-mono leading-relaxed"
              />
            </div>
          )}
        </section>

      </main>

    </div>
  );
}
