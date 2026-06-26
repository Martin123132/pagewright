import subprocess
from pathlib import Path

import pytest
from pdf_forge.operations import (
    PdfForgeError,
    compress_pdf,
    images_to_pdf,
    merge_pdfs,
    rotate_pdf,
    split_pdf,
)
from PIL import Image
from pypdf import PdfReader, PdfWriter


def _fixture_pdf(path: Path, pages: int = 1) -> Path:
    writer = PdfWriter()
    for _ in range(pages):
        writer.add_blank_page(width=200, height=200)
    with path.open("wb") as handle:
        writer.write(handle)
    return path


def test_merge_pdfs(tmp_path: Path) -> None:
    first = _fixture_pdf(tmp_path / "first.pdf", pages=1)
    second = _fixture_pdf(tmp_path / "second.pdf", pages=2)

    output = merge_pdfs([first, second], tmp_path / "merged.pdf")

    assert len(PdfReader(str(output)).pages) == 3


def test_split_pdf_page_range(tmp_path: Path) -> None:
    source = _fixture_pdf(tmp_path / "source.pdf", pages=4)

    outputs = split_pdf(source, tmp_path / "split", pages="2-3")

    assert [path.name for path in outputs] == ["source-page-2.pdf", "source-page-3.pdf"]
    assert all(len(PdfReader(str(path)).pages) == 1 for path in outputs)


def test_rotate_pdf_rejects_non_right_angle(tmp_path: Path) -> None:
    source = _fixture_pdf(tmp_path / "source.pdf")

    with pytest.raises(RuntimeError):
        rotate_pdf(source, tmp_path / "rotated.pdf", 45)


def test_compress_pdf_uses_ghostscript_profile(tmp_path: Path) -> None:
    source = _fixture_pdf(tmp_path / "source.pdf")
    output = tmp_path / "compressed.pdf"
    captured: dict[str, list[str]] = {}

    def fake_runner(command: list[str], **_: object) -> subprocess.CompletedProcess[str]:
        captured["command"] = command
        output_arg = next(part for part in command if part.startswith("-sOutputFile="))
        Path(output_arg.removeprefix("-sOutputFile=")).write_bytes(source.read_bytes())
        return subprocess.CompletedProcess(command, 0, "", "")

    result = compress_pdf(
        source,
        output,
        "screen",
        executable="D:/tools/gswin64c.exe",
        runner=fake_runner,
    )

    assert result == output.resolve()
    assert "-dPDFSETTINGS=/screen" in captured["command"]
    assert captured["command"][-1] == str(source.resolve())
    assert len(PdfReader(str(result)).pages) == 1


def test_compress_pdf_requires_ghostscript_when_missing(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    source = _fixture_pdf(tmp_path / "source.pdf")
    monkeypatch.setattr("pdf_forge.operations.shutil.which", lambda _: None)

    with pytest.raises(PdfForgeError) as exc:
        compress_pdf(source, tmp_path / "compressed.pdf", "ebook")

    assert "requires Ghostscript" in str(exc.value)


def test_compress_pdf_rejects_unknown_profile(tmp_path: Path) -> None:
    source = _fixture_pdf(tmp_path / "source.pdf")

    with pytest.raises(PdfForgeError) as exc:
        compress_pdf(source, tmp_path / "compressed.pdf", "tiny")

    assert "Unknown compression profile" in str(exc.value)


def test_images_to_pdf(tmp_path: Path) -> None:
    image_path = tmp_path / "image.png"
    Image.new("RGB", (100, 100), "white").save(image_path)

    output = images_to_pdf([image_path], tmp_path / "image.pdf")

    assert len(PdfReader(str(output)).pages) == 1
