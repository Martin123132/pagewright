from __future__ import annotations

import shutil
from collections.abc import Callable
from datetime import UTC, datetime
from pathlib import Path
from typing import Annotated
from urllib.parse import quote
from zipfile import ZIP_DEFLATED, ZipFile

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pdf_forge.operations import (
    COMPRESSION_PROFILES,
    PdfForgeError,
    compress_pdf,
    images_to_pdf,
    merge_pdfs,
    pdf_to_images,
    rotate_pdf,
    split_pdf,
)

from pdf_forge_api.demo import create_demo_image, create_demo_pdf
from pdf_forge_api.models import (
    HealthResponse,
    JobResult,
    OutputBundle,
    OutputCleanupResult,
    OutputFile,
    OutputJobList,
    OutputJobSummary,
)
from pdf_forge_api.storage import (
    StorageError,
    StoragePaths,
    default_paths,
    job_output_dir,
    job_upload_dir,
    new_job_id,
    sanitize_filename,
    save_upload,
)

OPERATIONS = ["merge", "split", "rotate", "compress", "images-to-pdf", "pdf-to-images"]
IMAGE_EXTENSIONS = {".jpeg", ".jpg", ".png", ".webp"}
PDF_EXTENSIONS = {".pdf"}


def create_app(paths: StoragePaths | None = None) -> FastAPI:
    storage_paths = (paths or default_paths()).ensure()
    app = FastAPI(title="Pagewright API", version="0.1.0")
    app.state.storage_paths = storage_paths
    static_dir = Path(__file__).parent / "static"
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

    @app.get("/", include_in_schema=False)
    def index() -> FileResponse:
        return FileResponse(static_dir / "index.html")

    @app.get("/health", response_model=HealthResponse)
    def health() -> HealthResponse:
        return HealthResponse(
            status="ok",
            scratch_dir=str(storage_paths.scratch_dir),
            outputs_dir=str(storage_paths.outputs_dir),
            operations=OPERATIONS,
        )

    @app.post("/jobs/merge", response_model=JobResult)
    async def merge_job(
        files: Annotated[list[UploadFile], File(description="PDF files to merge.")],
        output_name: Annotated[str | None, Form(description="Optional output file name.")] = None,
    ) -> JobResult:
        job_id, upload_dir, output_dir = _prepare_job(storage_paths)
        inputs = await _save_uploads(
            files,
            upload_dir,
            "input.pdf",
            allowed_extensions=PDF_EXTENSIONS,
            min_files=2,
        )
        output = _named_output(output_dir, output_name, "merged", ".pdf")
        return _run_job("merge", job_id, storage_paths, lambda: [merge_pdfs(inputs, output)])

    @app.post("/jobs/split", response_model=JobResult)
    async def split_job(
        file: Annotated[UploadFile, File(description="PDF file to split.")],
        pages: Annotated[
            str | None,
            Form(description='Optional 1-based pages or ranges, such as "1,3-5".'),
        ] = None,
        output_name: Annotated[
            str | None,
            Form(description="Optional output file name stem."),
        ] = None,
    ) -> JobResult:
        job_id, upload_dir, output_dir = _prepare_job(storage_paths)
        input_pdf = await _save_single_upload(
            file,
            upload_dir,
            "input.pdf",
            allowed_extensions=PDF_EXTENSIONS,
        )
        output_stem = _output_stem(output_name, Path(input_pdf).stem)
        return _run_job(
            "split",
            job_id,
            storage_paths,
            lambda: split_pdf(input_pdf, output_dir, pages, output_stem),
            bundle_name=_bundle_file_name(output_name, "split"),
        )

    @app.post("/jobs/rotate", response_model=JobResult)
    async def rotate_job(
        file: Annotated[UploadFile, File(description="PDF file to rotate.")],
        degrees: Annotated[int, Form(description="Rotation in degrees. Must be a multiple of 90.")],
        output_name: Annotated[str | None, Form(description="Optional output file name.")] = None,
    ) -> JobResult:
        job_id, upload_dir, output_dir = _prepare_job(storage_paths)
        input_pdf = await _save_single_upload(
            file,
            upload_dir,
            "input.pdf",
            allowed_extensions=PDF_EXTENSIONS,
        )
        output = _named_output(
            output_dir,
            output_name,
            f"{Path(input_pdf).stem}-rotated",
            ".pdf",
        )
        return _run_job(
            "rotate",
            job_id,
            storage_paths,
            lambda: [rotate_pdf(input_pdf, output, degrees)],
        )

    @app.post("/jobs/compress", response_model=JobResult)
    async def compress_job(
        file: Annotated[UploadFile, File(description="PDF file to compress.")],
        profile: Annotated[
            str,
            Form(description="Compression profile: screen, ebook, printer, or prepress."),
        ] = "ebook",
        output_name: Annotated[str | None, Form(description="Optional output file name.")] = None,
    ) -> JobResult:
        job_id, upload_dir, output_dir = _prepare_job(storage_paths)
        input_pdf = await _save_single_upload(
            file,
            upload_dir,
            "input.pdf",
            allowed_extensions=PDF_EXTENSIONS,
        )
        profile_key = _compression_profile(profile)
        output = _named_output(
            output_dir,
            output_name,
            f"{Path(input_pdf).stem}-compressed",
            ".pdf",
        )
        return _run_job(
            "compress",
            job_id,
            storage_paths,
            lambda: [compress_pdf(input_pdf, output, profile_key)],
        )

    @app.post("/jobs/images-to-pdf", response_model=JobResult)
    async def images_to_pdf_job(
        files: Annotated[list[UploadFile], File(description="Images to combine into one PDF.")],
        output_name: Annotated[str | None, Form(description="Optional output file name.")] = None,
    ) -> JobResult:
        job_id, upload_dir, output_dir = _prepare_job(storage_paths)
        inputs = await _save_uploads(
            files,
            upload_dir,
            "image.png",
            allowed_extensions=IMAGE_EXTENSIONS,
        )
        output = _named_output(output_dir, output_name, "images", ".pdf")
        return _run_job(
            "images-to-pdf",
            job_id,
            storage_paths,
            lambda: [images_to_pdf(inputs, output)],
        )

    @app.post("/jobs/pdf-to-images", response_model=JobResult)
    async def pdf_to_images_job(
        file: Annotated[UploadFile, File(description="PDF file to render.")],
        dpi: Annotated[int, Form(description="Render DPI.")] = 144,
        output_name: Annotated[
            str | None,
            Form(description="Optional output file name stem."),
        ] = None,
    ) -> JobResult:
        job_id, upload_dir, output_dir = _prepare_job(storage_paths)
        input_pdf = await _save_single_upload(
            file,
            upload_dir,
            "input.pdf",
            allowed_extensions=PDF_EXTENSIONS,
        )
        output_stem = _output_stem(output_name, Path(input_pdf).stem)
        return _run_job(
            "pdf-to-images",
            job_id,
            storage_paths,
            lambda: pdf_to_images(input_pdf, output_dir, dpi, output_stem),
            bundle_name=_bundle_file_name(output_name, "pdf-to-images"),
        )

    @app.post("/jobs/demo/{operation}", response_model=JobResult)
    def demo_job(operation: str) -> JobResult:
        if operation not in OPERATIONS:
            raise HTTPException(status_code=404, detail="Unknown demo operation.")

        job_id, upload_dir, output_dir = _prepare_job(storage_paths)
        return _run_demo_job(operation, job_id, upload_dir, output_dir, storage_paths)

    @app.get("/outputs/jobs", response_model=OutputJobList)
    def list_output_jobs(request: Request) -> OutputJobList:
        paths: StoragePaths = request.app.state.storage_paths
        return OutputJobList(
            outputs_dir=str(paths.outputs_dir),
            jobs=_list_output_jobs(paths),
        )

    @app.delete("/outputs/jobs/{job_id}", response_model=OutputCleanupResult)
    def delete_output_job(request: Request, job_id: str) -> OutputCleanupResult:
        paths: StoragePaths = request.app.state.storage_paths
        target_dir = _output_job_dir(paths, job_id)
        shutil.rmtree(target_dir)
        return OutputCleanupResult(job_id=job_id, deleted=True)

    @app.get("/outputs/{job_id}/{file_name}")
    def download_output(request: Request, job_id: str, file_name: str) -> FileResponse:
        paths: StoragePaths = request.app.state.storage_paths
        try:
            output_dir = _output_job_dir(paths, job_id)
        except HTTPException as exc:
            if exc.status_code == 404:
                raise HTTPException(status_code=404, detail="Output file not found.") from exc
            raise
        target_path = (output_dir / sanitize_filename(file_name)).resolve()
        if target_path.parent != output_dir:
            raise HTTPException(status_code=404, detail="Output file not found.")
        if not target_path.exists() or not target_path.is_file():
            raise HTTPException(status_code=404, detail="Output file not found.")
        media_type = "application/zip" if target_path.suffix == ".zip" else None
        return FileResponse(target_path, filename=target_path.name, media_type=media_type)

    return app


