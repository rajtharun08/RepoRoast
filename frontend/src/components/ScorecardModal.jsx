import React from 'react';
import { Award, CheckCircle2, TrendingUp, RotateCcw, Sparkles } from 'lucide-react';

export default function ScorecardModal({ isOpen, scorecard, onRestart }) {
  if (!isOpen || !scorecard) return null;

  const breakdown = scorecard.breakdown || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#131b2e] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 px-8 py-6 text-white text-center relative">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-2">
            <Award className="w-9 h-9 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Technical Interview Scorecard</h2>
          <p className="text-xs text-indigo-100 mt-1 font-mono">
            Evaluated by <span className="font-bold underline">{scorecard.persona}</span> (Level {scorecard.level})
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overall Rating Box */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Overall Evaluation Score</span>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400 my-1 font-mono">
              {scorecard.overall_rating} <span className="text-lg text-slate-500 font-normal">/ 100</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Completed 5-Question Technical Escalation Pipeline
            </p>
          </div>

          {/* Skill Breakdown Progress Bars */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Skill Matrix Breakdown</h3>
            
            {Object.entries({
              'Technical Depth': breakdown.technical_depth,
              'System Architecture': breakdown.system_architecture,
              'Communication Clarity': breakdown.communication_clarity,
              'Problem Solving': breakdown.problem_solving,
              'Code Quality': breakdown.code_quality
            }).map(([label, score]) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{label}</span>
                  <span className="text-indigo-400 font-mono font-bold">{score || 0}%</span>
                </div>
                <div className="w-full bg-[#0b0f19] rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${score || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Key Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-200/90 list-disc list-inside">
                {(scorecard.strengths || []).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2 font-mono">
                <TrendingUp className="w-4 h-4" />
                <span>Growth Opportunities</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-200/90 list-disc list-inside">
                {(scorecard.areas_for_growth || []).map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#0b0f19] border-t border-slate-800 flex justify-between items-center">
          <div className="text-xs text-slate-400 font-mono">
            Hints: <span className="text-amber-400 font-bold">{scorecard.hint_count || 0}</span> • Panics: <span className="text-rose-400 font-bold">{scorecard.panic_count || 0}</span>
          </div>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
