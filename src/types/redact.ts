export type ThemeMode = 'dark' | 'beige';

export type PatternType = 'ssn' | 'email' | 'phone' | 'creditCard';

export interface RedactionBox {
  id: string;
  pageNumber: number;
  // Normalized percentage coordinates (0 to 100) relative to page width/height
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface PdfFileMetadata {
  fileName: string;
  fileSize: number;
  numPages: number;
  buffer: ArrayBuffer;
}
