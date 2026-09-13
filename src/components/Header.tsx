import React from 'react';
import { ShieldCheck, RotateCcw, Keyboard, Sun, Moon, FileText, Coffee } from 'lucide-react';
import { ThemeMode } from '../types/redact';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenShortcuts: () => void;
  onReset: () => void;
  hasFile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenShortcuts,
  onReset,
  hasFile = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`border-b px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 transition-colors ${
        isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-[#d8cfbe] bg-[#eee8dd]'
      }`}
    >
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#FF5500] text-white flex items-center justify-center font-black shadow-lg shadow-[#FF5500]/20">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`font-bold text-lg tracking-tight font-mono ${isDark ? 'text-white' : 'text-stone-900'}`}>
              PDFRedact
            </h1>
            <span
              className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border ${
                isDark
                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  : 'bg-[#ded6c7] text-stone-800 border-[#c7bcaa]'
              }`}
            >
              v1.0
            </span>
          </div>
          <p className={`text-xs font-sans hidden sm:block ${isDark ? 'text-zinc-400' : 'text-stone-700'}`}>
            Zero-server PDF redactor & anonymizer
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Security Shield Badge */}
        <div
          className={`hidden lg:flex items-center gap-1.5 border text-xs px-2.5 py-1 rounded-md font-mono ${
            isDark
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
              : 'bg-emerald-100/70 text-emerald-800 border-emerald-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Local processing — 0 Server Uploads</span>
        </div>

        {/* Buy Me a Coffee Button */}
        <a
          href="https://buymeacoffee.com/vijaik2k7"
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 border rounded-md transition-colors ${
            isDark
              ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-amber-400 hover:text-amber-300'
              : 'bg-[#f4efe6] hover:bg-[#e4ddd0] border-[#d8cfbe] text-amber-700 hover:text-amber-800 shadow-sm'
          }`}
          title="Buy me a coffee"
        >
          <Coffee className="w-4 h-4 text-amber-500" />
        </a>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className={`p-2 border rounded-md transition-colors ${
            isDark
              ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-amber-400'
              : 'bg-[#f4efe6] hover:bg-[#e4ddd0] border-[#d8cfbe] text-amber-600 shadow-sm'
          }`}
          title={isDark ? 'Switch to Beige Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-stone-800" />}
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={onOpenShortcuts}
          className={`p-2 border rounded-md transition-colors ${
            isDark
              ? 'text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border-zinc-800'
              : 'text-stone-700 hover:text-stone-900 bg-[#f4efe6] hover:bg-[#e4ddd0] border-[#d8cfbe] shadow-sm'
          }`}
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Reset / Start Over Button */}
        {hasFile && (
          <button
            onClick={onReset}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md border transition-colors ${
              isDark
                ? 'text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border-zinc-800'
                : 'text-stone-800 hover:text-stone-900 bg-[#f4efe6] hover:bg-[#e4ddd0] border-[#d8cfbe] shadow-sm'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        )}
      </div>
    </header>
  );
};
