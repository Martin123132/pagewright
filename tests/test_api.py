from __future__ import annotations

from io import BytesIO
from pathlib import Path
from zipfile import ZipFile

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from pdf_forge_api.main import _output_job_dir, create_app
from pdf_forge_api.storage import StoragePaths
from PIL import Image
from pypdf import PdfReader, PdfWriter


@pytest.fixture()
def client(tmp_path: Path) -> TestClient:
    paths = StoragePaths(
        repo_root=tmp_path,
        scratch_dir=tmp_path / "scratch",
        outputs_dir=tmp_path / "outputs",
    ).ensure()
    return TestClient(create_app(paths))


def test_health_uses_configured_d_scoped_paths(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["scratch_dir"].lower().startswith("d:")
    assert data["outputs_dir"].lower().startswith("d:")


def test_index_serves_product_workbench(client: TestClient) -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert "Pagewright" in response.text
    assert "/static/app.js?v=20260623a" in response.text
    assert "/static/styles.css?v=20260623a" in response.text
    assert "Try sample" in response.text
    assert "Stage sample" in response.text
    assert "routeBoard" in response.text
    assert "routeIntel" in response.text
    assert "routeIntelPrimaryButton" in response.text
    assert "routePulse" in response.text
    assert "routeCompareToggle" in response.text
    assert "routeComparePanel" in response.text
    assert "routeCompareList" in response.text
    assert "Compare operations" in response.text
    assert "jobPreview" in response.text
    assert "previewSteps" in response.text
    assert "presetPanel" in response.text
    assert "presetSaveButton" in response.text
    assert "missionTitle" in response.text
    assert "missionActionButton" in response.text
    assert "missionControl" in response.text
    assert "missionControlScore" in response.text
    assert "missionChecks" in response.text
    assert "recoveryPanel" in response.text
    assert "recentList" in response.text
    assert "recentSummary" in response.text
    assert "recentLimitSelect" in response.text
    assert "cleanupList" in response.text
    assert "cleanupRefreshButton" in response.text
    assert "/static/app.js" in response.text
    assert "pathNextHint" in response.text
    assert "path-next-hint" in response.text
    assert "pathQuickActions" in response.text
    assert "pathWelcome" in response.text
    assert "pathWelcomeDismiss" in response.text
    assert "routeSuggestion" in response.text
    assert "routeSuggestionButton" in response.text


def test_static_assets_are_served(client: TestClient) -> None:
    response = client.get("/static/app.js")

    assert response.status_code == 200
    assert "const operations" in response.text
    assert "/jobs/demo/merge" in response.text
    assert "Download all" in response.text
    assert "Claim Ready" in response.text
    assert "getClaimSummary" in response.text
    assert "Output Receipt" in response.text
    assert "Repeat setup" in response.text
    assert "captureReceipt" in response.text
    assert "repeatReceiptSetup" in response.text
    assert "Wrong file type" in response.text
    assert "clearStage" in response.text
    assert "getRouteSuggestion" in response.text
    assert "getStagedFileProfile" in response.text
    assert "suggest-route" in response.text
    assert "routeSuggestionLabel" in response.text
    assert "routeSuggestionButton" in response.text
    assert "orderSensitiveRoutes" in response.text
    assert "getOrderSummary" in response.text
    assert "syncSuggestedOutputName" in response.text
    assert "getSuggestedOutputName" in response.text
    assert "sanitizeOutputStem" in response.text
    assert "dataset.suggested" in response.text
    assert "Drag to reorder" in response.text
    assert "handleFileDragStart" in response.text
    assert "handleFileDrop" in response.text
    assert "reorderStagedFile" in response.text
    assert "Current first:" in response.text
    assert "Order path" in response.text
    assert "Earlier" in response.text
    assert "Later" in response.text
    assert "data-new-job" in response.text
    assert "data-move-file" in response.text
    assert "stageSampleFiles" in response.text
    assert "formatFileMeta" in response.text
    assert "inspectStagedFiles" in response.text
    assert "page count pending" in response.text
    assert "detected" in response.text
    assert "handleGlobalKeydown" in response.text
    assert "canRunJob" in response.text
    assert "focusNextStep" in response.text
    assert "resetWorkbench" in response.text
    assert "renderMission" in response.text
    assert "renderMissionControl" in response.text
    assert "getMissionControlItems" in response.text
    assert "getSettingIssues" in response.text
    assert "handleMissionControlAction" in response.text
    assert "renderBuildStatus" in response.text
    assert "getBuildCompleteTitle" in response.text
    assert "getBuildCompleteDetail" in response.text
    assert "focusClaimResults" in response.text
    assert "data-check-action" in response.text
    assert "build-status-card" in response.text
    assert "renderJobPreview" in response.text
    assert "saveRoutePreset" in response.text
    assert "applyRoutePreset" in response.text
    assert "pdfForgePresets" in response.text
    assert "getPreviewOutput" in response.text
    assert "renderRouteBoard" in response.text
    assert "renderRouteCompare" in response.text
    assert "compareIntents" in response.text
    assert "data-compare-intent" in response.text
    assert "data-compare-route" in response.text
    assert "data-compare-sample" in response.text
    assert "chooseComparedRoute" in response.text
    assert "runComparedSample" in response.text
    assert "selected from compare" in response.text
    assert "step-action" in response.text
    assert "step-hint" in response.text
    assert "path-step" in response.text
    assert "data-path-action" in response.text
    assert "handlePathQuickAction" in response.text
    assert "PATH_WELCOME_KEY" in response.text
    assert "loadWelcomeState" in response.text
    assert "dismissPathWelcome" in response.text
    assert "event.defaultPrevented" in response.text
    assert "data-route" in response.text
    assert "data-route-action" in response.text
    assert "aria-label=\"${operation.routeLabel} route" in response.text
    assert "routeTarget" in response.text
    assert "Build now" in response.text
    assert "View outputs" in response.text
    assert "Merge order runs top to bottom" in response.text
    assert "pdfForgeRecent" in response.text
    assert "pdfForgeRecentLimit" in response.text
    assert "renderRecentFiles" in response.text
    assert "recentOutputCount" in response.text
    assert "trimRecent" in response.text
    assert "data-remove-recent" in response.text
    assert "/outputs/jobs" in response.text
    assert "refreshOutputCleanup" in response.text
    assert "requestOutputDelete" in response.text
    assert "pendingCleanupJobId" in response.text
    assert "deleteOutputJob" in response.text
    assert "clearDeletedOutputReferences" in response.text
    assert "data-delete-output" in response.text
    assert "Output name" in response.text
    assert "output_name" in response.text

    styles = client.get("/static/styles.css")
    assert styles.status_code == 200
    assert ".path-welcome[hidden]" in styles.text
    assert ".route-suggestion[hidden]" in styles.text
    assert ".mission-control" in styles.text
    assert ".mission-checks" in styles.text
    assert ".mission-check[data-status=\"ready\"]" in styles.text
    assert ".build-status-card" in styles.text
    assert ".build-status-card[data-phase=\"complete\"]" in styles.text
    assert "@keyframes build-pulse" in styles.text
    assert ".rail-summary" in styles.text
    assert ".recent-route" in styles.text
    assert ".cleanup-delete[data-state=\"confirm\"]" in styles.text


def test_merge_job_creates_downloadable_pdf(client: TestClient) -> None:
    response = client.post(
        "/jobs/merge",
        files=[
            ("files", ("first.pdf", _pdf_bytes(pages=1), "application/pdf")),
            ("files", ("second.pdf", _pdf_bytes(pages=2), "application/pdf")),
        ],
    )

    assert response.status_code == 200
    data = response.json()
    assert data["operation"] == "merge"
    output = Path(data["files"][0]["path"])
    assert output.drive.lower() == "d:"
    assert len(PdfReader(str(output)).pages) == 3

    download = client.get(data["files"][0]["download_url"])
    assert download.status_code == 200
    assert download.headers["content-type"] == "application/pdf"


def test_merge_job_uses_sanitized_output_name(client: TestClient) -> None:
    response = client.post(
        "/jobs/merge",
        data={"output_name": "Launch Plan"},
        files=[
            ("files", ("first.pdf", _pdf_bytes(pages=1), "application/pdf")),
            ("files", ("second.pdf", _pdf_bytes(pages=1), "application/pdf")),
        ],
    )

    assert response.status_code == 200
    data = response.json()
    assert data["files"][0]["file_name"] == "Launch_Plan.pdf"
    assert Path(data["files"][0]["path"]).drive.lower() == "d:"


def test_merge_job_requires_two_pdfs(client: TestClient) -> None:
    response = client.post(
        "/jobs/merge",
        files=[("files", ("only.pdf", _pdf_bytes(pages=1), "application/pdf"))],
    )

    assert response.status_code == 400
    assert "At least 2 files" in response.json()["detail"]


def test_merge_job_rejects_non_pdf_upload(client: TestClient) -> None:
    response = client.post(
        "/jobs/merge",
        files=[
            ("files", ("first.pdf", _pdf_bytes(pages=1), "application/pdf")),
            ("files", ("notes.txt", b"not a pdf", "text/plain")),
        ],
    )

    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]
    assert ".pdf" in response.json()["detail"]


