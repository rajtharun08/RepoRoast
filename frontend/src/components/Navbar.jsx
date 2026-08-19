import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview' },
    { path: '/setup', label: 'Setup Studio' },
  ];

  return (
    <nav className="bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/60 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
        <div className="bg-zinc-800 group-hover:bg-zinc-700 text-zinc-100 p-1.5 rounded-lg border border-zinc-700 transition-colors">
          <Terminal className="w-4 h-4 text-zinc-200" />
        </div>
        <span className="font-bold text-base tracking-tight text-zinc-100 group-hover:text-white transition-colors">
          RepoRoast
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/80">
        {navItems.map(({ path, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
