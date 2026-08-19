import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import VoiceInput from './VoiceInput';

export default function ChatArena({ 
  messages, 
  streamingText, 
  isStreaming, 
  onSendAnswer 
}) {
  const [inputAnswer, setInputAnswer] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputAnswer.trim() || isStreaming) return;
    onSendAnswer(inputAnswer.trim());
    setInputAnswer('');
  };

  const handleVoiceTranscript = (transcript) => {
    setInputAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-roast-dark overflow-hidden relative">
      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-4xl ${
              msg.role === 'candidate' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar Icon */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              msg.role === 'candidate' 
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white' 
                : 'bg-gradient-to-tr from-orange-500 to-red-600 text-white'
            }`}>
              {msg.role === 'candidate' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'candidate'
                ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-tr-none'
                : 'bg-roast-card text-slate-100 border border-roast-border rounded-tl-none shadow-md'
            }`}>
              <div className="font-semibold text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <span>{msg.role === 'candidate' ? 'Candidate' : 'Interviewer'}</span>
                {msg.question && <span className="text-orange-400">[Q{msg.question}]</span>}
              </div>
              <div className="whitespace-pre-wrap font-sans">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Live Streaming Token Buffer Bubble */}
        {isStreaming && (
          <div className="flex gap-3 max-w-4xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl p-4 text-sm leading-relaxed bg-roast-card text-slate-100 border border-roast-border rounded-tl-none shadow-md min-w-[200px]">
              <div className="font-semibold text-xs text-orange-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Interviewer Streaming...</span>
              </div>
              <div className="whitespace-pre-wrap font-sans">
                {streamingText}
                <span className="inline-block w-2 h-4 bg-orange-400 ml-1 animate-ping" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-roast-card border-t border-roast-border">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            disabled={isStreaming}
            placeholder={isStreaming ? 'Interviewer is speaking...' : 'Type your answer or use voice input...'}
            className="flex-1 bg-roast-dark text-slate-100 placeholder-slate-500 text-sm px-4 py-3 rounded-xl border border-roast-border focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50 transition-all"
          />

          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isStreaming} />

          <button
            type="submit"
            disabled={!inputAnswer.trim() || isStreaming}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
}
