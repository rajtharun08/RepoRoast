import React, { useState } from 'react';
import { X, FileText, FolderTree, Code2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeContextModal({ isOpen, onClose, contextData }) {
  if (!isOpen || !contextData) return null;

  const files = contextData.file_contents || {};
  const [selectedFile, setSelectedFile] = useState(Object.keys(files)[0] || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <FolderTree className="w-5 h-5 text-zinc-300" />
            <h2 className="font-bold text-white text-sm font-mono">
              Context Window Scoping (Level {contextData.level})
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          {/* File Explorer Sidebar */}
          <div className="p-4 overflow-y-auto bg-zinc-950/80">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 font-mono">
              Included Files ({Object.keys(files).length})
            </h3>
            <div className="space-y-1">
              {Object.keys(files).map((filename) => (
                <button
                  key={filename}
                  onClick={() => setSelectedFile(filename)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                    selectedFile === filename
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="truncate">{filename}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="md:col-span-2 p-4 overflow-y-auto bg-zinc-950 flex flex-col">
            {selectedFile ? (
              <>
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-2">
                  <Code2 className="w-4 h-4 text-zinc-300" />
                  <span>{selectedFile}</span>
                </div>
                <div className="flex-1 overflow-auto rounded-xl border border-zinc-800 text-xs font-mono">
                  <SyntaxHighlighter
                    language={selectedFile.endsWith('.json') ? 'json' : selectedFile.endsWith('.py') ? 'python' : 'markdown'}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1rem', background: '#09090b' }}
                  >
                    {files[selectedFile] || '// Empty file content'}
                  </SyntaxHighlighter>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 text-xs font-mono">
                Select a file from the sidebar to inspect context.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-950 flex justify-between items-center text-xs text-zinc-400 font-mono">
          <span>Total Filtered Files: {contextData.file_count || 0}</span>
          <button
            onClick={onClose}
            className="bg-zinc-100 hover:bg-white text-zinc-900 font-extrabold px-5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Close Context
          </button>
        </div>
      </div>
    </div>
  );
}
