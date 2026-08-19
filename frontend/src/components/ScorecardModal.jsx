import React from 'react';
import { Award, CheckCircle, TrendingUp, AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';

export default function ScorecardModal({ isOpen, scorecard, onRestart }) {
  if (!isOpen || !scorecard) return null;

  const breakdown = scorecard.breakdown || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-roast-card border border-roast-border rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6 text-white text-center relative">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-2">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Interview Scorecard</h2>
          <p className="text-xs text-orange-100 mt-1">
            Evaluated by <span className="font-bold underline">{scorecard.persona}</span> (Level {scorecard.level})
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overall Rating Box */}
          <div className="bg-roast-dark border border-roast-border rounded-2xl p-5 text-center flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Overall Score</span>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 my-1">
              {scorecard.overall_rating} <span className="text-lg text-slate-500 font-normal">/ 100</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Completed 5 Technical Escalation Questions
            </p>
          </div>

          {/* Breakdown Progress Bars */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Breakdown</h3>
            
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
                  <span className="text-orange-400 font-mono font-bold">{score || 0}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${score || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Growth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <CheckCircle className="w-4 h-4" />
                <span>Key Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-200/90 list-disc list-inside">
                {(scorecard.strengths || []).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Areas for Growth</span>
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
        <div className="p-6 bg-slate-900/60 border-t border-roast-border flex justify-between items-center">
          <div className="text-xs text-slate-400 font-mono">
            Hints Used: <span className="text-amber-400 font-bold">{scorecard.hint_count || 0}</span> • Panics: <span className="text-red-400 font-bold">{scorecard.panic_count || 0}</span>
          </div>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
