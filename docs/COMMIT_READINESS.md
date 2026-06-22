# Commit Readiness

Date: 2026-06-22

This repository is initialized on `main` with no commits yet. A clean initial commit should include
the source tree, docs, tests, config, license, and the `.gitkeep` placeholders for local storage.

## Current Source Candidate

`git ls-files --others --exclude-standard` currently reports these unignored paths:

- `.gitignore`
- `LICENSE`
- `README.md`
- `pyproject.toml`
- `app/`
- `docs/`
- `engine/`
- `tests/`
- `scratch/.gitkeep`
- `outputs/.gitkeep`

The Pagewright rebrand and route Compare tray work are present in the app and tests. Preserve these
files in the initial commit unless a later reviewer explicitly asks for a scoped product change.

## Local Output Boundary

The repo contains local runtime artifacts that should stay uncommitted:

- `.venv/`, `.pip-cache/`, `.pytest_cache/`, `.ruff_cache/`
- `scratch/*` except `scratch/.gitkeep`
- `outputs/*` except `outputs/.gitkeep`

Observed local artifacts include 58 scratch job directories, 57 output job directories, API logs,
Compare QA screenshots, generated PDFs, generated PNGs, and zip bundles. These are correctly ignored
by `.gitignore`; do not destructively clean them as part of commit prep.

## Verification

Lightweight checks run from `D:\CodexProjects\pdf-forge`:

```powershell
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m pytest
```

Results:

- Ruff: passed.
- Pytest: 16 passed.
- Warning: one dependency deprecation warning from `fastapi.testclient` importing Starlette's
  `TestClient`; no test failure.

## Before Initial Commit

1. Review `git ls-files --others --exclude-standard` and confirm only source, docs, tests,
   configuration, license, and `.gitkeep` placeholders appear.
2. Stage the unignored source candidate set only.
3. Leave ignored runtime output in place unless a separate cleanup task explicitly asks for it.
4. Do not publish or push until the initial commit contents are reviewed.
