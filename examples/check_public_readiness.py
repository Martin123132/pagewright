from __future__ import annotations

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]

READINESS_FILES = [
    Path("README.md"),
    Path("SECURITY.md"),
    Path("docs/PROJECT_MAP.md"),
    Path("docs/PUBLIC_PROOF.md"),
    Path("docs/RELEASE_READINESS.md"),
    Path("docs/RELEASE_REVIEW_OUTCOME_TEMPLATE.md"),
    Path(".github/workflows/ci.yml"),
    Path(".github/ISSUE_TEMPLATE/config.yml"),
    Path(".github/ISSUE_TEMPLATE/conversion_bug.yml"),
    Path(".github/ISSUE_TEMPLATE/proof_demo_regression.yml"),
    Path(".github/ISSUE_TEMPLATE/privacy_sensitive_report.yml"),
    Path(".github/ISSUE_TEMPLATE/release_review.yml"),
]

ISSUE_TEMPLATES = {
    "conversion": Path(".github/ISSUE_TEMPLATE/conversion_bug.yml"),
    "proof": Path(".github/ISSUE_TEMPLATE/proof_demo_regression.yml"),
    "privacy": Path(".github/ISSUE_TEMPLATE/privacy_sensitive_report.yml"),
    "release": Path(".github/ISSUE_TEMPLATE/release_review.yml"),
}

SECRET_PATTERNS = {
    "GitHub token": re.compile(r"gh[opsu]_[A-Za-z0-9_]{20,}"),
    "OpenAI-style key": re.compile(r"sk-[A-Za-z0-9_-]{20,}"),
    "AWS access key": re.compile(r"AKIA[0-9A-Z]{16}"),
    "private key block": re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    "Slack token": re.compile(r"xox[baprs]-[A-Za-z0-9-]{20,}"),
    "assigned API key": re.compile(r"(?i)api[_-]?key\s*[:=]\s*['\"][^'\"]+['\"]"),
}


def main() -> None:
    _assert_files_exist(READINESS_FILES)
    _assert_readme_links()
    _assert_project_map()
    _assert_security_policy()
    _assert_issue_templates()
    _assert_ci_wiring()
    _assert_no_secret_patterns()
    print("Public readiness check passed.")


def _assert_files_exist(paths: list[Path]) -> None:
    for path in paths:
        if not (REPO_ROOT / path).is_file():
            raise AssertionError(f"Missing public readiness file: {path}")


def _assert_readme_links() -> None:
    text = _read("README.md")
    _require_all(
        "README.md",
        text,
        [
            "docs/PROJECT_MAP.md",
            "docs/PUBLIC_PROOF.md",
            "docs/RELEASE_READINESS.md",
            "docs/RELEASE_REVIEW_OUTCOME_TEMPLATE.md",
            "CONTRIBUTING.md",
            "SECURITY.md",
            "Issue Intake",
            "release-review",
            "examples\\check_synthetic_proof.py",
            "examples\\check_public_readiness.py",
            "Release Readiness",
        ],
    )


def _assert_project_map() -> None:
    text = _read("docs/PROJECT_MAP.md")
    _require_all(
        "docs/PROJECT_MAP.md",
        text,
        [
            ".github/ISSUE_TEMPLATE/",
            "release-review",
            ".github/workflows/ci.yml",
            "synthetic proof check",
            "public readiness check",
            "examples\\check_public_readiness.py",
            "docs/RELEASE_READINESS.md",
            "docs/RELEASE_REVIEW_OUTCOME_TEMPLATE.md",
        ],
    )
    _assert_release_readiness()
    _assert_release_review_outcome_template()


def _assert_security_policy() -> None:
    text = _read("SECURITY.md").lower()
    _require_all(
        "SECURITY.md",
        text,
        [
            "privacy/security-sensitive issue form",
            "private reporting route",
            "private documents",
            "credentials",
            "private urls",
            "local absolute paths",
        ],
    )


