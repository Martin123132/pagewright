# Pagewright Project Map

Date: 2026-06-22

Pagewright currently lives only on this machine at:

```text
D:\CodexProjects\pdf-forge
```

There is a local git repository on `main`, but no commits and no GitHub remote yet.

## What Lives Where

- `app/pdf_forge_api/` - FastAPI app, storage policy, demo generators, and static workbench UI.
- `app/pdf_forge_api/static/` - Pagewright browser UI: routes, staging, settings, presets, recent rail, keyboard flow.
- `engine/pdf_forge/` - PDF operation engine and CLI implementation.
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

No GitHub repository is configured yet.

Useful checks:

```powershell
git remote -v
git status --short --branch
```

Before publishing, review `docs/COMMIT_READINESS.md`.

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
```
