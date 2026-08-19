import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, TrendingUp, RotateCcw, FileText } from 'lucide-react';

export default function ScorecardModal({ isOpen, scorecard, onRestart }) {
  const navigate = useNavigate();
  if (!isOpen || !scorecard) return null;

  const breakdown = scorecard.breakdown || {};

  const handleViewFullReport = () => {
    navigate(`/scorecard/${scorecard.session_id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-zinc-950 px-6 py-5 text-white border-b border-zinc-800 text-center relative">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800 flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-zinc-300" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Technical Interview Scorecard</h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Evaluated by <span className="font-bold text-zinc-200">{scorecard.persona}</span> (Level {scorecard.level})
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Overall Rating Box */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 text-center flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">Overall Score</span>
            <div className="text-4xl font-extrabold text-white my-1 font-mono">
              {scorecard.overall_rating} <span className="text-sm text-zinc-500 font-normal">/ 100</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              Completed 5 Technical Questions
            </p>
          </div>

          {/* Skill Breakdown Progress Bars */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Skill Matrix Breakdown</h3>
            
            {Object.entries({
              'Technical Depth': breakdown.technical_depth,
              'System Architecture': breakdown.system_architecture,
              'Communication Clarity': breakdown.communication_clarity,
              'Problem Solving': breakdown.problem_solving,
              'Code Quality': breakdown.code_quality
            }).map(([label, score]) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-300">{label}</span>
                  <span className="text-zinc-300 font-mono font-bold">{score || 0}%</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div 
                    className="bg-zinc-200 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${score || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Strengths</span>
              </div>
              <ul className="space-y-1 text-xs text-zinc-300 list-disc list-inside">
                {(scorecard.strengths || []).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Growth Opportunities</span>
              </div>
              <ul className="space-y-1 text-xs text-zinc-300 list-disc list-inside">
                {(scorecard.areas_for_growth || []).map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleViewFullReport}
            className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-zinc-700 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-300" />
            <span>Full Report Page</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-zinc-900 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-900" />
            <span>Start New Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
