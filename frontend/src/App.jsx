import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Interview from './pages/Interview';
import ScorecardPage from './pages/ScorecardPage';
import { ingestRepo, startInterviewSession, USE_MOCK_DATA, setMockMode } from './services/api';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionData, setSessionData] = useState(null);
  const [contextData, setContextData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMockMode, setIsMockModeState] = useState(USE_MOCK_DATA);

  const toggleMockMode = () => {
    const nextVal = !isMockMode;
    setIsMockModeState(nextVal);
    setMockMode(nextVal);
  };

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
      console.error(err);
      setError(err.message || 'Failed to start interview session');
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
    <div className="min-h-screen bg-[#0b0f19] font-sans text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Show Navbar on non-interview pages */}
      {!isInterviewRoute && (
        <Navbar isMockMode={isMockMode} onToggleMockMode={toggleMockMode} />
      )}

      {error && (
        <div className="bg-rose-500/20 border-b border-rose-500/50 text-rose-200 text-xs p-3 text-center sticky top-0 z-50 font-mono">
          ⚠️ {error}
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
