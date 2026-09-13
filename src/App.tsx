import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ThemeMode, PatternType } from './types/redact';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { Toolbar } from './components/Toolbar';
import { PdfViewport } from './components/PdfViewport';
import { ShortcutsModal } from './components/ShortcutsModal';
import { useRedactState } from './hooks/useRedactState';
import { scanTextItemsForPattern, TextItemWithBounds } from './utils/patternScanner';
import { exportRedactedPdf } from './utils/pdfExporter';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('document.pdf');
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [currentTextItems, setCurrentTextItems] = useState<TextItemWithBounds[]>([]);

  const {
    boxes,
    addBox,
    addBoxes,
    removeBox,
    clearAll,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useRedactState();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'beige' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleFileSelect = async (file: File) => {
    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    setPdfBuffer(buffer);

    const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
    setNumPages(doc.numPages);
    setCurrentPage(1);
  };

  const handleScanPattern = (pattern: PatternType) => {
    if (!currentTextItems || currentTextItems.length === 0) return;
    const detected = scanTextItemsForPattern(currentTextItems, pattern, currentPage);
    addBoxes(detected);
  };

  const handleExport = async () => {
    if (!pdfBuffer) return;
    setIsExporting(true);
    try {
      const redactedBytes = await exportRedactedPdf(pdfBuffer, boxes);
      const blob = new Blob([new Uint8Array(redactedBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.replace(/\.pdf$/i, '') + '-redacted.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export redacted PDF', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Keyboard shortcuts listener (Cmd+Z, Cmd+Y, Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleExport();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, pdfBuffer, boxes]);

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#09090b] text-zinc-100' : 'bg-[#eee8dd] text-stone-900'
      }`}
    >
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onReset={() => setPdfBuffer(null)}
        hasFile={!!pdfBuffer}
      />

      {pdfBuffer ? (
        <>
          <Toolbar
            currentPage={currentPage}
            numPages={numPages}
            onPageChange={setCurrentPage}
            zoom={zoom}
            onZoomChange={setZoom}
            theme={theme}
            onClearPage={() => {}}
            onClearAll={clearAll}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onScanPattern={handleScanPattern}
            onExport={handleExport}
            isExporting={isExporting}
          />
          <PdfViewport
            pdfBuffer={pdfBuffer}
            currentPage={currentPage}
            zoom={zoom}
            boxes={boxes}
            onAddBox={addBox}
            onRemoveBox={removeBox}
            theme={theme}
            onTextItemsExtracted={setCurrentTextItems}
          />
        </>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
          <Dropzone onFileSelect={handleFileSelect} theme={theme} />
        </main>
      )}

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        theme={theme}
      />
    </div>
  );
}
