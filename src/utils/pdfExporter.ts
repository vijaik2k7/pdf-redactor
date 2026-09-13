import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { RedactionBox } from '../types/redact';

export async function exportRedactedPdf(
  fileBuffer: ArrayBuffer,
  redactBoxes: RedactionBox[]
): Promise<Uint8Array> {
  const loadedPdfDoc = await pdfjsLib.getDocument({ data: fileBuffer.slice(0) }).promise;
  const newPdfDoc = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= loadedPdfDoc.numPages; pageNum++) {
    const page = await loadedPdfDoc.getPage(pageNum);
    // Render page at 2.0x scale (~300 DPI equivalent) for sharp text clarity
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    if (!context) continue;

    // Render original PDF page onto canvas
    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    // Burn-in black redaction rectangles directly into the canvas pixels
    const pageBoxes = redactBoxes.filter((b) => b.pageNumber === pageNum);
    context.fillStyle = '#000000';

    for (const box of pageBoxes) {
      const pixelX = (box.x / 100) * viewport.width;
      const pixelY = (box.y / 100) * viewport.height;
      const pixelW = (box.width / 100) * viewport.width;
      const pixelH = (box.height / 100) * viewport.height;

      context.fillRect(pixelX, pixelY, pixelW, pixelH);
    }

    // Convert redacted canvas to PNG image data
    const pngDataUrl = canvas.toDataURL('image/png');
    const pngImageBytes = await fetch(pngDataUrl).then((res) => res.arrayBuffer());

    // Embed flattened PNG image into fresh PDF document (un-selectable, 100% secure)
    const pngImage = await newPdfDoc.embedPng(pngImageBytes);
    // Use unscaled viewport dimensions (divided by 2.0) for standard PDF page size
    const pdfPage = newPdfDoc.addPage([viewport.width / 2.0, viewport.height / 2.0]);
    pdfPage.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: viewport.width / 2.0,
      height: viewport.height / 2.0,
    });
  }

  // Sanitize PDF Metadata
  newPdfDoc.setTitle('Redacted Document');
  newPdfDoc.setAuthor('PDFRedact Local Client');
  newPdfDoc.setCreator('PDFRedact (0 Server Uploads)');
  newPdfDoc.setProducer('PDFRedact True Redaction Engine');

  return await newPdfDoc.save();
}
