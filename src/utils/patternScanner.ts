import { PatternType, RedactionBox } from '../types/redact';

export interface TextItemWithBounds {
  str: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  width: number; // percentage (0 - 100)
  height: number; // percentage (0 - 100)
}

const PATTERNS: Record<PatternType, RegExp> = {
  ssn: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  phone: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
};

export function scanTextItemsForPattern(
  textItems: TextItemWithBounds[],
  patternType: PatternType,
  pageNumber: number
): Omit<RedactionBox, 'id'>[] {
  const regex = PATTERNS[patternType];
  const detectedBoxes: Omit<RedactionBox, 'id'>[] = [];

  for (const item of textItems) {
    regex.lastIndex = 0;
    if (regex.test(item.str)) {
      detectedBoxes.push({
        pageNumber,
        x: Math.max(0, item.x - 1),
        y: Math.max(0, item.y - 0.5),
        width: Math.min(100, item.width + 2),
        height: Math.min(100, item.height + 1),
        label: patternType.toUpperCase(),
      });
    }
  }

  return detectedBoxes;
}
