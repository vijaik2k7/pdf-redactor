# PDFRedact — Design Specification
**Date**: 2026-09-12
**Status**: Approved
**Author**: Antigravity & Vijai

## Executive Summary
**PDFRedact** is a 100% client-side, browser-based PDF redaction & anonymization tool designed for privacy-conscious professionals (lawyers, accountants, HR, health privacy). It operates entirely within local browser memory using the Web Audio/Canvas & PDF.js ecosystem—guaranteeing 0 server uploads, 0 third-party data tracking of document content, and bulletproof "true redaction" by permanently flattening redacted areas into non-extractable output.

---

## 1. Design & Aesthetic Guidelines

- **Typography**: `Inter` (sans-serif) for clean interface UI, `JetBrains Mono` for page counts, zoom levels, pattern matches, and file details.
- **Color Palette**:
  - **Dark Theme (Obsidian)**: `#09090b` background, `#18181b` card panels, `#27272a` borders, `#zinc-100` primary text.
  - **Beige Theme (Soothing Anthropic)**: `#141413` dark mode variant and `#eee8dd` light beige mode background, `#e4ddd0` card panels, `#d8cfbe` borders, `#1F1E1B` primary text.
  - **Primary Accent**: Safety Orange (`#FF5500` / `#D97757`) for primary call-to-action buttons, active tool highlights, and branding accents.
  - **Trust Accent**: Emerald (`#10b981`) for the local privacy/processing security badge.
- **Tone**: Mature, modern, punchy, direct. Zero AI fluff, zero filler text, zero marketing buzzwords.

---

## 2. System Architecture & Tech Stack

- **Framework**: React 18 + TypeScript + Vite.
- **Styling**: Tailwind CSS + Lucide React Icons.
- **PDF Engine**: `pdfjs-dist` (Mozilla PDF.js) for rendering PDF pages to HTML5 Canvas and extracting text line geometry.
- **PDF Export Engine**: `pdf-lib` + Canvas rasterization for secure flattening of redacted pages into fresh PDF documents.
- **State Management**: React state hooks (`useReducer` / `useState`) with full undo/redo stack (`Ctrl+Z` / `Ctrl+Y`).

---

## 3. UI Layout & Component Breakdown

### 3.1 Header (`Header.tsx`)
- **Branding**: `PDFRedact` title with `v1.0` badge.
- **Security Badge**: `🛡️ Local processing — 0 Server Uploads` (emerald border & glow).
- **Controls**:
  - Start Over / Reset button.
  - Theme Toggle (Obsidian Dark / Anthropic Beige).
  - Keyboard Shortcuts (`?`) modal trigger.

### 3.2 Main Toolbar (`Toolbar.tsx`)
- **Page Controls**: `Previous`, `Next`, `Page X of Y`, Zoom in (`+`), Zoom out (`-`), Zoom reset (`100%`).
- **Interactive Tools**:
  - `Select / Draw Box` toggle.
  - `Clear Current Page Redactions`.
  - `Clear All Redactions`.
- **Smart Pattern Auto-Detect Pills**:
  - `+ SSNs` (`xxx-xx-xxxx`)
  - `+ Emails` (`user@domain.com`)
  - `+ Phone Numbers` (`(xxx) xxx-xxxx`)
  - `+ Credit Cards` (`16-digit cards`)
- **Export CTA**: Prominent Safety Orange button: `Download Redacted PDF 🔒`.

### 3.3 Workspace & Canvas Viewport (`PdfViewport.tsx`)
- Multi-page scrollable workspace or single-page high-DPI canvas viewer.
- Overlay interaction layer:
  - Drag mouse to draw redactor box (`#000000` fill with orange bounding handles).
  - Hover box shows remove icon (`×`).
  - Active box can be resized via corner handles.
  - Smart matches highlighted with subtle yellow/orange dashed border prior to confirmation, turning solid black once applied.

### 3.4 Page Thumbnails Sidebar (`PageSidebar.tsx`)
- Collapsible sidebar showing visual thumbnails of each PDF page.
- Highlights pages containing active redactions with a subtle badge count.

### 3.5 Keyboard Shortcuts Modal (`ShortcutsModal.tsx`)
- `Space + Drag`: Pan workspace.
- `Cmd / Ctrl + Z`: Undo box placement.
- `Cmd / Ctrl + Y`: Redo.
- `Delete / Backspace`: Remove selected redaction box.
- `Cmd / Ctrl + S`: Trigger Redacted PDF Export.

---

## 4. True Redaction & Security Engine

To prevent security leaks (where black boxes leave underlying text streams selectable/extractable in PDF code):

1. **Text Extraction Removal**: PDF text item geometries matching redactor box coordinates are stripped.
2. **Canvas Burn-In Rasterization**: Redacted pages are rendered to high-density offscreen HTML5 Canvases (2.0x scale / ~300 DPI equivalent) with solid `#000000` rectangles burned directly into the pixel array.
3. **Clean PDF Re-compilation**: The flattened page images are re-assembled into a clean PDF using `pdf-lib`.
4. **Metadata Scrubbing**: Author, creation tool, modified dates, and embedded form fields are purged during export.

---

## 5. Verification & Testing Plan

1. **Unit & Functional Verification**:
   - Verify drag-to-draw box placement and geometry scaling across zoom levels.
   - Verify regex detection algorithms against sample test strings (SSNs, emails, phone numbers).
   - Test undo/redo stack consistency.
2. **Security & Redaction Verification**:
   - Inspect generated PDF using `pdftotext` / `pdf-lib` / text selection tools to verify 0% text leak under black boxes.
   - Verify file download output and page alignment.
