import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { RedactionBox, ThemeMode } from '../types/redact';
import { TextItemWithBounds } from '../utils/patternScanner';

import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

// Configure pdfjs worker via Vite bundled worker asset
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

interface PdfViewportProps {
  pdfBuffer: ArrayBuffer;
  currentPage: number;
  zoom: number;
  boxes: RedactionBox[];
  onAddBox: (box: Omit<RedactionBox, 'id'>) => void;
  onRemoveBox: (id: string) => void;
  theme: ThemeMode;
  onTextItemsExtracted?: (items: TextItemWithBounds[]) => void;
}

export const PdfViewport: React.FC<PdfViewportProps> = ({
  pdfBuffer,
  currentPage,
  zoom,
  boxes,
  onAddBox,
  onRemoveBox,
  theme,
  onTextItemsExtracted,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentDragRect, setCurrentDragRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const isDark = theme === 'dark';

  // Load PDF document from ArrayBuffer
  useEffect(() => {
    let isCancelled = false;
    pdfjsLib.getDocument({ data: pdfBuffer.slice(0) }).promise.then((doc) => {
      if (!isCancelled) {
        setPdfDoc(doc);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [pdfBuffer]);

  // Render active page to Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;
    pdfDoc.getPage(currentPage).then((page) => {
      if (isCancelled || !canvasRef.current) return;

      const viewport = page.getViewport({ scale: zoom * 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      page.render(renderContext).promise.then(() => {
        if (isCancelled) return;

        // Extract text bounds for smart pattern matching
        page.getTextContent().then((textContent) => {
          if (isCancelled) return;
          const textItems: TextItemWithBounds[] = textContent.items.map((item: any) => {
            const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
            return {
              str: item.str,
              x: (tx[4] / viewport.width) * 100,
              y: ((viewport.height - tx[5]) / viewport.height) * 100,
              width: (item.width * viewport.scale / viewport.width) * 100,
              height: (item.height * viewport.scale / viewport.height) * 100,
            };
          });
          if (onTextItemsExtracted) {
            onTextItemsExtracted(textItems);
          }
        });
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, currentPage, zoom, onTextItemsExtracted]);

  // Handle Mouse Events for Drawing Box
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setDrawStart({ x, y });
    setCurrentDragRect({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const x = Math.min(drawStart.x, currentX);
    const y = Math.min(drawStart.y, currentY);
    const w = Math.abs(currentX - drawStart.x);
    const h = Math.abs(currentY - drawStart.y);

    setCurrentDragRect({ x, y, w, h });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentDragRect && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (currentDragRect.w > 10 && currentDragRect.h > 10) {
        onAddBox({
          pageNumber: currentPage,
          x: (currentDragRect.x / rect.width) * 100,
          y: (currentDragRect.y / rect.height) * 100,
          width: (currentDragRect.w / rect.width) * 100,
          height: (currentDragRect.h / rect.height) * 100,
        });
      }
    }
    setIsDrawing(false);
    setDrawStart(null);
    setCurrentDragRect(null);
  };

  const pageBoxes = boxes.filter((b) => b.pageNumber === currentPage);

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start select-none">
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`relative shadow-2xl rounded-lg overflow-hidden cursor-crosshair border transition-colors ${
          isDark ? 'border-zinc-800 bg-white' : 'border-[#d8cfbe] bg-white'
        }`}
      >
        <canvas ref={canvasRef} className="block" />

        {/* Existing Redaction Boxes */}
        {pageBoxes.map((box) => (
          <div
            key={box.id}
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
            className="absolute bg-black group border border-[#FF5500]/60 hover:border-[#FF5500] transition-colors"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveBox(box.id);
              }}
              className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-[#FF5500] text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              title="Remove Box"
            >
              ×
            </button>
            {box.label && (
              <span className="absolute bottom-0.5 left-1 text-[9px] font-mono text-amber-400 bg-black/80 px-1 rounded">
                {box.label}
              </span>
            )}
          </div>
        ))}

        {/* Dragging Preview Box */}
        {isDrawing && currentDragRect && (
          <div
            style={{
              left: currentDragRect.x,
              top: currentDragRect.y,
              width: currentDragRect.w,
              height: currentDragRect.h,
            }}
            className="absolute bg-black/80 border-2 border-dashed border-[#FF5500] pointer-events-none"
          />
        )}
      </div>
    </div>
  );
};
