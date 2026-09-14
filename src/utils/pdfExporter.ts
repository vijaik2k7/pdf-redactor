import { PDFDocument, PDFName, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { RedactionBox } from '../types/redact';

function getPageContentStreams(page: any): any[] {
  const contents = page.node.get(PDFName.of('Contents'));
  if (!contents) return [];
  
  if (contents.constructor.name === 'PDFRef' || contents.object) {
    const stream = page.doc.context.lookup(contents);
    return stream ? [stream] : [];
  }
  
  if (contents.array) {
    const streams: any[] = [];
    for (const ref of contents.array) {
      const stream = page.doc.context.lookup(ref);
      if (stream) streams.push(stream);
    }
    return streams;
  }
  
  return [];
}

export async function exportRedactedPdf(
  fileBuffer: ArrayBuffer,
  redactBoxes: RedactionBox[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const loadedPdfJsDoc = await pdfjsLib.getDocument({ data: fileBuffer.slice(0) }).promise;
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const pageNum = i + 1;
    const page = pages[i];
    const { width: pageWidth, height: pageHeight } = page.getSize();
    const pageBoxes = redactBoxes.filter((b) => b.pageNumber === pageNum);

    if (pageBoxes.length === 0) continue;

    // 1. Identify all text strings falling inside redaction boxes on this page
    const pdfJsPage = await loadedPdfJsDoc.getPage(pageNum);
    const viewport = pdfJsPage.getViewport({ scale: 1.0 });
    const textContent = await pdfJsPage.getTextContent();

    const textTargetsToScrub: string[] = [];

    for (const item of textContent.items as any[]) {
      if (!item.str || item.str.trim() === '') continue;

      const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
      const itemX = (tx[4] / viewport.width) * 100;
      const itemY = ((viewport.height - tx[5]) / viewport.height) * 100;
      const itemW = (item.width / viewport.width) * 100;
      const itemH = (item.height / viewport.height) * 100;

      // Check if text item overlaps with any redaction box on this page
      const isRedacted = pageBoxes.some((box) => {
        return (
          itemX < box.x + box.width &&
          itemX + itemW > box.x &&
          itemY < box.y + box.height &&
          itemY + itemH > box.y
        );
      });

      if (isRedacted) {
        textTargetsToScrub.push(item.str);
      }
    }

    // 2. Excise text target strings from native PDF content streams
    const streams = getPageContentStreams(page);
    for (const stream of streams) {
      if (typeof stream.getUncompressedContents !== 'function') continue;

      let rawContent = new TextDecoder('latin1').decode(stream.getUncompressedContents());
      let modified = false;

      for (const targetText of textTargetsToScrub) {
        if (!targetText || targetText.length === 0) continue;

        // Scrub text target occurrences inside PDF stream operators with spaces
        if (rawContent.includes(targetText)) {
          const spaces = ' '.repeat(targetText.length);
          rawContent = rawContent.split(targetText).join(spaces);
          modified = true;
        }
      }

      if (modified && typeof stream.setContents === 'function') {
        stream.setContents(new TextEncoder().encode(rawContent));
      }
    }

    // 3. Draw black rectangles over the redacted coordinates
    for (const box of pageBoxes) {
      const pdfX = (box.x / 100) * pageWidth;
      const pdfWidth = (box.width / 100) * pageWidth;
      const pdfHeight = (box.height / 100) * pageHeight;
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

  // Sanitize PDF Metadata
  pdfDoc.setTitle('Redacted Document');
  pdfDoc.setAuthor('PDFRedact Local Client');
  pdfDoc.setCreator('PDFRedact (0 Server Uploads)');
  pdfDoc.setProducer('PDFRedact Clean Vector Redaction Engine');

  return await pdfDoc.save();
}
