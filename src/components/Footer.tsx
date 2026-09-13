import React from 'react';
import { Coffee, ShieldCheck } from 'lucide-react';
import { ThemeMode } from '../types/redact';

interface FooterProps {
  theme: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <footer
      className={`border-t px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-colors ${
        isDark ? 'border-zinc-800 bg-[#0c0c0e] text-zinc-500' : 'border-[#d8cfbe] bg-[#eee8dd] text-stone-600'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>PDFRedact processes files 100% locally in browser memory. 0 server uploads.</span>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="https://buymeacoffee.com/vijaik2k7"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 transition-colors ${
            isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-800'
          }`}
        >
          <Coffee className="w-3.5 h-3.5 text-amber-500" />
          <span>Buy me a coffee</span>
        </a>
      </div>
    </footer>
  );
};
