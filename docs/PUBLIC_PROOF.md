# Pagewright Public Proof

This proof uses synthetic inputs generated inside the repository. It does not require, store, or publish any private documents.

## What It Exercises

The proof runner calls the local API demo endpoints for every MVP route:

- merge PDFs
- split a PDF into pages
- rotate a PDF
- convert images to a PDF
- render PDF pages to images

All source PDFs and images are created by `app/pdf_forge_api/demo.py`. Outputs are written under `outputs/public-proof`, which is ignored by git.

## Run It

Install the API and development extras first:

```powershell
cd D:\CodexProjects\pdf-forge
.\.venv\Scripts\python.exe -m pip install -e ".[dev,api]"
```

Run the synthetic proof:

```powershell
.\.venv\Scripts\python.exe examples\synthetic_proof.py
```

The command prints a JSON summary and writes the same manifest to:

```text
D:\CodexProjects\pdf-forge\outputs\public-proof\public-proof-manifest.json
```

## Expected Result

The manifest should include five operations: `merge`, `split`, `rotate`, `images-to-pdf`, and `pdf-to-images`.

Expected output shape:

```text
merge          1 PDF
split          2 PDFs plus a ZIP bundle
rotate         1 PDF
images-to-pdf  1 PDF
pdf-to-images  2 PNGs plus a ZIP bundle
```

The file names and sizes may vary slightly as PDF/image libraries change, but every output should be generated from synthetic fixtures only.
