import { useState, useCallback } from 'react';
import { RedactionBox } from '../types/redact';

export function useRedactState() {
  const [history, setHistory] = useState<RedactionBox[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const currentBoxes = history[historyIndex] || [];

  const addBox = useCallback((box: Omit<RedactionBox, 'id'>) => {
    const newBox: RedactionBox = {
      ...box,
      id: 'box_' + Math.random().toString(36).substr(2, 9),
    };
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      return [...nextHistory, [...(prev[historyIndex] || []), newBox]];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const removeBox = useCallback((id: string) => {
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      const filtered = (prev[historyIndex] || []).filter((b) => b.id !== id);
      return [...nextHistory, filtered];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const addBoxes = useCallback((boxes: Omit<RedactionBox, 'id'>[]) => {
    if (boxes.length === 0) return;
    const newBoxes: RedactionBox[] = boxes.map((b) => ({
      ...b,
      id: 'box_' + Math.random().toString(36).substr(2, 9),
    }));
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      return [...nextHistory, [...(prev[historyIndex] || []), ...newBoxes]];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const clearAll = useCallback(() => {
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      return [...nextHistory, []];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
    }
  }, [historyIndex, history.length]);

  return {
    boxes: currentBoxes,
    addBox,
    addBoxes,
    removeBox,
    clearAll,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}
