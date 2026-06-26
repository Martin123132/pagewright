from __future__ import annotations

from typing import Any

from synthetic_proof import PROOF_OPERATIONS, run_synthetic_proof

CHECK_PROOF_NAME = "public-proof-check"
TOP_LEVEL_FIELDS = {"proof", "privacy", "operations"}
OPERATION_FIELDS = {"operation", "files", "bundle"}
FILE_FIELDS = {"file_name", "size_bytes"}
BUNDLE_FIELDS = {"file_name", "size_bytes", "file_count"}
BANNED_FIELDS = {"path", "download_url", "job_id", "scratch_dir", "outputs_dir"}


def main() -> None:
    manifest = run_synthetic_proof(proof_name=CHECK_PROOF_NAME, emit=False)
    _assert_public_manifest(manifest)
    print(f"Synthetic proof check passed for: {', '.join(PROOF_OPERATIONS)}")


def _assert_public_manifest(manifest: dict[str, Any]) -> None:
    _assert_fields("manifest", set(manifest), TOP_LEVEL_FIELDS)
    _assert_no_banned_fields(manifest)
    if manifest["proof"] != "Pagewright synthetic public demo":
        raise AssertionError("Unexpected proof label.")
    if "synthetic inputs" not in manifest["privacy"]:
        raise AssertionError("Privacy note must identify synthetic inputs.")

    operations = manifest["operations"]
    if not isinstance(operations, list):
        raise AssertionError("Manifest operations must be a list.")

    operation_names = [operation["operation"] for operation in operations]
    if operation_names != PROOF_OPERATIONS:
        raise AssertionError(
            f"Proof operations drifted: expected {PROOF_OPERATIONS}, got {operation_names}"
        )

    for operation in operations:
        allowed_fields = (
            OPERATION_FIELDS if "bundle" in operation else OPERATION_FIELDS - {"bundle"}
        )
        _assert_fields(operation["operation"], set(operation), allowed_fields)
        _assert_files(operation["operation"], operation["files"])
        if "bundle" in operation:
            _assert_bundle(operation["operation"], operation["bundle"])


def _assert_files(operation: str, files: list[dict[str, Any]]) -> None:
    if not isinstance(files, list) or not files:
        raise AssertionError(f"{operation} must include at least one public output file.")
    for file in files:
        _assert_fields(f"{operation} file", set(file), FILE_FIELDS)
        _assert_file_name(file["file_name"])
        _assert_positive_int(f"{operation} size_bytes", file["size_bytes"])


def _assert_bundle(operation: str, bundle: dict[str, Any]) -> None:
    _assert_fields(f"{operation} bundle", set(bundle), BUNDLE_FIELDS)
    _assert_file_name(bundle["file_name"])
    _assert_positive_int(f"{operation} bundle size_bytes", bundle["size_bytes"])
    _assert_positive_int(f"{operation} bundle file_count", bundle["file_count"])


def _assert_fields(label: str, actual: set[str], expected: set[str]) -> None:
    if actual != expected:
        raise AssertionError(
            f"{label} fields drifted: expected {sorted(expected)}, got {sorted(actual)}"
        )


def _assert_file_name(file_name: str) -> None:
    if not isinstance(file_name, str) or not file_name:
        raise AssertionError("Output file_name must be a non-empty string.")
    if "/" in file_name or "\\" in file_name or ":" in file_name:
        raise AssertionError(f"Output file_name must not include path details: {file_name}")


def _assert_positive_int(label: str, value: Any) -> None:
    if not isinstance(value, int) or value <= 0:
        raise AssertionError(f"{label} must be a positive integer.")


def _assert_no_banned_fields(value: Any) -> None:
    if isinstance(value, dict):
        banned = BANNED_FIELDS.intersection(value)
        if banned:
            raise AssertionError(f"Manifest includes private or volatile fields: {sorted(banned)}")
        for child in value.values():
            _assert_no_banned_fields(child)
    elif isinstance(value, list):
        for child in value:
            _assert_no_banned_fields(child)


if __name__ == "__main__":
    main()
