from __future__ import annotations

import os
import re
import tempfile
from dataclasses import dataclass
from pathlib import Path, PurePath
from uuid import uuid4

from fastapi import UploadFile

SAFE_FILENAME_PATTERN = re.compile(r"[^A-Za-z0-9._-]+")


class StorageError(RuntimeError):
    """Raised when a path would violate the local storage policy."""


@dataclass(frozen=True)
class StoragePaths:
    repo_root: Path
    scratch_dir: Path
    outputs_dir: Path

    def resolved(self) -> StoragePaths:
        repo_root = self.repo_root.expanduser().resolve()
        scratch_dir = self.scratch_dir.expanduser().resolve()
        outputs_dir = self.outputs_dir.expanduser().resolve()
        for path in (repo_root, scratch_dir, outputs_dir):
            refuse_c_drive(path)
        return StoragePaths(repo_root=repo_root, scratch_dir=scratch_dir, outputs_dir=outputs_dir)

    def ensure(self) -> StoragePaths:
        paths = self.resolved()
        paths.scratch_dir.mkdir(parents=True, exist_ok=True)
        paths.outputs_dir.mkdir(parents=True, exist_ok=True)
        configure_process_temp(paths)
        return paths


def default_paths() -> StoragePaths:
    repo_root = Path(__file__).resolve().parents[2]
    return StoragePaths(
        repo_root=repo_root,
        scratch_dir=repo_root / "scratch" / "jobs",
        outputs_dir=repo_root / "outputs",
    ).ensure()


def configure_process_temp(paths: StoragePaths) -> Path:
    tmp_dir = paths.scratch_dir / "tmp"
    tmp_dir.mkdir(parents=True, exist_ok=True)
    refuse_c_drive(tmp_dir)
    os.environ["TEMP"] = str(tmp_dir)
    os.environ["TMP"] = str(tmp_dir)
    tempfile.tempdir = str(tmp_dir)
    return tmp_dir


def refuse_c_drive(path: Path) -> None:
    if path.drive.lower() == "c:":
        raise StorageError(f"Refusing to store project data on C: {path}")


def new_job_id() -> str:
    return uuid4().hex


def job_upload_dir(paths: StoragePaths, job_id: str) -> Path:
    return ensure_child(paths.scratch_dir / job_id / "uploads", paths.scratch_dir)


def job_output_dir(paths: StoragePaths, job_id: str) -> Path:
    return ensure_child(paths.outputs_dir / job_id, paths.outputs_dir)


def ensure_child(path: Path, root: Path) -> Path:
    resolved = path.expanduser().resolve()
    root_resolved = root.expanduser().resolve()
    refuse_c_drive(resolved)
    if not resolved.is_relative_to(root_resolved):
        raise StorageError(f"Path escapes storage root: {resolved}")
    resolved.mkdir(parents=True, exist_ok=True)
    return resolved


def output_file_path(paths: StoragePaths, job_id: str, file_name: str) -> Path:
    output_dir = ensure_child(paths.outputs_dir / job_id, paths.outputs_dir)
    return output_dir / sanitize_filename(file_name)


def sanitize_filename(file_name: str | None, fallback: str = "upload") -> str:
    raw_name = PurePath(file_name or fallback).name
    safe_name = SAFE_FILENAME_PATTERN.sub("_", raw_name).strip("._ ")
    return safe_name or fallback


async def save_upload(upload: UploadFile, target_dir: Path, fallback_name: str) -> Path:
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = _unique_path(target_dir / sanitize_filename(upload.filename, fallback_name))
    target_path = target_path.resolve()
    refuse_c_drive(target_path)
    if not target_path.is_relative_to(target_dir.resolve()):
        raise StorageError(f"Upload path escapes target directory: {target_path}")

    with target_path.open("wb") as handle:
        while chunk := await upload.read(1024 * 1024):
            handle.write(chunk)
    await upload.close()
    return target_path


def _unique_path(path: Path) -> Path:
    if not path.exists():
        return path

    for index in range(2, 10_000):
        candidate = path.with_name(f"{path.stem}-{index}{path.suffix}")
        if not candidate.exists():
            return candidate

    raise StorageError(f"Could not find an unused upload path for {path.name}")
