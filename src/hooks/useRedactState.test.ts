import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRedactState } from './useRedactState';

describe('useRedactState Hook', () => {
  it('starts with empty boxes array', () => {
    const { result } = renderHook(() => useRedactState());
    expect(result.current.boxes).toEqual([]);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('adds a box and allows undo and redo', () => {
    const { result } = renderHook(() => useRedactState());

    act(() => {
      result.current.addBox({ pageNumber: 1, x: 10, y: 20, width: 30, height: 40 });
    });

    expect(result.current.boxes.length).toBe(1);
    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.undo();
    });

    expect(result.current.boxes.length).toBe(0);
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.redo();
    });

    expect(result.current.boxes.length).toBe(1);
  });
});
