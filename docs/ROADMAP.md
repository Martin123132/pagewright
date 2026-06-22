# Roadmap

## North Star

Make routine PDF work free, local-first, private, and boringly reliable.

## MVP

1. CLI/library operations:
   - merge
   - split/extract ranges
   - rotate
   - image to PDF
   - PDF to images
   - metadata read/write
2. Minimal tests using generated fixture PDFs.
3. FastAPI wrapper with job isolation in `D:\CodexProjects\pdf-forge\scratch`.
4. Web UI with drag-and-drop, batch jobs, and output downloads.

## Later

- OCR scanned PDFs with OCRmyPDF/Tesseract integration.
- Compression profiles using Ghostscript and qpdf.
- Redaction that actually removes content, not visual overlays.
- Fill and flatten AcroForms.
- Watermarks, page numbers, headers, footers.
- Desktop packaging with Tauri or similar.

## Product Principles

- No forced upload.
- No watermarks.
- No page caps.
- No subscription gates.
- Clear errors when an external tool is missing.
- Temporary files stay under the project `D:` workspace and are easy to clean.