def _run_demo_job(
    operation: str,
    job_id: str,
    upload_dir: Path,
    output_dir: Path,
    paths: StoragePaths,
) -> JobResult:
    if operation == "merge":
        inputs = [
            create_demo_pdf(upload_dir / "field-guide.pdf", "Field Guide", pages=1),
            create_demo_pdf(upload_dir / "launch-plan.pdf", "Launch Plan", pages=2),
        ]
        return _run_job(
            operation,
            job_id,
            paths,
            lambda: [merge_pdfs(inputs, output_dir / "merged-demo.pdf")],
        )

    if operation == "split":
        input_pdf = create_demo_pdf(upload_dir / "workbook.pdf", "Split Workbook", pages=4)
        return _run_job(
            operation,
            job_id,
            paths,
            lambda: split_pdf(input_pdf, output_dir, "1-2"),
        )

    if operation == "rotate":
        input_pdf = create_demo_pdf(upload_dir / "sideways-note.pdf", "Rotate Demo", pages=1)
        return _run_job(
            operation,
            job_id,
            paths,
            lambda: [rotate_pdf(input_pdf, output_dir / "rotated-demo.pdf", 90)],
        )

    if operation == "compress":
        input_pdf = create_demo_pdf(
            upload_dir / "compression-source.pdf",
            "Compression Demo",
            pages=3,
        )
        return _run_job(
            operation,
            job_id,
            paths,
            lambda: [compress_pdf(input_pdf, output_dir / "compressed-demo.pdf", "ebook")],
        )

    if operation == "images-to-pdf":
        inputs = [
            create_demo_image(upload_dir / "cover.png", "Cover", "#f4ded7"),
            create_demo_image(upload_dir / "diagram.png", "Diagram", "#e6efe8"),
            create_demo_image(upload_dir / "notes.png", "Notes", "#e8edf5"),
        ]
        return _run_job(
            operation,
            job_id,
            paths,
            lambda: [images_to_pdf(inputs, output_dir / "images-demo.pdf")],
        )

    if operation == "pdf-to-images":
        input_pdf = create_demo_pdf(upload_dir / "render-source.pdf", "Render Demo", pages=2)
        return _run_job(
            operation,
            job_id,
            paths,
            lambda: pdf_to_images(input_pdf, output_dir, 120),
        )

    raise HTTPException(status_code=404, detail="Unknown demo operation.")


