import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Home, Play, Award, Zap, GitBranch } from 'lucide-react';
import { USE_MOCK_DATA, setMockMode } from '../services/api';

export default function Navbar({ isMockMode, onToggleMockMode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/setup', label: 'Start Interview', icon: Play },
  ];

  return (
    <nav className="bg-[#111726]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xl">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="bg-gradient-to-tr from-orange-600 via-amber-500 to-red-500 p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform">
          <Flame className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-base tracking-wide text-white group-hover:text-orange-400 transition-colors">
            RepoRoast
          </span>
          <span className="text-[10px] text-slate-400 font-mono -mt-0.5">
            Technical Interview Simulator
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-1 bg-[#080c14] p-1 rounded-2xl border border-slate-800/80">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Mock Mode Toggle Badge */}
      <button
        type="button"
        onClick={onToggleMockMode}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
          isMockMode 
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm ring-1 ring-emerald-500/30'
            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
        }`}
        title="Click to toggle between 100% offline Mock Mode and Live Gemini API Mode"
      >
        <Zap className={`w-3.5 h-3.5 ${isMockMode ? 'text-emerald-400 fill-emerald-400' : 'text-slate-500'}`} />
        <span className="hidden sm:inline">{isMockMode ? 'Mock Mode (0 Tokens)' : 'Live Gemini API'}</span>
      </button>
    </nav>
  );
}
