# Pagewright

[![CI](https://github.com/Martin123132/pagewright/actions/workflows/ci.yml/badge.svg)](https://github.com/Martin123132/pagewright/actions/workflows/ci.yml)

Pagewright is a local-first, open-source document toolkit aimed at replacing everyday paid PDF subscriptions for common document work.

The project rule for this machine: keep all project files, scratch data, caches, build artifacts, and generated outputs on `D:`. This repo lives at:

```text
D:\CodexProjects\pdf-forge
```

Need the quick orientation page? See [`docs/PROJECT_MAP.md`](docs/PROJECT_MAP.md). Want a sanitized demo? See [`docs/PUBLIC_PROOF.md`](docs/PUBLIC_PROOF.md). Future release review lives in [`docs/RELEASE_READINESS.md`](docs/RELEASE_READINESS.md). Want to help? See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`SECURITY.md`](SECURITY.md).

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

## Try Pagewright in 60 Seconds

Use the built-in synthetic samples, no private documents required:

```powershell
cd D:\CodexProjects\pdf-forge
$env:TEMP='D:\CodexProjects\pdf-forge\scratch\tmp'
$env:TMP='D:\CodexProjects\pdf-forge\scratch\tmp'
.\.venv\Scripts\python.exe -m uvicorn pdf_forge_api.main:app --host 127.0.0.1 --port 8787
```

Open `http://127.0.0.1:8787/`, choose any route, click **Stage sample**, then **Build**. Outputs land in ignored folders under `D:\CodexProjects\pdf-forge\outputs`. Staged PDFs show a local page-count hint when the browser can read the generated sample or selected file.

### Quick first run (roughly 60 seconds)

1. Choose a route.
2. Click **Stage sample**.
3. Confirm staged files show filename, size, and page count where available (PDFs only).
4. Click **Build** and open the output card in **Outputs**.
5. In the outputs list, use the local cleanup controls to clear stale job folders and keep your `D:\` workspace tidy.

If you drop an unsupported file type, the Mission strip now offers a **guided recovery action** (for example, jump to Images or Extract/Combine routes), so you can recover quickly instead of getting stuck.

### Recovery and cleanup helpers

The demo route also supports quick guided actions:

- **Stage sample / browse / build / outputs** for rapid workflow continuity.
- **Compare routes / switch route** for recovery when you picked the wrong path.
- **New job / output path map** for easy restart.

Generated output folders are always under the project output root and can be reviewed from the **Outputs** card:

- Refresh to see current job folders.
- Delete selected job folders once you are done.
- Delete is constrained to the Pagewright output area only (hard guardrails prevent deleting outside paths or `C:\` folders).

Run tests:

```powershell
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m pytest --basetemp D:\CodexProjects\pdf-forge\scratch\pytest
.\.venv\Scripts\python.exe examples\check_synthetic_proof.py
.\.venv\Scripts\python.exe examples\check_public_readiness.py
```

Run browser-guided recovery smoke (optional, local-only):

```powershell
$env:TEMP='D:\CodexProjects\pdf-forge\scratch\tmp'
$env:TMP='D:\CodexProjects\pdf-forge\scratch\tmp'
$env:npm_config_cache='D:\CodexProjects\pdf-forge\scratch\npm-cache'
$env:PLAYWRIGHT_BROWSERS_PATH='D:\CodexProjects\pdf-forge\scratch\playwright-browsers'
npm.cmd install --prefix D:\CodexProjects\pdf-forge\scratch\playwright-runtime playwright
D:\CodexProjects\pdf-forge\scratch\playwright-runtime\node_modules\.bin\playwright.cmd install chromium
$env:NODE_PATH='D:\CodexProjects\pdf-forge\scratch\playwright-runtime\node_modules'
.\.venv\Scripts\python.exe examples\smoke_recovery.py
```

The smoke check writes its generated fixture, script, and desktop/mobile screenshots under `D:\CodexProjects\pdf-forge\scratch\smoke` and `D:\CodexProjects\pdf-forge\scratch\tmp`; those paths are ignored local evidence.

GitHub Actions runs the same Ruff, Pytest, synthetic proof, and public readiness checks on pushes and pull requests to `main`.

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

## Issue Intake

Use the GitHub issue forms for conversion bugs, proof/demo regressions, release-review issues, and privacy or security-sensitive reports. Keep every report public-safe: synthetic inputs only, no private documents, no credentials, no private URLs, and no local absolute output paths.

## Release Readiness

Before any future public release, review [`docs/RELEASE_READINESS.md`](docs/RELEASE_READINESS.md). Record dry-run outcomes with [`docs/RELEASE_REVIEW_OUTCOME_TEMPLATE.md`](docs/RELEASE_REVIEW_OUTCOME_TEMPLATE.md), or generate an ignored starter outcome:

```powershell
.\.venv\Scripts\python.exe examples\generate_release_review_outcome.py
```

Run the full local release-review dry run with:

```powershell
.\.venv\Scripts\python.exe examples\run_release_review_dry_run.py
```

The generated dry-run report is local-only evidence under ignored `outputs/release-review-dry-run/`. Keep it out of commits and paste only sanitized summaries into public issues or PRs.

These keep the release checklist tied to Ruff, Pytest, synthetic proof, public readiness checks, D-drive storage assumptions, and the rule that proof outputs must not contain private PDFs, local paths, secrets, or real user documents.

The public readiness check keeps those links, templates, proof-check wiring, and obvious secret-pattern scans from drifting:

```powershell
.\.venv\Scripts\python.exe examples\check_public_readiness.py
```
