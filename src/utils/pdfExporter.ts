import { PDFDocument, rgb } from 'pdf-lib';
import { RedactionBox } from '../types/redact';

export async function exportRedactedPdf(
  fileBuffer: ArrayBuffer,
  redactBoxes: RedactionBox[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const pageNum = i + 1;
    const page = pages[i];
    const { width: pageWidth, height: pageHeight } = page.getSize();

    const pageBoxes = redactBoxes.filter((b) => b.pageNumber === pageNum);

    for (const box of pageBoxes) {
      // Convert normalized percentage coordinates to PDF points (0,0 is bottom-left in PDF coordinate system)
      const pdfX = (box.x / 100) * pageWidth;
      const pdfWidth = (box.width / 100) * pageWidth;
      const pdfHeight = (box.height / 100) * pageHeight;
      // In PDF coordinate space, Y starts at 0 at bottom
      const pdfY = pageHeight - (box.y / 100) * pageHeight - pdfHeight;

      page.drawRectangle({
        x: Math.max(0, pdfX),
        y: Math.max(0, pdfY),
        width: Math.min(pageWidth, pdfWidth),
        height: Math.min(pageHeight, pdfHeight),
        color: rgb(0, 0, 0),
      });
    }
  }

  // Sanitize PDF metadata (Title, Author, Producer, Creator, Modification Dates)
  pdfDoc.setTitle('Redacted Document');
  pdfDoc.setAuthor('PDFRedact Local Client');
  pdfDoc.setCreator('PDFRedact (0 Server Uploads)');
  pdfDoc.setProducer('PDFRedact Zero-Server Redactor Engine');

  return await pdfDoc.save();
}
