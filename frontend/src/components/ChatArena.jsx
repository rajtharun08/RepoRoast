import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import VoiceInput from './VoiceInput';

export default function ChatArena({ 
  messages, 
  streamingText, 
  isStreaming, 
  onSendAnswer 
}) {
  const [inputAnswer, setInputAnswer] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);
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

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f19] overflow-hidden relative">
      
      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'candidate' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar Icon */}
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              msg.role === 'candidate' 
                ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white' 
                : 'bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 text-white'
            }`}>
              {msg.role === 'candidate' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Message Bubble Card */}
            <div className={`rounded-2xl p-4 text-sm leading-relaxed border relative group ${
              msg.role === 'candidate'
                ? 'bg-cyan-950/20 text-cyan-100 border-cyan-500/30 rounded-tr-none'
                : 'bg-[#131b2e] text-slate-100 border-slate-800 rounded-tl-none shadow-lg'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-slate-800/80">
                <div className="font-bold text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                  <span>{msg.role === 'candidate' ? 'Candidate' : 'Interviewer'}</span>
                  {msg.question && <span className="text-indigo-400 font-bold">[Question {msg.question}]</span>}
                </div>
                
                <button
                  onClick={() => copyToClipboard(msg.content, idx)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-200 transition-opacity p-1 rounded-md hover:bg-slate-800 cursor-pointer"
                  title="Copy text"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="whitespace-pre-wrap font-sans leading-relaxed">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Live Streaming Token Buffer Bubble */}
        {isStreaming && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 text-white flex items-center justify-center shrink-0 animate-pulse shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div className="rounded-2xl p-4 text-sm leading-relaxed bg-[#131b2e] text-slate-100 border border-slate-800 rounded-tl-none shadow-lg min-w-[240px]">
              <div className="font-semibold text-xs text-indigo-400 mb-2 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Interviewer is responding...</span>
              </div>
              <div className="whitespace-pre-wrap font-sans leading-relaxed">
                {streamingText}
                <span className="inline-block w-2 h-4 bg-indigo-400 ml-1 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            disabled={isStreaming}
            placeholder={isStreaming ? 'Interviewer is speaking...' : 'Type your answer or use voice recording...'}
            className="flex-1 bg-[#0b0f19] text-slate-100 placeholder-slate-500 text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all font-mono"
          />

          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isStreaming} />

          <button
            type="submit"
            disabled={!inputAnswer.trim() || isStreaming}
            className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-5 py-3 rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
}