def _assert_release_readiness() -> None:
    text = _read("docs/RELEASE_READINESS.md")
    _require_all(
        "docs/RELEASE_READINESS.md",
        text,
        [
            "Ruff",
            "Pytest",
            "synthetic proof check",
            "public readiness check",
            "sanitized examples only",
            "D-drive",
            "private PDFs",
            "local absolute paths",
            "secrets",
            "outputs/public-proof",
            "pdf_forge",
            "pdf_forge_api",
            "pdf-forge",
        ],
    )


def _assert_release_review_outcome_template() -> None:
    text = _read("docs/RELEASE_REVIEW_OUTCOME_TEMPLATE.md")
    _require_all(
        "docs/RELEASE_REVIEW_OUTCOME_TEMPLATE.md",
        text,
        [
            "GitHub Actions CI run URL",
            "Ruff",
            "Pytest",
            "Synthetic proof check",
            "Public readiness check",
            "Secret-pattern scan",
            "Sanitized examples only",
            "D-drive storage assumptions",
            "pdf_forge",
            "pdf_forge_api",
            "pdf-forge",
            "private PDFs",
            "local absolute paths",
            "secrets",
            "proof outputs",
        ],
    )


def _assert_issue_templates() -> None:
    conversion = _read(ISSUE_TEMPLATES["conversion"]).lower()
    proof = _read(ISSUE_TEMPLATES["proof"]).lower()
    privacy = _read(ISSUE_TEMPLATES["privacy"]).lower()
    release = _read(ISSUE_TEMPLATES["release"]).lower()

    _require_all(
        str(ISSUE_TEMPLATES["conversion"]),
        conversion,
        [
            "operation",
            "synthetic",
            "sanitized",
            "private documents",
            "credentials",
            "local absolute output paths",
            "merge",
            "split",
            "rotate",
            "images-to-pdf",
            "pdf-to-images",
        ],
    )
    _require_all(
        str(ISSUE_TEMPLATES["proof"]),
        proof,
        [
            "synthetic proof",
            "generated demo/proof inputs only",
            "job ids",
            "download urls",
            "merge",
            "split",
            "rotate",
            "images-to-pdf",
            "pdf-to-images",
        ],
    )
    _require_all(
        str(ISSUE_TEMPLATES["privacy"]),
        privacy,
        [
            "github issues are public",
            "do not include private documents",
            "credentials",
            "tokens",
            "private urls",
            "personal data",
            "local absolute paths",
            "private reporting route",
        ],
    )
    _require_all(
        str(ISSUE_TEMPLATES["release"]),
        release,
        [
            "first release review",
            "does not create, tag, or publish a release",
            "ruff passed",
            "pytest passed",
            "synthetic proof check passed",
            "public readiness check passed",
            "sanitized examples only",
            "d-drive storage assumptions",
            "pdf_forge",
            "pdf_forge_api",
            "pdf-forge",
            "private pdfs",
            "local absolute paths",
            "secrets",
            "outputs/public-proof",
            "outputs/public-proof-check",
        ],
    )


def _assert_ci_wiring() -> None:
    text = _read(".github/workflows/ci.yml")
    _require_all(
        ".github/workflows/ci.yml",
        text,
        [
            "python -m ruff check .",
            "python -m pytest",
            "python examples\\check_synthetic_proof.py",
            "python examples\\check_public_readiness.py",
        ],
    )


def _assert_no_secret_patterns() -> None:
    for path in READINESS_FILES:
        text = _read(path)
        for label, pattern in SECRET_PATTERNS.items():
            if pattern.search(text):
                raise AssertionError(f"{path} contains a secret-looking value: {label}")


def _require_all(label: str, text: str, required: list[str]) -> None:
    missing = [value for value in required if value not in text]
    if missing:
        raise AssertionError(f"{label} is missing required public readiness text: {missing}")


def _read(path: str | Path) -> str:
    return (REPO_ROOT / path).read_text(encoding="utf-8")


if __name__ == "__main__":
    main()
