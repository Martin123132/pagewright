# Commit Readiness

Date: 2026-06-22

This repository is published on `main` at:

```text
https://github.com/Martin123132/pagewright
```

Use this note before committing or pushing future public changes. It is not a release instruction.

## Current Source Boundary

Tracked source should stay limited to code, tests, docs, project configuration, issue templates,
license files, and the `.gitkeep` placeholders for local storage.

Before committing, run:

```powershell
git status --short --branch
git diff --check
```

Stage only the files that belong to the current task. Do not stage ignored runtime output.

## Local Output Boundary

The repo contains local runtime artifacts that should stay uncommitted:

- `.venv/`, `.pip-cache/`, `.pytest_cache/`, `.ruff_cache/`
- `scratch/*` except `scratch/.gitkeep`
- `outputs/*` except `outputs/.gitkeep`

These are correctly ignored by `.gitignore`; do not destructively clean them as part of commit prep.

The release-review dry-run report is local-only evidence under:

```text
outputs/release-review-dry-run/
```

Keep it out of commits and paste only sanitized summaries into public issues or PRs.

## Storage Rule

Keep all project files, scratch data, caches, build artifacts, and generated outputs on `D:`. This
project lives at:

```text
D:\CodexProjects\pdf-forge
```

The code and docs intentionally reject or warn against project data being stored on `C:`.

## Verification

Lightweight checks run from `D:\CodexProjects\pdf-forge`:

```powershell
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe examples\check_synthetic_proof.py
.\.venv\Scripts\python.exe examples\check_public_readiness.py
```

For release-review dry runs:

```powershell
.\.venv\Scripts\python.exe examples\run_release_review_dry_run.py
```

## Before Push

1. Confirm generated artifacts remain ignored.
2. Confirm no private PDFs, real user documents, local absolute paths, secrets, credentials, tokens,
   private URLs, proprietary data, or sensitive implementation details are included.
3. Run the verification commands relevant to the change.
4. Push only after the local checks pass.
