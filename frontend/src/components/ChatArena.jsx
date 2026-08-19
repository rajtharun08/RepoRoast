import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, Check } from 'lucide-react';
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
    <div className="flex-1 flex flex-col h-full bg-[#09090b] overflow-hidden relative font-sans">
      
      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-4 max-w-4xl ${
              msg.role === 'candidate' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
              msg.role === 'candidate' 
                ? 'bg-zinc-100 text-zinc-900 border-white' 
                : 'bg-zinc-900 text-zinc-300 border-zinc-800'
            }`}>
              {msg.role === 'candidate' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Message Bubble Card */}
            <div className={`rounded-2xl p-5 text-sm md:text-base leading-relaxed border relative group shadow-md ${
              msg.role === 'candidate'
                ? 'bg-zinc-900 text-zinc-100 border-zinc-800 rounded-tr-none'
                : 'bg-zinc-900/90 text-zinc-200 border-zinc-800/80 rounded-tl-none'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-zinc-800/80">
                <div className="font-bold text-xs md:text-sm text-zinc-400 flex items-center gap-2 font-mono">
                  <span>{msg.role === 'candidate' ? 'Candidate Response' : 'Interviewer'}</span>
                  {msg.question && <span className="text-zinc-300 font-bold">[Question {msg.question}]</span>}
                </div>
                
                <button
                  onClick={() => copyToClipboard(msg.content, idx)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-200 transition-opacity p-1 rounded-md hover:bg-zinc-800 cursor-pointer"
                  title="Copy text"
                >
                  {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="whitespace-pre-wrap font-sans leading-relaxed text-zinc-100">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming Buffer */}
        {isStreaming && (
          <div className="flex gap-4 max-w-4xl mr-auto">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="rounded-2xl p-5 text-sm md:text-base leading-relaxed bg-zinc-900/90 text-zinc-200 border border-zinc-800/80 rounded-tl-none shadow-md min-w-[280px]">
              <div className="font-semibold text-xs md:text-sm text-zinc-400 mb-2 font-mono">
                Interviewer is analyzing code & streaming response...
              </div>
              <div className="whitespace-pre-wrap font-sans leading-relaxed text-zinc-100">
                {streamingText}
                <span className="inline-block w-2.5 h-4.5 bg-zinc-400 ml-1 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 md:p-6 bg-zinc-900/95 border-t border-zinc-800/80">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-5xl mx-auto">
          <input
            type="text"
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            disabled={isStreaming}
            placeholder={isStreaming ? 'Interviewer is speaking...' : 'Type your technical response or use speech recognition...'}
            className="flex-1 bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-sm md:text-base px-5 py-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-700 disabled:opacity-50 transition-all font-mono"
          />

          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isStreaming} />

          <button
            type="submit"
            disabled={!inputAnswer.trim() || isStreaming}
            className="bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-3.5 rounded-xl font-extrabold text-sm md:text-base flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin text-zinc-900" /> : <Send className="w-4 h-4 text-zinc-900" />}
            <span className="hidden sm:inline">Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
}
