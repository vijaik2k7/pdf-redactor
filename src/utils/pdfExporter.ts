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
    // Render page at 3.0x scale (~300 DPI ultra-sharp print quality)
    const scale = 3.0;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    if (!context) continue;

    // Fill white background for document page
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Render original PDF page onto high-DPI canvas
    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    // Burn-in black redaction rectangles directly into the pixel array
    const pageBoxes = redactBoxes.filter((b) => b.pageNumber === pageNum);
    context.fillStyle = '#000000';

    for (const box of pageBoxes) {
      const pixelX = (box.x / 100) * viewport.width;
      const pixelY = (box.y / 100) * viewport.height;
      const pixelW = (box.width / 100) * viewport.width;
      const pixelH = (box.height / 100) * viewport.height;

      context.fillRect(pixelX, pixelY, pixelW, pixelH);
    }

    // Convert redacted canvas to PNG image data URL
    const pngDataUrl = canvas.toDataURL('image/png', 1.0);
    const pngImageBytes = await fetch(pngDataUrl).then((res) => res.arrayBuffer());

    // Embed flattened PNG image into fresh PDF document (0% text leak, 100% secure against OCR)
    const pngImage = await newPdfDoc.embedPng(pngImageBytes);
    const originalWidth = viewport.width / scale;
    const originalHeight = viewport.height / scale;

    const pdfPage = newPdfDoc.addPage([originalWidth, originalHeight]);
    pdfPage.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: originalWidth,
      height: originalHeight,
    });
  }

  // Sanitize PDF Metadata
  newPdfDoc.setTitle('Redacted Document');
  newPdfDoc.setAuthor('PDFRedact Local Client');
  newPdfDoc.setCreator('PDFRedact (0 Server Uploads)');
  newPdfDoc.setProducer('PDFRedact Secure Redaction Engine');

  return await newPdfDoc.save();
}
