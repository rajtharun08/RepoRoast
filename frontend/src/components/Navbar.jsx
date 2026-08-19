import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Home, Play, Zap } from 'lucide-react';

export default function Navbar({ isMockMode, onToggleMockMode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/setup', label: 'Setup Studio', icon: Play },
  ];

  return (
    <nav className="bg-[#161b22] border-b border-[#30363d] px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 group cursor-pointer">
        <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-all">
          <Flame className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">
            RepoRoast
          </span>
          <span className="text-[10px] text-slate-400 font-mono -mt-0.5">
            Technical Interview Studio
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-xl border border-[#30363d]">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Mock Mode Toggle Badge */}
      <button
        type="button"
        onClick={onToggleMockMode}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
          isMockMode 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-sm'
            : 'bg-[#0d1117] text-slate-400 border-[#30363d] hover:text-slate-200'
        }`}
        title="Toggle between offline Mock Mode and live Gemini API Mode"
      >
        <Zap className={`w-3.5 h-3.5 ${isMockMode ? 'text-emerald-400 fill-emerald-400' : 'text-slate-500'}`} />
        <span className="hidden sm:inline">{isMockMode ? 'Mock Mode (0 Tokens)' : 'Live Gemini API'}</span>
      </button>
    </nav>
  );
}
