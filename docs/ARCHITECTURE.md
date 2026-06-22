# Architecture

Pagewright starts with a small Python engine that can be called from a CLI, an API, or a desktop shell.

## Layers

```text
UI or API
  -> job orchestration
    -> pdf_forge engine operations
      -> Python libraries and optional external tools
```

## Engine Libraries

- `pypdf` for structural PDF operations: merge, split, rotate, metadata.
- `PyMuPDF` for rendering PDF pages to images.
- `Pillow` for image normalization and image-to-PDF output.

## External Tool Candidates

- `qpdf` for structural repair and transformations.
- Ghostscript for compression profiles.
- OCRmyPDF plus Tesseract for OCR.
- Poppler utilities for fallback rendering and inspection.

External tools should be detected at runtime and reported clearly rather than assumed.

## Storage Boundary

On this machine, project data belongs under:

```text
D:\CodexProjects\pdf-forge
```

The engine should never silently write to the user's home directory, OS temp directory, or `C:`. Callers must pass explicit input and output paths.
