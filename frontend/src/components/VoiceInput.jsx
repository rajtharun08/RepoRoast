import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function VoiceInput({ onTranscript, disabled }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return (
      <button
        disabled
        title="Web Speech API not supported in this browser"
        className="p-2.5 rounded-lg bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed text-xs flex items-center gap-1.5"
      >
        <MicOff className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
        isListening
          ? 'bg-red-500 text-white border-red-400 ring-2 ring-red-500/50 animate-pulse'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
      } disabled:opacity-50`}
      title={isListening ? 'Stop Voice Recording' : 'Start Voice Recording'}
    >
      {isListening ? (
        <>
          <Volume2 className="w-4 h-4 text-white animate-bounce" />
          <span>Recording...</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-orange-400" />
          <span>Voice</span>
        </>
      )}
    </button>
  );
}
