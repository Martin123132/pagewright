from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from check_public_readiness import READINESS_FILES, REPO_ROOT, SECRET_PATTERNS


def main() -> None:
    steps = [
        ("Ruff", [sys.executable, "-m", "ruff", "check", "."]),
        ("Pytest", [sys.executable, "-m", "pytest"]),
        ("Synthetic proof check", [sys.executable, "examples/check_synthetic_proof.py"]),
        ("Public readiness check", [sys.executable, "examples/check_public_readiness.py"]),
    ]
    for label, command in steps:
        _run(label, command)

    _run_secret_pattern_scan()
    _run(
        "Release review outcome generator",
        [sys.executable, "examples/generate_release_review_outcome.py"],
    )
    print("Release-review dry run completed without creating a release, tag, or publish.")


def _run(label: str, command: list[str]) -> None:
    print(f"\n== {label} ==")
    subprocess.run(command, cwd=REPO_ROOT, check=True)


def _run_secret_pattern_scan() -> None:
    print("\n== Secret-pattern scan ==")
    for path in READINESS_FILES:
        text = (REPO_ROOT / path).read_text(encoding="utf-8")
        for label, pattern in SECRET_PATTERNS.items():
            if pattern.search(text):
                raise RuntimeError(f"{Path(path)} contains a secret-looking value: {label}")
    print("Secret-pattern scan passed.")


if __name__ == "__main__":
    main()
