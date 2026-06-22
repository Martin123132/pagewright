# Pagewright Release Readiness

This is a review checklist for a future first public release. It is not a release instruction and does not create or publish a release.

## Required Checks

Run these from the D-drive project checkout before preparing release notes or tags:

```powershell
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe examples\check_synthetic_proof.py
.\.venv\Scripts\python.exe examples\check_public_readiness.py
```

The GitHub Actions CI workflow must also be green on `main` for Ruff, Pytest, the synthetic proof check, and the public readiness check.

## Public-Safe Proof Review

- Use sanitized examples only.
- Use generated synthetic inputs from `app/pdf_forge_api/demo.py`.
- Keep proof outputs in ignored repo-local paths such as `outputs/public-proof` and `outputs/public-proof-check`.
- Do not include private PDFs, real user documents, credentials, tokens, secrets, private URLs, proprietary datasets, or local absolute paths in proof outputs, manifests, screenshots, release notes, issues, or changelogs.
- Confirm `examples/check_synthetic_proof.py` still exposes only stable public-safe manifest fields.
- Confirm `examples/check_public_readiness.py` still scans public readiness files for obvious secret-looking values.

## Compatibility Notes

- Product name: Pagewright.
- Keep internal compatibility package names: `pdf_forge` and `pdf_forge_api`.
- Keep the CLI compatibility command: `pdf-forge`.
- Preserve the D-drive storage assumption for this project machine.

## Release Review Questions

- Are README, project map, public proof, security policy, contributing notes, and issue templates linked and current?
- If release review needs public discussion, use the `release-review` issue template.
- If review outcomes need to be recorded, use `docs/RELEASE_REVIEW_OUTCOME_TEMPLATE.md`.
- Are all examples synthetic or sanitized?
- Are ignored runtime folders still uncommitted?
- Is `main` clean and tracking `origin/main`?
- Is the latest GitHub Actions CI run green?
