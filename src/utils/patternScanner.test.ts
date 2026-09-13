import { describe, it, expect } from 'vitest';
import { scanTextItemsForPattern, TextItemWithBounds } from './patternScanner';

describe('patternScanner', () => {
  const sampleItems: TextItemWithBounds[] = [
    { str: 'John Doe', x: 10, y: 10, width: 20, height: 5 },
    { str: 'SSN: 123-45-6789', x: 10, y: 20, width: 30, height: 5 },
    { str: 'Email: test@example.com', x: 10, y: 30, width: 35, height: 5 },
    { str: 'Phone: (555) 123-4567', x: 10, y: 40, width: 32, height: 5 },
  ];

  it('detects SSNs correctly', () => {
    const matches = scanTextItemsForPattern(sampleItems, 'ssn', 1);
    expect(matches.length).toBe(1);
    expect(matches[0].label).toBe('SSN');
  });

  it('detects Emails correctly', () => {
    const matches = scanTextItemsForPattern(sampleItems, 'email', 1);
    expect(matches.length).toBe(1);
    expect(matches[0].label).toBe('EMAIL');
  });

  it('detects Phone numbers correctly', () => {
    const matches = scanTextItemsForPattern(sampleItems, 'phone', 1);
    expect(matches.length).toBe(1);
    expect(matches[0].label).toBe('PHONE');
  });
});
