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
  Terminal
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
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-zinc-400 text-xs font-mono">Generating Technical Evaluation Report...</p>
        </div>
      </div>
    );
  }

  if (error || !scorecard) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 font-sans">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <Award className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Report Not Found</h2>
          <p className="text-xs text-zinc-400">{error || 'Session ID is invalid or incomplete.'}</p>
          <Link
            to="/setup"
            className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start New Interview</span>
          </Link>
        </div>
      </div>
    );
  }

  const breakdown = scorecard.breakdown || {};
  const overall = scorecard.overall_rating || 85;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 md:p-8 font-sans selection:bg-zinc-800 selection:text-white print:bg-white print:text-black">
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        
        {/* Top Action Bar */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
          <div>
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Engineering Evaluation Report
            </span>
            <h1 className="text-lg font-bold text-white">
              {scorecard.persona} • Level {scorecard.level}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copySharableLink}
              className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-zinc-900" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs px-4 py-2.5 rounded-xl border border-zinc-800 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Main Scorecard Card */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl print:border-none print:shadow-none">
          
          {/* Header */}
          <div className="border-b border-zinc-800 pb-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center mx-auto border border-zinc-700">
              <Terminal className="w-5 h-5 text-zinc-300" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Technical Evaluation Summary</h2>
            <p className="text-xs text-zinc-400 font-mono">
              Repository: <span className="font-bold text-zinc-200">{scorecard.repo_url}</span>
            </p>
          </div>

          {/* Rating Score */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-6 text-center">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">Overall Rating Score</span>
            <div className="text-5xl font-extrabold text-white my-2 font-mono">
              {overall} <span className="text-lg text-zinc-500 font-normal">/ 100</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              5 Technical Questions Evaluated
            </p>
          </div>

          {/* Competency Matrix Bars */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Competency Matrix</h3>
            
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
          </div>

          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300 list-disc list-inside leading-relaxed">
                {(scorecard.strengths || []).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Growth Opportunities</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300 list-disc list-inside leading-relaxed">
                {(scorecard.areas_for_growth || []).map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 shadow-sm print:hidden">
          <span className="text-xs text-zinc-400 font-mono">Ready for another repository roast?</span>
          <Link
            to="/setup"
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start New Interview</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
