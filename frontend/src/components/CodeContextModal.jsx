import React, { useState } from 'react';
import { X, FileText, FolderTree, Code2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeContextModal({ isOpen, onClose, contextData }) {
  if (!isOpen || !contextData) return null;

  const files = contextData.file_contents || {};
  const [selectedFile, setSelectedFile] = useState(Object.keys(files)[0] || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111726] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080c14]">
          <div className="flex items-center gap-2.5">
            <FolderTree className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-white text-sm font-mono">
              Context Window Scoping (Level {contextData.level})
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* File Explorer Sidebar */}
          <div className="p-4 overflow-y-auto bg-[#080c14]/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-mono">
              Included Files ({Object.keys(files).length})
            </h3>
            <div className="space-y-1">
              {Object.keys(files).map((filename) => (
                <button
                  key={filename}
                  onClick={() => setSelectedFile(filename)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                    selectedFile === filename
                      ? 'bg-orange-500/10 text-orange-300 border border-orange-500/40 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">{filename}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="md:col-span-2 p-4 overflow-y-auto bg-[#080c14] flex flex-col">
            {selectedFile ? (
              <>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
                  <Code2 className="w-4 h-4 text-orange-400" />
                  <span>{selectedFile}</span>
                </div>
                <div className="flex-1 overflow-auto rounded-2xl border border-slate-800 text-xs font-mono">
                  <SyntaxHighlighter
                    language={selectedFile.endsWith('.json') ? 'json' : selectedFile.endsWith('.py') ? 'python' : 'markdown'}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1rem', background: '#080c14' }}
                  >
                    {files[selectedFile] || '// Empty file content'}
                  </SyntaxHighlighter>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                Select a file from the sidebar to inspect context.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080c14] flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Total Filtered Files: {contextData.file_count || 0}</span>
          <button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            Close Context
          </button>
        </div>
      </div>
    </div>
  );
}
