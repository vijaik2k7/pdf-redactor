import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { exportRedactedPdf } from './pdfExporter';

describe('pdfExporter', () => {
  it('creates clean redacted PDF bytes with sanitized metadata', async () => {
    // Generate a minimal valid PDF
    const testPdf = await PDFDocument.create();
    testPdf.addPage([600, 800]);
    const pdfBytes = await testPdf.save();

    const redactedBytes = await exportRedactedPdf(pdfBytes.buffer as ArrayBuffer, [
      { id: 'b1', pageNumber: 1, x: 10, y: 20, width: 30, height: 40 },
    ]);

    expect(redactedBytes).toBeInstanceOf(Uint8Array);
    expect(redactedBytes.length).toBeGreaterThan(0);

    const reloaded = await PDFDocument.load(redactedBytes);
    expect(reloaded.getPageCount()).toBe(1);
    expect(reloaded.getTitle()).toBe('Redacted Document');
  });
});
