import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { ThemeMode } from '../types/redact';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const shortcuts = [
    { key: 'Click & Drag', description: 'Draw new black redaction box on PDF page' },
    { key: 'Delete / Backspace', description: 'Remove active / selected redaction box' },
    { key: 'Cmd / Ctrl + Z', description: 'Undo last redaction box change' },
    { key: 'Cmd / Ctrl + Y', description: 'Redo last undone change' },
    { key: 'Cmd / Ctrl + S', description: 'Download flattened redacted PDF' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl transition-colors ${
          isDark ? 'bg-[#121215] border-zinc-800 text-zinc-100' : 'bg-[#f5f0e6] border-[#d8cfbe] text-stone-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/50 mb-4">
          <div className="flex items-center gap-2 font-mono font-bold text-lg">
            <Keyboard className="w-5 h-5 text-[#FF5500]" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-[#e4ddd0] text-stone-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className={`font-semibold px-2 py-1 rounded border ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-[#FF5500]' : 'bg-[#e4ddd0] border-[#c8bca8] text-amber-800'
              }`}>
                {sc.key}
              </span>
              <span className={`text-right ${isDark ? 'text-zinc-400' : 'text-stone-700'}`}>
                {sc.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
