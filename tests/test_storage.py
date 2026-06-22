from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest
from pdf_forge_api.storage import (
    StorageError,
    StoragePaths,
    configure_process_temp,
    default_paths,
    ensure_child,
)


def test_default_paths_stay_repo_local_and_off_c_drive() -> None:
    paths = default_paths()

    assert paths.repo_root == Path(__file__).resolve().parents[1]
    assert paths.scratch_dir == paths.repo_root / "scratch" / "jobs"
    assert paths.outputs_dir == paths.repo_root / "outputs"
    assert paths.repo_root.drive.lower() != "c:"
    assert paths.scratch_dir.drive.lower() != "c:"
    assert paths.outputs_dir.drive.lower() != "c:"


def test_storage_paths_refuse_c_drive_roots() -> None:
    with pytest.raises(StorageError, match="Refusing to store project data on C:"):
        StoragePaths(
            repo_root=Path("C:/pagewright"),
            scratch_dir=Path("C:/pagewright/scratch"),
            outputs_dir=Path("C:/pagewright/outputs"),
        ).resolved()


def test_configure_process_temp_uses_scratch_tmp(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("TEMP", "before-temp")
    monkeypatch.setenv("TMP", "before-tmp")
    monkeypatch.setattr(tempfile, "tempdir", None)
    paths = StoragePaths(
        repo_root=tmp_path,
        scratch_dir=tmp_path / "scratch",
        outputs_dir=tmp_path / "outputs",
    ).ensure()

    tmp_dir = configure_process_temp(paths)

    assert tmp_dir == paths.scratch_dir / "tmp"
    assert tmp_dir.is_dir()
    assert tmp_dir.drive.lower() != "c:"
    assert os.environ["TEMP"] == str(tmp_dir)
    assert os.environ["TMP"] == str(tmp_dir)
    assert tempfile.tempdir == str(tmp_dir)


def test_ensure_child_rejects_paths_outside_storage_root(tmp_path: Path) -> None:
    root = tmp_path / "scratch"

    with pytest.raises(StorageError, match="Path escapes storage root"):
        ensure_child(tmp_path / "elsewhere", root)
