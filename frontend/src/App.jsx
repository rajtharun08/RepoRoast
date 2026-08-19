import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Interview from './pages/Interview';
import ScorecardPage from './pages/ScorecardPage';
import { ingestRepo, startInterviewSession } from './services/api';
import { AlertCircle, X } from 'lucide-react';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionData, setSessionData] = useState(null);
  const [contextData, setContextData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartInterview = async ({ repoUrl, level, persona, customPersona }) => {
    setIsLoading(true);
    setError(null);
    try {
      // Step 1: Ingest repo context
      const context = await ingestRepo(repoUrl, level);
      setContextData(context);

      // Step 2: Initialize interview session
      const session = await startInterviewSession(repoUrl, persona, customPersona, level);
      setSessionData(session);

      // Step 3: Navigate to active interview route
      navigate('/interview');
    } catch (err) {
      console.error('Interview Start Error:', err);
      setError(err.message || 'Failed to connect to backend server or fetch GitHub repository.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setSessionData(null);
    setContextData(null);
    setError(null);
    navigate('/setup');
  };

  const isInterviewRoute = location.pathname.startsWith('/interview');

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white">
      {/* Show Navbar on non-interview pages */}
      {!isInterviewRoute && <Navbar />}

      {/* Global Error Banner */}
      {error && (
        <div className="bg-rose-500/10 border-b border-rose-500/30 text-rose-300 text-xs md:text-sm px-6 py-3 flex items-center justify-between sticky top-0 z-50 font-mono shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 text-rose-400 hover:text-white rounded-md transition-colors cursor-pointer"
            title="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/setup"
            element={
              <Home onStartInterview={handleStartInterview} isLoading={isLoading} />
            }
          />
          <Route
            path="/interview"
            element={
              sessionData ? (
                <Interview
                  sessionData={sessionData}
                  contextData={contextData}
                  onRestart={handleRestart}
                />
              ) : (
                <Home onStartInterview={handleStartInterview} isLoading={isLoading} />
              )
            }
          />
          <Route path="/scorecard/:sessionId" element={<ScorecardPage />} />
          <Route path="/scorecard" element={<ScorecardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
