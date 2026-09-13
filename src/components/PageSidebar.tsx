import React from 'react';
import { RedactionBox, ThemeMode } from '../types/redact';

interface PageSidebarProps {
  numPages: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  boxes: RedactionBox[];
  theme: ThemeMode;
}

export const PageSidebar: React.FC<PageSidebarProps> = ({
  numPages,
  currentPage,
  onPageSelect,
  boxes,
  theme,
}) => {
  const isDark = theme === 'dark';
  const pagesArray = Array.from({ length: numPages }, (_, i) => i + 1);

  return (
    <aside
      className={`w-44 border-r hidden md:flex flex-col overflow-y-auto p-3 gap-3 sticky top-[105px] h-[calc(100vh-140px)] transition-colors ${
        isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-[#d8cfbe] bg-[#f5f0e6]'
      }`}
    >
      <div className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider mb-1 px-1">
        Pages ({numPages})
      </div>

      {pagesArray.map((pageNum) => {
        const pageBoxCount = boxes.filter((b) => b.pageNumber === pageNum).length;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageSelect(pageNum)}
            className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
              isActive
                ? isDark
                  ? 'bg-zinc-800 border-[#FF5500] text-white shadow-md'
                  : 'bg-[#e4ddd0] border-[#FF5500] text-stone-900 shadow-md font-bold'
                : isDark
                ? 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800'
                : 'bg-[#eee8dd] border-[#d8cfbe] text-stone-700 hover:bg-[#e4ddd0]'
            }`}
          >
            <span className="font-mono text-xs font-semibold">Page {pageNum}</span>
            {pageBoxCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#FF5500] text-white font-bold">
                {pageBoxCount}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
};