def _prepare_job(paths: StoragePaths) -> tuple[str, Path, Path]:
    job_id = new_job_id()
    return job_id, job_upload_dir(paths, job_id), job_output_dir(paths, job_id)


def _list_output_jobs(paths: StoragePaths) -> list[OutputJobSummary]:
    outputs_dir = paths.outputs_dir.resolve()
    jobs: list[OutputJobSummary] = []
    for child in outputs_dir.iterdir():
        if child.name.startswith(".") or not child.is_dir() or child.is_symlink():
            continue
        jobs.append(_output_job_summary(outputs_dir, child))
    return sorted(jobs, key=lambda job: job.modified_at, reverse=True)


def _output_job_summary(outputs_dir: Path, job_dir: Path) -> OutputJobSummary:
    file_count = 0
    size_bytes = 0
    modified_at = job_dir.stat().st_mtime
    for path in job_dir.rglob("*"):
        if path.is_symlink() or not path.is_file():
            continue
        stat = path.stat()
        file_count += 1
        size_bytes += stat.st_size
        modified_at = max(modified_at, stat.st_mtime)
    relative_job = job_dir.relative_to(outputs_dir).as_posix()
    return OutputJobSummary(
        job_id=relative_job,
        file_count=file_count,
        size_bytes=size_bytes,
        modified_at=datetime.fromtimestamp(modified_at, UTC).isoformat(),
    )


def _output_job_dir(paths: StoragePaths, job_id: str) -> Path:
    if not job_id or job_id in {".", ".."} or Path(job_id).name != job_id:
        raise HTTPException(status_code=400, detail="Invalid output job id.")

    outputs_dir = paths.outputs_dir.resolve()
    if outputs_dir.drive.lower() == "c:":
        raise HTTPException(status_code=400, detail="Refusing to clean outputs from C:.")

    target_dir = (outputs_dir / job_id).resolve()
    if target_dir == outputs_dir or target_dir.parent != outputs_dir:
        raise HTTPException(status_code=400, detail="Output cleanup target escaped storage root.")
    if not target_dir.exists():
        raise HTTPException(status_code=404, detail="Output job not found.")
    if target_dir.is_symlink() or not target_dir.is_dir():
        raise HTTPException(status_code=400, detail="Output cleanup target is not a job directory.")
    return target_dir


def _output_stem(output_name: str | None, fallback: str) -> str:
    safe_name = sanitize_filename(output_name, fallback)
    return Path(safe_name).stem or fallback


def _named_output(
    output_dir: Path,
    output_name: str | None,
    fallback_stem: str,
    suffix: str,
) -> Path:
    safe_stem = _output_stem(output_name, fallback_stem)
    return output_dir / f"{safe_stem}{suffix}"


