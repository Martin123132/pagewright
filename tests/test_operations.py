from pathlib import Path

import pytest
from pdf_forge.operations import images_to_pdf, merge_pdfs, rotate_pdf, split_pdf
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


def test_images_to_pdf(tmp_path: Path) -> None:
    image_path = tmp_path / "image.png"
    Image.new("RGB", (100, 100), "white").save(image_path)

    output = images_to_pdf([image_path], tmp_path / "image.pdf")

    assert len(PdfReader(str(output)).pages) == 1
