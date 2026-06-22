# Pagewright Project Map

Date: 2026-06-22

Pagewright currently lives on this machine at:

```text
D:\CodexProjects\pdf-forge
```

The public GitHub repository is:

```text
https://github.com/Martin123132/pagewright
```

The local `main` branch tracks `origin/main`.

## What Lives Where

- `app/pdf_forge_api/` - FastAPI app, storage policy, demo generators, and static workbench UI.
- `app/pdf_forge_api/static/` - Pagewright browser UI: routes, staging, settings, presets, recent rail, keyboard flow.
- `engine/pdf_forge/` - PDF operation engine and CLI implementation.
- `examples/` - public-safe demo and proof runners using synthetic inputs only.
- `tests/` - API and engine regression tests.
- `docs/` - architecture, product UI notes, roadmap, and commit readiness.
- `scratch/` - local temporary job data. Ignored by git except `.gitkeep`.
- `outputs/` - generated user-facing files. Ignored by git except `.gitkeep`.

## Current Identity

- Product name: Pagewright.
- Local folder: `D:\CodexProjects\pdf-forge`.
- Python package names kept for compatibility: `pdf_forge`, `pdf_forge_api`.
- CLI compatibility command: `pdf-forge`.
- Browser localStorage keys kept for compatibility: `pdfForgeRecent`, `pdfForgeRecentLimit`, `pdfForgePresets`.

## GitHub Status

Public repository: `Martin123132/pagewright`

Default branch: `main`

Current CI: GitHub Actions workflow at `.github/workflows/ci.yml` runs Ruff and Pytest on pushes and pull requests to `main`.

Useful checks:

```powershell
git remote -v
git status --short --branch
```

Before publishing larger changes, review `docs/COMMIT_READINESS.md`, `docs/PUBLIC_PROOF.md`, `CONTRIBUTING.md`, and `SECURITY.md`.

## Run It

```powershell
cd D:\CodexProjects\pdf-forge
$env:TEMP='D:\CodexProjects\pdf-forge\scratch\tmp'
$env:TMP='D:\CodexProjects\pdf-forge\scratch\tmp'
.\.venv\Scripts\python.exe -m uvicorn pdf_forge_api.main:app --host 127.0.0.1 --port 8787 --reload
```

Open:

```text
http://127.0.0.1:8787/
```

## Verify It

```powershell
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe examples\synthetic_proof.py
```