def test_split_job_uses_named_outputs_and_bundle(client: TestClient) -> None:
    response = client.post(
        "/jobs/split",
        data={"pages": "1-2", "output_name": "Chapter Pages"},
        files={"file": ("source.pdf", _pdf_bytes(pages=3), "application/pdf")},
    )

    assert response.status_code == 200
    data = response.json()
    assert [file["file_name"] for file in data["files"]] == [
        "Chapter_Pages-page-1.pdf",
        "Chapter_Pages-page-2.pdf",
    ]
    assert data["bundle"]["file_name"] == "Chapter_Pages-results.zip"


def test_split_job_rejects_non_pdf_upload(client: TestClient) -> None:
    response = client.post(
        "/jobs/split",
        data={"pages": "1"},
        files={"file": ("notes.txt", b"not a pdf", "text/plain")},
    )

    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]


def test_images_to_pdf_job(client: TestClient) -> None:
    response = client.post(
        "/jobs/images-to-pdf",
        files=[("files", ("image.png", _png_bytes(), "image/png"))],
    )

    assert response.status_code == 200
    output = Path(response.json()["files"][0]["path"])
    assert output.drive.lower() == "d:"
    assert len(PdfReader(str(output)).pages) == 1


def test_images_to_pdf_job_rejects_non_image_upload(client: TestClient) -> None:
    response = client.post(
        "/jobs/images-to-pdf",
        files=[("files", ("source.pdf", _pdf_bytes(), "application/pdf"))],
    )

    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]
    assert ".png" in response.json()["detail"]


