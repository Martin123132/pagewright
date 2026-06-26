# Pagewright Public Proof

This proof uses synthetic inputs generated inside the repository. It does not require, store, or publish any private documents.

## What It Exercises

The proof runner calls the local API demo endpoints for the baseline no-external-tool routes:

- merge PDFs
- split a PDF into pages
- rotate a PDF
- convert images to a PDF
- render PDF pages to images

All source PDFs and images are created by `app/pdf_forge_api/demo.py`. Outputs are written under `outputs/public-proof`, which is ignored by git.

The optional `compress` route depends on a local Ghostscript install, so it is covered by focused engine/API tests and clear missing-tool behavior rather than this synthetic public proof.

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

The manifest should include five baseline operations: `merge`, `split`, `rotate`, `images-to-pdf`, and `pdf-to-images`.

Expected output shape:

```text
merge          1 PDF
split          2 PDFs plus a ZIP bundle
rotate         1 PDF
images-to-pdf  1 PDF
pdf-to-images  2 PNGs plus a ZIP bundle
```

The file names and sizes may vary slightly as PDF/image libraries change, but every output should be generated from synthetic fixtures only.

## Proof Check

The proof check runs the same synthetic demo into ignored `scratch/public-proof-check` and `outputs/public-proof-check` paths, then asserts:

- all five baseline operations are present in order
- output entries expose only `file_name` and `size_bytes`
- bundle entries expose only `file_name`, `size_bytes`, and `file_count`
- private or volatile fields such as absolute paths, job IDs, storage roots, and download URLs are not present

Run it with:

```powershell
.\.venv\Scripts\python.exe examples\check_synthetic_proof.py
```
