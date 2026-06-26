from __future__ import annotations

from pathlib import Path
from typing import Annotated

import typer

from pdf_forge.operations import (
    COMPRESSION_PROFILES,
    compress_pdf,
    images_to_pdf,
    merge_pdfs,
    pdf_to_images,
    rotate_pdf,
    split_pdf,
)

app = typer.Typer(help="Local-first PDF tools.")


@app.command()
def merge(
    output: Annotated[Path, typer.Option("--output", "-o", help="Output PDF path.")],
    inputs: Annotated[list[Path], typer.Argument(help="Input PDF paths.")],
) -> None:
    """Merge multiple PDFs into one document."""

    typer.echo(merge_pdfs(inputs, output))


@app.command()
def split(
    input_pdf: Annotated[Path, typer.Argument(help="Input PDF path.")],
    output_dir: Annotated[Path, typer.Option("--output-dir", "-o", help="Output directory.")],
    pages: Annotated[
        str | None,
        typer.Option("--pages", "-p", help='Optional 1-based pages or ranges, such as "1,3-5".'),
    ] = None,
) -> None:
    """Split a PDF into single-page files."""

    for path in split_pdf(input_pdf, output_dir, pages):
        typer.echo(path)


@app.command()
def rotate(
    input_pdf: Annotated[Path, typer.Argument(help="Input PDF path.")],
    output: Annotated[Path, typer.Option("--output", "-o", help="Output PDF path.")],
    degrees: Annotated[int, typer.Option("--degrees", "-d", help="Rotation in degrees.")],
) -> None:
    """Rotate every page in a PDF."""

    typer.echo(rotate_pdf(input_pdf, output, degrees))


@app.command()
def compress(
    input_pdf: Annotated[Path, typer.Argument(help="Input PDF path.")],
    output: Annotated[Path, typer.Option("--output", "-o", help="Output PDF path.")],
    profile: Annotated[
        str,
        typer.Option(
            "--profile",
            "-p",
            help=f"Compression profile: {', '.join(sorted(COMPRESSION_PROFILES))}.",
        ),
    ] = "ebook",
) -> None:
    """Compress a PDF with Ghostscript when available."""

    typer.echo(compress_pdf(input_pdf, output, profile))


@app.command("images-to-pdf")
def images_to_pdf_command(
    output: Annotated[Path, typer.Option("--output", "-o", help="Output PDF path.")],
    images: Annotated[list[Path], typer.Argument(help="Input image paths.")],
) -> None:
    """Convert one or more images into a PDF."""

    typer.echo(images_to_pdf(images, output))


@app.command("pdf-to-images")
def pdf_to_images_command(
    input_pdf: Annotated[Path, typer.Argument(help="Input PDF path.")],
    output_dir: Annotated[Path, typer.Option("--output-dir", "-o", help="Output directory.")],
    dpi: Annotated[int, typer.Option("--dpi", help="Render DPI.")] = 144,
) -> None:
    """Render PDF pages to PNG images."""

    for path in pdf_to_images(input_pdf, output_dir, dpi):
        typer.echo(path)