def test_demo_merge_job_uses_real_engine_and_d_scoped_outputs(client: TestClient) -> None:
    response = client.post("/jobs/demo/merge")

    assert response.status_code == 200
    data = response.json()
    output = Path(data["files"][0]["path"])
    assert data["operation"] == "merge"
    assert data["bundle"] is None
    assert output.drive.lower() == "d:"
    assert len(PdfReader(str(output)).pages) == 3


def test_demo_split_job_returns_bundle_for_multiple_outputs(client: TestClient) -> None:
    response = client.post("/jobs/demo/split")

    assert response.status_code == 200
    data = response.json()
    bundle = data["bundle"]
    bundle_path = Path(bundle["path"])
    assert data["operation"] == "split"
    assert len(data["files"]) == 2
    assert bundle["file_count"] == 2
    assert bundle_path.drive.lower() == "d:"
    assert bundle_path.suffix == ".zip"

    with ZipFile(bundle_path) as archive:
        assert sorted(archive.namelist()) == ["workbook-page-1.pdf", "workbook-page-2.pdf"]

    download = client.get(bundle["download_url"])
    assert download.status_code == 200
    assert download.headers["content-type"] == "application/zip"


def test_demo_pdf_to_images_job_creates_png_outputs(client: TestClient) -> None:
    response = client.post("/jobs/demo/pdf-to-images")

    assert response.status_code == 200
    data = response.json()
    assert data["operation"] == "pdf-to-images"
    assert len(data["files"]) == 2
    assert data["bundle"]["file_count"] == 2
    assert all(Path(file["path"]).suffix == ".png" for file in data["files"])


def test_demo_job_rejects_unknown_operation(client: TestClient) -> None:
    response = client.post("/jobs/demo/nope")

    assert response.status_code == 404
    assert response.json()["detail"] == "Unknown demo operation."