def _compression_profile(profile: str) -> str:
    profile_key = profile.lower().strip()
    if profile_key not in COMPRESSION_PROFILES:
        valid_profiles = ", ".join(sorted(COMPRESSION_PROFILES))
        raise HTTPException(
            status_code=400,
            detail=f"Unknown compression profile. Expected one of: {valid_profiles}.",
        )
    return profile_key


def _bundle_file_name(output_name: str | None, operation: str) -> str | None:
    if not output_name:
        return None
    return f"{_output_stem(output_name, operation)}-results.zip"


async def _save_uploads(
    files: list[UploadFile],
    upload_dir: Path,
    fallback_name: str,
    *,
    allowed_extensions: set[str],
    min_files: int = 1,
) -> list[Path]:
    if len(files) < min_files:
        raise HTTPException(status_code=400, detail=f"At least {min_files} files are required.")

    saved_files: list[Path] = []
    for index, upload in enumerate(files, start=1):
        _validate_upload_extension(upload, allowed_extensions)
        stem = Path(fallback_name).stem
        suffix = Path(fallback_name).suffix
        saved_files.append(await save_upload(upload, upload_dir, f"{stem}-{index}{suffix}"))
    return saved_files


async def _save_single_upload(
    upload: UploadFile,
    upload_dir: Path,
    fallback_name: str,
    *,
    allowed_extensions: set[str],
) -> Path:
    _validate_upload_extension(upload, allowed_extensions)
    return await save_upload(upload, upload_dir, fallback_name)


def _validate_upload_extension(upload: UploadFile, allowed_extensions: set[str]) -> None:
    extension = Path(upload.filename or "").suffix.lower()
    if extension not in allowed_extensions:
        expected = ", ".join(sorted(allowed_extensions))
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Expected: {expected}.",
        )


def _run_job(
    operation: str,
    job_id: str,
    paths: StoragePaths,
    operation_callback: Callable[[], list[Path]],
    bundle_name: str | None = None,
) -> JobResult:
    try:
        output_paths = operation_callback()
    except (PdfForgeError, StorageError, ValueError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    bundle = (
        _bundle_model(paths, job_id, operation, output_paths, bundle_name)
        if len(output_paths) > 1
        else None
    )
    return JobResult(
        job_id=job_id,
        operation=operation,
        files=[_output_model(paths, job_id, output_path) for output_path in output_paths],
        bundle=bundle,
    )


def _output_model(paths: StoragePaths, job_id: str, path: Path) -> OutputFile:
    resolved = path.resolve()
    if not resolved.is_relative_to(paths.outputs_dir):
        raise HTTPException(status_code=500, detail="Output path escaped storage root.")
    return OutputFile(
        file_name=resolved.name,
        download_url=f"/outputs/{job_id}/{quote(resolved.name)}",
        path=str(resolved),
        size_bytes=resolved.stat().st_size,
    )


def _bundle_model(
    paths: StoragePaths,
    job_id: str,
    operation: str,
    output_paths: list[Path],
    bundle_name: str | None = None,
) -> OutputBundle:
    bundle_path = _create_bundle(paths, job_id, operation, output_paths, bundle_name)
    output = _output_model(paths, job_id, bundle_path)
    return OutputBundle(
        file_name=output.file_name,
        download_url=output.download_url,
        path=output.path,
        size_bytes=output.size_bytes,
        file_count=len(output_paths),
    )


def _create_bundle(
    paths: StoragePaths,
    job_id: str,
    operation: str,
    output_paths: list[Path],
    bundle_name: str | None = None,
) -> Path:
    output_dir = job_output_dir(paths, job_id)
    safe_bundle_name = sanitize_filename(bundle_name, f"pdf-forge-{operation}-results.zip")
    bundle_path = (output_dir / safe_bundle_name).resolve()
    if not bundle_path.is_relative_to(paths.outputs_dir):
        raise HTTPException(status_code=500, detail="Bundle path escaped storage root.")

    used_names: set[str] = set()
    with ZipFile(bundle_path, "w", compression=ZIP_DEFLATED) as archive:
        for output_path in output_paths:
            resolved = output_path.resolve()
            if not resolved.is_relative_to(paths.outputs_dir):
                raise HTTPException(status_code=500, detail="Output path escaped storage root.")
            archive.write(resolved, arcname=_archive_name(resolved.name, used_names))

    return bundle_path


def _archive_name(file_name: str, used_names: set[str]) -> str:
    safe_name = sanitize_filename(file_name, "output")
    if safe_name not in used_names:
        used_names.add(safe_name)
        return safe_name

    path = Path(safe_name)
    for index in range(2, 10_000):
        candidate = f"{path.stem}-{index}{path.suffix}"
        if candidate not in used_names:
            used_names.add(candidate)
            return candidate

    raise HTTPException(status_code=500, detail="Could not create unique bundle file names.")


app = create_app()
