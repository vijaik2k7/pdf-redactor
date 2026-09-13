import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Trash2,
  Undo2,
  Redo2,
  Sparkles,
} from 'lucide-react';
import { ThemeMode, PatternType } from '../types/redact';

interface ToolbarProps {
  currentPage: number;
  numPages: number;
  onPageChange: (page: number) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  theme: ThemeMode;
  onClearPage: () => void;
  onClearAll: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onScanPattern: (pattern: PatternType) => void;
  onExport: () => void;
  isExporting?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentPage,
  numPages,
  onPageChange,
  zoom,
  onZoomChange,
  theme,
  onClearAll,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onScanPattern,
  onExport,
  isExporting = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`border-b px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-[57px] z-20 transition-colors ${
        isDark ? 'border-zinc-800 bg-[#121215]/90 backdrop-blur-md' : 'border-[#d8cfbe] bg-[#f5f0e6]/90 backdrop-blur-md shadow-sm'
      }`}
    >
      {/* Left: Page & Zoom Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`p-1.5 rounded-md border transition-colors disabled:opacity-40 ${
              isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-[#d8cfbe] hover:bg-[#e4ddd0]'
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs px-2">
            Page {currentPage} of {numPages}
          </span>
          <button
            disabled={currentPage >= numPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`p-1.5 rounded-md border transition-colors disabled:opacity-40 ${
              isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-[#d8cfbe] hover:bg-[#e4ddd0]'
            }`}
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-zinc-700/50 mx-1" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
            className={`p-1.5 rounded-md border transition-colors ${
              isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-[#d8cfbe] hover:bg-[#e4ddd0]'
            }`}
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs px-1.5 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(2.5, zoom + 0.25))}
            className={`p-1.5 rounded-md border transition-colors ${
              isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-[#d8cfbe] hover:bg-[#e4ddd0]'
            }`}
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Smart Auto-Detect Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-mono font-medium hidden lg:inline-flex items-center gap-1 text-amber-500 mr-1">
          <Sparkles className="w-3.5 h-3.5" /> Auto-Detect:
        </span>
        <button
          onClick={() => onScanPattern('ssn')}
          className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-colors ${
            isDark
              ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              : 'bg-[#e4ddd0] hover:bg-[#d8cebc] border-[#c8bca8] text-stone-900'
          }`}
        >
          + SSNs
        </button>
        <button
          onClick={() => onScanPattern('email')}
          className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-colors ${
            isDark
              ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              : 'bg-[#e4ddd0] hover:bg-[#d8cebc] border-[#c8bca8] text-stone-900'
          }`}
        >
          + Emails
        </button>
        <button
          onClick={() => onScanPattern('phone')}
          className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-colors ${
            isDark
              ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              : 'bg-[#e4ddd0] hover:bg-[#d8cebc] border-[#c8bca8] text-stone-900'
          }`}
        >
          + Phones
        </button>
      </div>

      {/* Right: Actions (Undo, Redo, Clear, Export) */}
      <div className="flex items-center gap-2">
        <button
          disabled={!canUndo}
          onClick={onUndo}
          className={`p-1.5 rounded-md border transition-colors disabled:opacity-40 ${
            isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-[#d8cfbe] hover:bg-[#e4ddd0]'
          }`}
          title="Undo (Cmd+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          disabled={!canRedo}
          onClick={onRedo}
          className={`p-1.5 rounded-md border transition-colors disabled:opacity-40 ${
            isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-[#d8cfbe] hover:bg-[#e4ddd0]'
          }`}
          title="Redo (Cmd+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onClearAll}
          className={`p-1.5 rounded-md border text-xs font-mono transition-colors ${
            isDark
              ? 'border-zinc-800 hover:bg-red-950/40 text-red-400 border-red-900/40'
              : 'border-[#d8cfbe] hover:bg-red-100/70 text-red-700'
          }`}
          title="Clear All Redactions"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          disabled={isExporting}
          onClick={onExport}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#E04B00] text-white font-mono text-xs font-semibold shadow-md shadow-[#FF5500]/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Exporting...' : 'Download Redacted PDF 🔒'}</span>
        </button>
      </div>
    </div>
  );
};
