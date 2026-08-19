import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  RotateCcw, 
  Copy, 
  Check, 
  Printer, 
  Sparkles,
  GitBranch
} from 'lucide-react';
import { fetchScorecard } from '../services/api';

export default function ScorecardPage() {
  const { sessionId } = useParams();
  const [scorecard, setScorecard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function loadScorecard() {
      setIsLoading(true);
      try {
        const data = await fetchScorecard(sessionId || 'default-session');
        setScorecard(data);
      } catch (err) {
        console.error(err);
        setError('Could not load interview evaluation for this session.');
      } finally {
        setIsLoading(false);
      }
    }
    loadScorecard();
  }, [sessionId]);

  const copySharableLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-slate-400 text-sm font-mono">Generating Technical Evaluation Report...</p>
        </div>
      </div>
    );
  }

  if (error || !scorecard) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="bg-[#131b2e] border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4">
          <Award className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Report Not Found</h2>
          <p className="text-xs text-slate-400">{error || 'Session ID is invalid or incomplete.'}</p>
          <Link
            to="/setup"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Interview</span>
          </Link>
        </div>
      </div>
    );
  }

  const breakdown = scorecard.breakdown || {};
  const overall = scorecard.overall_rating || 85;
  const grade = overall >= 90 ? 'S-Tier' : overall >= 80 ? 'A-Tier' : overall >= 70 ? 'B-Tier' : 'C-Tier';
  const gradeColor = overall >= 90 ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' : 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 p-4 md:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 print:bg-white print:text-black">
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        
        {/* Top Header Bar */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
              Engineering Evaluation Report
            </span>
            <h1 className="text-xl font-black text-white">
              {scorecard.persona} • Level {scorecard.level}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copySharableLink}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Main Scorecard Card */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-6 print:border-none print:shadow-none">
          
          {/* Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 p-8 text-white text-center relative">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-3">
              <Award className="w-10 h-10 text-amber-300" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Technical Evaluation Summary</h2>
            <p className="text-xs text-indigo-100 mt-1 font-mono">
              Repository: <span className="font-bold underline">{scorecard.repo_url}</span>
            </p>
          </div>

          {/* Rating Score & Grade Badge */}
          <div className="px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Overall Rating Score</span>
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400 my-2 font-mono">
                {overall} <span className="text-xl text-slate-500 font-normal">/ 100</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                5 Technical Escalation Questions Evaluated
              </p>
            </div>

            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Performance Rating</span>
              <div className={`px-5 py-2 rounded-2xl border text-xl font-black font-mono ${gradeColor}`}>
                {grade}
              </div>
            </div>
          </div>

          {/* Competency Matrix Bars */}
          <div className="px-8 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Competency Matrix</h3>
            
            <div className="space-y-3">
              {Object.entries({
                'Technical Depth': breakdown.technical_depth,
                'System Architecture': breakdown.system_architecture,
                'Communication Clarity': breakdown.communication_clarity,
                'Problem Solving': breakdown.problem_solving,
                'Code Quality': breakdown.code_quality
              }).map(([label, score]) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-indigo-400 font-mono font-bold">{score || 0}%</span>
                  </div>
                  <div className="w-full bg-[#0b0f19] rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${score || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Growth Opportunities */}
          <div className="px-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-200/90 list-disc list-inside leading-relaxed">
                {(scorecard.strengths || []).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                <TrendingUp className="w-4 h-4" />
                <span>Growth Opportunities</span>
              </div>
              <ul className="space-y-2 text-xs text-amber-200/90 list-disc list-inside leading-relaxed">
                {(scorecard.areas_for_growth || []).map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Start New Interview CTA */}
        <div className="flex items-center justify-between bg-[#131b2e] border border-slate-800 rounded-3xl p-6 shadow-xl print:hidden">
          <span className="text-xs text-slate-400 font-mono">Ready for another repository roast?</span>
          <Link
            to="/setup"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Interview</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
