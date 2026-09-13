# PDFRedact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "PDFRedact", a 100% client-side browser app for drawing black redaction boxes and smart auto-detecting sensitive data (SSNs, emails, phone numbers) on PDFs with guaranteed non-extractable flattened PDF export.

**Architecture:** React 18 + Vite + Tailwind CSS app. Uses Mozilla `pdfjs-dist` to render pages to HTML5 Canvas elements with an interactive drawing overlay, regex pattern matching over PDF text layers for smart redaction, and `pdf-lib` + canvas burn-in rasterization for zero-leak flattened export.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, `pdfjs-dist`, `pdf-lib`, Vitest.

## Global Constraints

- **Local Storage / Privacy**: 0 server uploads, 100% in-browser Web API processing.
- **Design Aesthetic**: Anthropic Beige (`#eee8dd`) & Obsidian Dark (`#09090b`) theme toggle, Safety Orange (`#FF5500`) primary CTA, Inter / JetBrains Mono typography. No marketing filler or AI buzzwords.
- **Zero Leak Redaction**: Export must burn redactions into image arrays or strip text streams so data cannot be selected or extracted.

---

### Task 1: Project Scaffolding & Setup

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `src/index.css`, `src/App.tsx`, `src/main.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: Base Vite + React 18 app with Tailwind CSS styling and PDF dependencies (`pdfjs-dist`, `pdf-lib`, `lucide-react`).

- [ ] **Step 1: Create package.json and dependencies**

Write `package.json` with scripts for `dev`, `build`, `test`, `deploy`.

- [ ] **Step 2: Install dependencies & configure Vite + Tailwind**

Run `npm install` for dependencies (`react`, `react-dom`, `pdfjs-dist`, `pdf-lib`, `lucide-react`, `tailwindcss`, `vite`, `vitest`).

- [ ] **Step 3: Verify build and baseline test**

Run `npm test` and `npm run build` to confirm zero compilation errors.

- [ ] **Step 4: Commit scaffolding**

```bash
git add package.json vite.config.ts tsconfig.json tailwind.config.js src/
git commit -m "chore: scaffold PDFRedact project with Vite, Tailwind, and PDF dependencies"
```

---

### Task 2: Header Component & Theme Context

**Files:**
- Create: `src/types/redact.ts`, `src/components/Header.tsx`
- Test: `src/components/Header.test.tsx`

**Interfaces:**
- Consumes: `ThemeMode` (`'dark' | 'beige'`)
- Produces: Header bar with branding, `🛡️ Local processing — 0 Server Uploads` emerald badge, theme switcher, reset button.

- [ ] **Step 1: Define types in `src/types/redact.ts`**

Define `ThemeMode`, `RedactionBox`, `PatternType`, `PdfMetadata`.

- [ ] **Step 2: Implement Header component**

Build `Header.tsx` with logo, security shield badge, theme toggle button, and keyboard shortcuts button.

- [ ] **Step 3: Write tests for Header**

Verify component renders logo, theme toggle click handler, and security badge.

- [ ] **Step 4: Commit Header component**

```bash
git add src/types/redact.ts src/components/Header.tsx src/components/Header.test.tsx
git commit -m "feat: implement Header component with local processing badge and theme switcher"
```

---

### Task 3: PDF Upload & Redaction State Management

**Files:**
- Create: `src/components/Dropzone.tsx`, `src/hooks/useRedactState.ts`
- Test: `src/hooks/useRedactState.test.ts`

**Interfaces:**
- Consumes: User PDF file input.
- Produces: Redaction state reducer managing array of `RedactionBox` objects per page number with undo/redo stack (`pushBox`, `removeBox`, `undo`, `redo`, `clearPage`).

- [ ] **Step 1: Write `useRedactState` hook with undo/redo**

Implement custom hook with action dispatchers for adding/removing/moving boxes and history tracking.

- [ ] **Step 2: Write tests for `useRedactState`**

Verify box addition, removal, page clearing, and undo/redo operations.

- [ ] **Step 3: Implement Dropzone component**

Build drag-and-drop file upload target with SVG icon, sample file trigger, and privacy note.

- [ ] **Step 4: Commit state management & dropzone**

```bash
git add src/hooks/useRedactState.ts src/hooks/useRedactState.test.ts src/components/Dropzone.tsx
git commit -m "feat: add PDF dropzone and undo/redo redaction state hook"
```

---

### Task 4: PdfViewport & Drawing Overlay Component

**Files:**
- Create: `src/components/PdfViewport.tsx`, `src/components/Toolbar.tsx`
- Test: `src/components/PdfViewport.test.tsx`

**Interfaces:**
- Consumes: `pdfjs-dist` page document, active `RedactionBox` list for page.
- Produces: Rendered PDF canvas with interactive drag-to-draw box overlay layer, handles, and delete triggers.

- [ ] **Step 1: Implement Toolbar component**

Page navigation (`Prev`, `Next`), Zoom controls (`In`, `Out`, `Reset`), Clear page button, and Orange Export CTA.

- [ ] **Step 2: Implement PdfViewport with Canvas drawing overlay**

Render PDF page via PDF.js worker. Attach mouse event handlers (`onMouseDown`, `onMouseMove`, `onMouseUp`) to record relative `(x, y, width, height)` percentages on page.

- [ ] **Step 3: Test viewport interactions**

Verify canvas rendering and box coordinates normalization.

- [ ] **Step 4: Commit Viewport and Toolbar**

```bash
git add src/components/Toolbar.tsx src/components/PdfViewport.tsx
git commit -m "feat: implement PDF canvas viewer and interactive drag-to-draw redaction overlay"
```

---

### Task 5: Smart Pattern Auto-Detection Engine

**Files:**
- Create: `src/utils/patternScanner.ts`
- Test: `src/utils/patternScanner.test.ts`

**Interfaces:**
- Consumes: PDF.js `getTextContent()` text items with page coordinates.
- Produces: Function `detectPatterns(textContent, patternType)` returning `RedactionBox[]` for SSNs, Emails, Phone numbers, Credit cards.

- [ ] **Step 1: Write `patternScanner.ts` regex algorithms**

Implement regex matchers for SSN, Email, Phone, Credit Card, mapping string offset ranges to text box bounding rectangles.

- [ ] **Step 2: Write unit tests for patternScanner**

Test pattern scanner with mock PDF text items.

- [ ] **Step 3: Connect pattern pills in Toolbar**

Add 1-click detection triggers (`+ SSNs`, `+ Emails`, `+ Phone Numbers`, `+ Credit Cards`) to Toolbar.

- [ ] **Step 4: Commit Smart Pattern Detection engine**

```bash
git add src/utils/patternScanner.ts src/utils/patternScanner.test.ts
git commit -m "feat: implement smart auto-detection engine for SSNs, Emails, Phone Numbers, and Credit Cards"
```

---

### Task 6: True Redaction Export Engine

**Files:**
- Create: `src/utils/pdfExporter.ts`
- Test: `src/utils/pdfExporter.test.ts`

**Interfaces:**
- Consumes: Original PDF ArrayBuffer, map of page numbers to `RedactionBox[]`.
- Produces: `exportRedactedPdf(fileBuffer, redactionMap)` returning flattened, secure PDF Blob for download.

- [ ] **Step 1: Implement `pdfExporter.ts`**

For each page in PDF:
1. Render page to offscreen high-res Canvas (2x scale).
2. Draw solid black `#000000` fill rects over all redaction box coordinates.
3. Compress Canvas frame to PNG/JPEG.
4. Embed image into fresh `pdf-lib` document page to guarantee 0% selectable text underneath.

- [ ] **Step 2: Test export engine**

Verify exported document contains expected pages and 0 text extractability in redacted regions.

- [ ] **Step 3: Connect Export CTA button in Toolbar**

Trigger file download with `-redacted.pdf` filename suffix upon export completion.

- [ ] **Step 4: Commit Exporter**

```bash
git add src/utils/pdfExporter.ts src/utils/pdfExporter.test.ts
git commit -m "feat: implement true redaction flattened PDF exporter"
```

---

### Task 7: Shortcuts Modal, Polish & Deployment Setup

**Files:**
- Create: `src/components/ShortcutsModal.tsx`, `deploy` script setup.
- Test: Full end-to-end user flow test.

- [ ] **Step 1: Implement ShortcutsModal component**

Keyboard shortcuts cheat sheet modal (`Space`, `Cmd+Z`, `Cmd+Y`, `Del`, `Cmd+S`).

- [ ] **Step 2: Run full build and test suite**

Run `npm test` and `npm run build` to verify 100% test pass and zero build warnings.

- [ ] **Step 3: Final Commit**

```bash
git add .
git commit -m "feat: complete PDFRedact app implementation and prepare production build"
```
