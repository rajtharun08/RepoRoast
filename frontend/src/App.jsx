import React, { useState } from 'react';
import Home from './pages/Home';
import Interview from './pages/Interview';
import { ingestRepo, startInterviewSession } from './services/api';

export default function App() {
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
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to start interview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setSessionData(null);
    setContextData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-roast-dark font-sans">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs p-3 text-center sticky top-0 z-50">
          ⚠️ {error}
        </div>
      )}

      {!sessionData ? (
        <Home onStartInterview={handleStartInterview} isLoading={isLoading} />
      ) : (
        <Interview
          sessionData={sessionData}
          contextData={contextData}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
