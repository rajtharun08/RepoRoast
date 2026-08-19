import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ChatArena from '../components/ChatArena';
import CodeContextModal from '../components/CodeContextModal';
import ScorecardModal from '../components/ScorecardModal';
import { subscribeToInterviewSSE, submitAnswer, fetchScorecard, triggerHintAPI, triggerPanicAPI } from '../services/api';

export default function Interview({ sessionData, contextData, onRestart }) {
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [questionCount, setQuestionCount] = useState(sessionData.question_count || 1);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);

  const cleanupStreamRef = useRef(null);
  const isInitialMountedRef = useRef(false);

  // Subscribe to SSE stream when starting or sending answer
  const startStream = (answerText = null, mode = 'normal') => {
    if (cleanupStreamRef.current) {
      cleanupStreamRef.current();
    }

    setIsStreaming(true);
    setStreamingText('');

    cleanupStreamRef.current = subscribeToInterviewSSE(
      sessionData.session_id,
      answerText,
      (data) => {
        if (data.text) {
          setStreamingText((prev) => prev + data.text);
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
        setIsStreaming(false);
        setStreamingText((finalText) => {
          if (finalText.trim()) {
            setMessages((prev) => [
              ...prev,
              { role: 'interviewer', content: finalText.trim(), question: questionCount }
            ]);
          }
          return '';
        });
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

  return (
    <div className="h-screen flex flex-col bg-[#09090b] overflow-hidden">
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

      <ChatArena
        messages={messages}
        streamingText={streamingText}
        isStreaming={isStreaming}
        onSendAnswer={handleSendAnswer}
      />

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
