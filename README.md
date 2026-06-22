# Pagewright

[![CI](https://github.com/Martin123132/pagewright/actions/workflows/ci.yml/badge.svg)](https://github.com/Martin123132/pagewright/actions/workflows/ci.yml)

Pagewright is a local-first, open-source document toolkit aimed at replacing everyday paid PDF subscriptions for common document work.

The project rule for this machine: keep all project files, scratch data, caches, build artifacts, and generated outputs on `D:`. This repo lives at:

```text
D:\CodexProjects\pdf-forge
```

Need the quick orientation page? See [`docs/PROJECT_MAP.md`](docs/PROJECT_MAP.md). Want a sanitized demo? See [`docs/PUBLIC_PROOF.md`](docs/PUBLIC_PROOF.md). Want to help? See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`SECURITY.md`](SECURITY.md).

## MVP Scope

- Merge PDFs
- Split or extract page ranges
- Rotate pages
- Convert images to PDF
- Render PDF pages to images
- Read and update document metadata
- Prepare hooks for compression and OCR

## Architecture

```text
engine/   Python package and CLI for PDF operations
app/      API and future UI entry points
docs/     Product, architecture, and roadmap notes
tests/    Focused fixtures and regression tests
scratch/  Local temporary job files, ignored by git
outputs/  User-facing generated files, ignored by git
```

The first implementation pass is an engine and CLI so the document operations are dependable before a web or desktop UI is added.

## Development

Create the virtual environment inside the repo on `D:`:

```powershell
cd D:\CodexProjects\pdf-forge
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
```

Run the CLI:

```powershell
.\.venv\Scripts\pdf-forge.exe --help
```

Run tests:

```powershell
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m pytest --basetemp D:\CodexProjects\pdf-forge\scratch\pytest
.\.venv\Scripts\python.exe examples\check_synthetic_proof.py
```

GitHub Actions runs the same Ruff, Pytest, and synthetic proof checks on pushes and pull requests to `main`.

## Local API

Install the API extras:

```powershell
.\.venv\Scripts\python.exe -m pip install -e ".[dev,api]"
```

Run the local API:

```powershell
$env:TEMP='D:\CodexProjects\pdf-forge\scratch\tmp'
$env:TMP='D:\CodexProjects\pdf-forge\scratch\tmp'
.\.venv\Scripts\python.exe -m uvicorn pdf_forge_api.main:app --host 127.0.0.1 --port 8787 --reload
```

The interactive docs are available at:

```text
http://127.0.0.1:8787/
```

The API schema docs are available at:

```text
http://127.0.0.1:8787/docs
```

## Synthetic Proof

Run every built-in demo route with generated-only inputs:

```powershell
.\.venv\Scripts\python.exe examples\synthetic_proof.py
```

The proof manifest is written under `outputs/public-proof`, which is ignored by git. See [`docs/PUBLIC_PROOF.md`](docs/PUBLIC_PROOF.md) for the expected output shape.

Check the proof contract without publishing any generated artifacts:

```powershell
.\.venv\Scripts\python.exe examples\check_synthetic_proof.py
```
