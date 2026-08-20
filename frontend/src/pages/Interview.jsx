import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ChatArena from '../components/ChatArena';
import CodeContextModal from '../components/CodeContextModal';
import ScorecardModal from '../components/ScorecardModal';
import { subscribeToInterviewSSE, submitAnswer, fetchScorecard, triggerHintAPI, triggerPanicAPI } from '../services/api';
import { FileText, FolderGit2, ShieldCheck, HelpCircle, AlertOctagon, Code, ChevronRight } from 'lucide-react';

export default function Interview({ sessionData, contextData, onRestart }) {
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [questionCount, setQuestionCount] = useState(sessionData.question_count || 1);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const cleanupStreamRef = useRef(null);
  const isInitialMountedRef = useRef(false);
  const accumulatedTextRef = useRef('');

  const startStream = (answerText = null, mode = 'normal') => {
    if (cleanupStreamRef.current) {
      cleanupStreamRef.current();
    }

    setIsStreaming(true);
    setStreamingText('');
    accumulatedTextRef.current = '';

    cleanupStreamRef.current = subscribeToInterviewSSE(
      sessionData.session_id,
      answerText,
      (data) => {
        if (data.text) {
          accumulatedTextRef.current += data.text;
          setStreamingText(accumulatedTextRef.current);
        }
        if (data.question_count) {
          setQuestionCount(data.question_count);
        }
        if (data.status === 'completed') {
          handleInterviewComplete();
        }
      },
      (err) => {
        console.error('SSE Stream Error', err);
        setIsStreaming(false);
      },
      () => {
        const finalContent = accumulatedTextRef.current.trim();
        setIsStreaming(false);
        setStreamingText('');
        if (finalContent) {
          setMessages((prev) => [
            ...prev,
            { role: 'interviewer', content: finalContent, question: questionCount }
          ]);
        }
      },
      mode
    );
  };

  useEffect(() => {
    if (!isInitialMountedRef.current) {
      isInitialMountedRef.current = true;
      startStream();
    }
    return () => {
      if (cleanupStreamRef.current) {
        cleanupStreamRef.current();
      }
    };
  }, []);

  const handleSendAnswer = async (answer) => {
    setMessages((prev) => [
      ...prev,
      { role: 'candidate', content: answer, question: questionCount }
    ]);
    await submitAnswer(sessionData.session_id, answer);
    startStream(answer, 'normal');
  };

  const handleTriggerHint = async () => {
    setMessages((prev) => [
      ...prev,
      { role: 'candidate', content: '[Requested Hint]', question: questionCount }
    ]);
    await triggerHintAPI(sessionData.session_id);
    startStream(null, 'hint');
  };

  const handleTriggerPanic = async () => {
    setMessages((prev) => [
      ...prev,
      { role: 'candidate', content: '[Triggered Panic Button - Reveal Answer]', question: questionCount }
    ]);
    await triggerPanicAPI(sessionData.session_id);
    startStream(null, 'panic');
  };

  const handleInterviewComplete = async () => {
    try {
      const scorecardData = await fetchScorecard(sessionData.session_id);
      setScorecard(scorecardData);
      setIsScorecardOpen(true);
    } catch (e) {
      console.error('Failed to load scorecard', e);
    }
  };

  const fileTree = contextData?.file_tree || ['README.md', 'package.json', 'src/main.py', 'src/routes/auth.py'];
  const fileContents = contextData?.file_contents || {};
  const repoSlug = (sessionData.repo_url || 'fastapi/fastapi').replace('https://github.com/', '');

  return (
    <div className="h-screen flex flex-col bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      
      {/* Top Navigation Header Bar */}
      <Header
        questionCount={questionCount}
        level={sessionData.level}
        persona={sessionData.persona}
        repoName={sessionData.repo_url}
        onInspectContext={() => setIsContextOpen(true)}
        onTriggerHint={handleTriggerHint}
        onTriggerPanic={handleTriggerPanic}
        onRestart={onRestart}
        isStreaming={isStreaming}
      />

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDEBAR: Code File Explorer & Trainer Info */}
        <aside className="w-full md:w-80 lg:w-96 bg-zinc-900/90 border-b md:border-b-0 md:border-r border-zinc-800/80 p-5 flex flex-col justify-between shrink-0 space-y-5 overflow-y-auto">
          
          <div className="space-y-5">
            {/* Trainer Profile Card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-zinc-300" />
                <span>Active Interviewer</span>
              </div>
              <div className="font-bold text-base text-white">
                {sessionData.persona}
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                Level {sessionData.level} • {sessionData.level <= 3 ? 'Screening' : sessionData.level <= 7 ? 'System Design' : 'Deep Code Review'}
              </div>
            </div>

            {/* Ingested Code Tree Explorer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <FolderGit2 className="w-3.5 h-3.5 text-zinc-300" />
                  Ingested Repository Files
                </span>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md">
                  {fileTree.length} files
                </span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 max-h-52 overflow-y-auto space-y-1 font-mono text-xs">
                {fileTree.map((path) => (
                  <button
                    key={path}
                    onClick={() => setSelectedFile(selectedFile === path ? null : path)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      selectedFile === path 
                        ? 'bg-zinc-800 text-white font-bold' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <span className="truncate flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      {path}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Selected File Snippet Drawer */}
              {selectedFile && fileContents[selectedFile] && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-300 border-b border-zinc-800/80 pb-2">
                    <span>{selectedFile}</span>
                    <button onClick={() => setSelectedFile(null)} className="text-zinc-500 hover:text-zinc-300">✕</button>
                  </div>
                  <pre className="text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-36 p-2 bg-zinc-900 rounded-lg leading-relaxed whitespace-pre-wrap">
                    {fileContents[selectedFile]}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-2">
            <button
              onClick={handleTriggerHint}
              disabled={isStreaming}
              className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Request Hint</span>
            </button>

            <button
              onClick={handleTriggerPanic}
              disabled={isStreaming}
              className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Reveal Answer Solution</span>
            </button>
          </div>

        </aside>

        {/* RIGHT MAIN ARENA: Q&A Chat Stream */}
        <main className="flex-1 flex flex-col h-full bg-[#09090b]">
          <ChatArena
            messages={messages}
            streamingText={streamingText}
            isStreaming={isStreaming}
            onSendAnswer={handleSendAnswer}
          />
        </main>

      </div>

      <CodeContextModal
        isOpen={isContextOpen}
        onClose={() => setIsContextOpen(false)}
        contextData={contextData}
      />

      <ScorecardModal
        isOpen={isScorecardOpen}
        scorecard={scorecard}
        onRestart={onRestart}
      />
    </div>
  );
}
