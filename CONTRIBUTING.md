# Contributing to Pagewright

Thanks for helping make everyday document tools free for personal and non-commercial use, local-first, and easy to run.

Pagewright is source-available under the PolyForm Noncommercial License 1.0.0. Commercial use requires a separate written licence from TWO HANDS NETWORK LTD. Before contributing, read [`LICENSE`](LICENSE), [`NOTICE.md`](NOTICE.md), and [`COMMERCIAL-LICENSE.md`](COMMERCIAL-LICENSE.md), and do not submit code or docs you cannot contribute under this repo's licence posture.

## Development Setup

Keep local environments, scratch data, and generated outputs inside the project directory. On this machine the project lives on `D:`:

```powershell
cd D:\CodexProjects\pdf-forge
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".[dev,api]"
```

Start the local app with the D-safe launcher:

```powershell
.\scripts\start_pagewright.ps1
```

Run quality checks before opening a pull request:

```powershell
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m pytest
```

On other platforms, use the same package extras with your local Python environment:

```bash
python -m pip install -e ".[dev,api]"
python -m ruff check .
python -m pytest
```

## Project Orientation

- Start with the [project map](docs/PROJECT_MAP.md).
- Keep the public repo free of secrets, private URLs, proprietary material, and real user documents.
- The product name is Pagewright. Internal package and CLI compatibility names such as `pdf_forge`, `pdf_forge_api`, and `pdf-forge` are intentionally retained for now.

## Pull Requests

Please keep changes focused, include tests for behavior changes, update docs when user-facing setup or workflows change, and keep public reports/examples synthetic and sanitized.