def test_output_cleanup_lists_and_deletes_job_directories(client: TestClient) -> None:
    merge = client.post(
        "/jobs/merge",
        files=[
            ("files", ("first.pdf", _pdf_bytes(pages=1), "application/pdf")),
            ("files", ("second.pdf", _pdf_bytes(pages=1), "application/pdf")),
        ],
    )
    split = client.post(
        "/jobs/split",
        data={"pages": "1-2"},
        files={"file": ("source.pdf", _pdf_bytes(pages=2), "application/pdf")},
    )
    assert merge.status_code == 200
    assert split.status_code == 200
    merge_job_id = merge.json()["job_id"]
    split_job_id = split.json()["job_id"]

    listed = client.get("/outputs/jobs")

    assert listed.status_code == 200
    data = listed.json()
    assert data["outputs_dir"].lower().startswith("d:")
    jobs = {job["job_id"]: job for job in data["jobs"]}
    assert {merge_job_id, split_job_id}.issubset(jobs)
    assert jobs[merge_job_id]["file_count"] == 1
    assert jobs[merge_job_id]["size_bytes"] > 0
    assert jobs[split_job_id]["file_count"] == 3

    deleted = client.delete(f"/outputs/jobs/{merge_job_id}")

    assert deleted.status_code == 200
    assert deleted.json() == {"job_id": merge_job_id, "deleted": True}
    assert client.get(merge.json()["files"][0]["download_url"]).status_code == 404
    remaining_jobs = {job["job_id"] for job in client.get("/outputs/jobs").json()["jobs"]}
    assert merge_job_id not in remaining_jobs
    assert split_job_id in remaining_jobs


def test_output_cleanup_rejects_non_job_targets(client: TestClient) -> None:
    paths: StoragePaths = client.app.state.storage_paths
    direct_file = paths.outputs_dir / "loose.pdf"
    direct_file.write_bytes(b"not a cleanup job")

    response = client.delete("/outputs/jobs/loose.pdf")

    assert response.status_code == 400
    assert "not a job directory" in response.json()["detail"]
    assert direct_file.exists()


def test_output_cleanup_rejects_path_escape(client: TestClient) -> None:
    paths: StoragePaths = client.app.state.storage_paths

    with pytest.raises(HTTPException) as exc:
        _output_job_dir(paths, "..")

    assert exc.value.status_code == 400
    assert "Invalid output job id" in exc.value.detail


def test_output_cleanup_rejects_traversal_or_absolute_ids(client: TestClient) -> None:
    paths: StoragePaths = client.app.state.storage_paths
    for bad_job_id in ("..", "a/../b", "a\\..\\b", "C:/outside", "C:\\outside"):
        with pytest.raises(HTTPException) as exc:
            _output_job_dir(paths, bad_job_id)

        assert exc.value.status_code == 400
        assert (
            "Invalid output job id" in exc.value.detail
            or "Output cleanup target escaped storage root." in exc.value.detail
        )


def test_output_cleanup_rejects_c_drive_outputs() -> None:
    paths = StoragePaths(
        repo_root=Path("D:/pagewright"),
        scratch_dir=Path("D:/pagewright/scratch"),
        outputs_dir=Path("C:/pagewright/outputs"),
    )

    with pytest.raises(HTTPException) as exc:
        _output_job_dir(paths, "job")

    assert exc.value.status_code == 400
    assert "C:" in exc.value.detail


def test_rotate_job_rejects_invalid_degrees(client: TestClient) -> None:
    response = client.post(
        "/jobs/rotate",
        files={"file": ("source.pdf", _pdf_bytes(), "application/pdf")},
        data={"degrees": "45"},
    )

    assert response.status_code == 400
    assert "multiple of 90" in response.json()["detail"]


def _pdf_bytes(pages: int = 1) -> bytes:
    buffer = BytesIO()
    writer = PdfWriter()
    for _ in range(pages):
        writer.add_blank_page(width=200, height=200)
    writer.write(buffer)
    return buffer.getvalue()


def _png_bytes() -> bytes:
    buffer = BytesIO()
    Image.new("RGB", (100, 100), "white").save(buffer, format="PNG")
    return buffer.getvalue()
