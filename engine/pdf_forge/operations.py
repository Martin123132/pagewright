from __future__ import annotations

import os
import shutil
import subprocess
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

import fitz
from PIL import Image
from pypdf import PdfReader, PdfWriter

COMPRESSION_PROFILES = {
    "screen": "/screen",
    "ebook": "/ebook",
    "printer": "/printer",
    "prepress": "/prepress",
}
GHOSTSCRIPT_COMMANDS = ("gswin64c", "gswin32c", "gs")
GHOSTSCRIPT_PATH_ENV = "PAGEWRIGHT_GHOSTSCRIPT_PATH"


class PdfForgeError(RuntimeError):
    """Raised when a Pagewright operation cannot be completed."""


@dataclass(frozen=True)
class GhostscriptStatus:
    available: bool
    command: str | None
    source: str | None
    message: str


def _path(path: str | Path) -> Path:
    resolved = Path(path).expanduser().resolve()
    if str(resolved).lower().startswith("c:\\"):
        raise PdfForgeError(f"Refusing to use C: path: {resolved}")
    return resolved


def _ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def merge_pdfs(inputs: list[str | Path], output: str | Path) -> Path:
    if not inputs:
        raise PdfForgeError("At least one input PDF is required.")

    writer = PdfWriter()
    for input_path in inputs:
        reader = PdfReader(str(_path(input_path)))
        for page in reader.pages:
            writer.add_page(page)

    output_path = _path(output)
    _ensure_parent(output_path)
    with output_path.open("wb") as handle:
        writer.write(handle)
    return output_path


def split_pdf(
    input_pdf: str | Path,
    output_dir: str | Path,
    pages: str | None = None,
    output_stem: str | None = None,
) -> list[Path]:
    input_path = _path(input_pdf)
    target_dir = _path(output_dir)
    target_dir.mkdir(parents=True, exist_ok=True)
    stem = output_stem or input_path.stem

    reader = PdfReader(str(input_path))
    selected_pages = _parse_pages(pages, len(reader.pages)) if pages else range(len(reader.pages))
    written: list[Path] = []

    for page_index in selected_pages:
        writer = PdfWriter()
        writer.add_page(reader.pages[page_index])
        output_path = target_dir / f"{stem}-page-{page_index + 1}.pdf"
        with output_path.open("wb") as handle:
            writer.write(handle)
        written.append(output_path)

    return written


def rotate_pdf(input_pdf: str | Path, output: str | Path, degrees: int) -> Path:
    if degrees % 90 != 0:
        raise PdfForgeError("Rotation degrees must be a multiple of 90.")

    reader = PdfReader(str(_path(input_pdf)))
    writer = PdfWriter()
    for page in reader.pages:
        page.rotate(degrees)
        writer.add_page(page)

    output_path = _path(output)
    _ensure_parent(output_path)
    with output_path.open("wb") as handle:
        writer.write(handle)
    return output_path


def compress_pdf(
    input_pdf: str | Path,
    output: str | Path,
    profile: str = "ebook",
    *,
    executable: str | Path | None = None,
    runner: Callable[..., subprocess.CompletedProcess[str]] = subprocess.run,
) -> Path:
    """Compress a PDF with Ghostscript using a named quality profile."""

    profile_key = profile.lower().strip()
    pdf_settings = COMPRESSION_PROFILES.get(profile_key)
    if not pdf_settings:
        valid_profiles = ", ".join(sorted(COMPRESSION_PROFILES))
        raise PdfForgeError(f"Unknown compression profile. Expected one of: {valid_profiles}.")

    input_path = _path(input_pdf)
    output_path = _path(output)
    if input_path == output_path:
        raise PdfForgeError("Compression output must be a different file from the input PDF.")

    command_path = str(executable or _find_ghostscript())
    _ensure_parent(output_path)
    command = [
        command_path,
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        f"-dPDFSETTINGS={pdf_settings}",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",
        f"-sOutputFile={output_path}",
        str(input_path),
    ]
    result = runner(command, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        detail = (result.stderr or result.stdout or "Ghostscript failed.").strip()
        raise PdfForgeError(f"Compression failed: {detail}")
    if not output_path.exists() or output_path.stat().st_size == 0:
        raise PdfForgeError("Compression did not create an output PDF.")
    return output_path


def images_to_pdf(images: list[str | Path], output: str | Path) -> Path:
    if not images:
        raise PdfForgeError("At least one image is required.")

    opened_images: list[Image.Image] = []
    try:
        Image.init()
        for image_path in images:
            image = Image.open(_path(image_path))
            if image.mode != "RGB":
                image = image.convert("RGB")
            opened_images.append(image)

        output_path = _path(output)
        _ensure_parent(output_path)
        first, *rest = opened_images
        first.save(output_path, save_all=True, append_images=rest)
        return output_path
    finally:
        for image in opened_images:
            image.close()


def pdf_to_images(
    input_pdf: str | Path,
    output_dir: str | Path,
    dpi: int = 144,
    output_stem: str | None = None,
) -> list[Path]:
    if dpi <= 0:
        raise PdfForgeError("DPI must be positive.")

    input_path = _path(input_pdf)
    target_dir = _path(output_dir)
    target_dir.mkdir(parents=True, exist_ok=True)
    stem = output_stem or input_path.stem

    zoom = dpi / 72
    matrix = fitz.Matrix(zoom, zoom)
    written: list[Path] = []

    with fitz.open(input_path) as document:
        for page_index in range(document.page_count):
            page = document.load_page(page_index)
            pixmap = page.get_pixmap(matrix=matrix, alpha=False)
            output_path = target_dir / f"{stem}-page-{page_index + 1}.png"
            pixmap.save(output_path)
            written.append(output_path)

    return written


def ghostscript_status() -> GhostscriptStatus:
    command, source, message = _ghostscript_candidate()
    if command:
        return GhostscriptStatus(
            available=True,
            command=command,
            source=source,
            message=f"Ghostscript is available from {source}.",
        )
    return GhostscriptStatus(available=False, command=None, source=source, message=message)


def _find_ghostscript() -> str:
    command, _source, message = _ghostscript_candidate()
    if command:
        return command
    raise PdfForgeError(message)


def _ghostscript_candidate() -> tuple[str | None, str | None, str]:
    configured = os.environ.get(GHOSTSCRIPT_PATH_ENV, "").strip()
    if configured:
        configured_path = Path(configured).expanduser()
        if configured_path.exists() and configured_path.is_file():
            return str(configured_path.resolve()), GHOSTSCRIPT_PATH_ENV, ""

        executable = shutil.which(configured)
        if executable:
            return executable, GHOSTSCRIPT_PATH_ENV, ""

        return (
            None,
            GHOSTSCRIPT_PATH_ENV,
            f"{GHOSTSCRIPT_PATH_ENV} points to a missing Ghostscript executable. "
            "Set it to gswin64c.exe, gswin32c.exe, or gs, or remove it to use PATH lookup.",
        )

    for command in GHOSTSCRIPT_COMMANDS:
        executable = shutil.which(command)
        if executable:
            return executable, "PATH", ""
    commands = ", ".join(GHOSTSCRIPT_COMMANDS)
    return (
        None,
        "PATH",
        "PDF compression requires Ghostscript. Install Ghostscript and ensure one of "
        f"{commands} is available on PATH, or set {GHOSTSCRIPT_PATH_ENV} to the executable."
    )


def _parse_pages(spec: str, page_count: int) -> list[int]:
    indexes: list[int] = []
    for part in spec.split(","):
        token = part.strip()
        if not token:
            continue
        if "-" in token:
            start_text, end_text = token.split("-", 1)
            start = int(start_text)
            end = int(end_text)
            if start > end:
                raise PdfForgeError(f"Invalid descending page range: {token}")
            indexes.extend(range(start - 1, end))
        else:
            indexes.append(int(token) - 1)

    for index in indexes:
        if index < 0 or index >= page_count:
            raise PdfForgeError(f"Page {index + 1} is outside the document range 1-{page_count}.")

    return indexes
