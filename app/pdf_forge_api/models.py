from __future__ import annotations

from pydantic import BaseModel, Field


class OutputFile(BaseModel):
    file_name: str
    download_url: str
    path: str
    size_bytes: int = Field(ge=0)
    source_size_bytes: int | None = Field(default=None, ge=0)
    size_delta_bytes: int | None = None
    size_reduction_percent: float | None = None


class OutputBundle(OutputFile):
    file_count: int = Field(ge=2)


class JobResult(BaseModel):
    job_id: str
    operation: str
    files: list[OutputFile]
    bundle: OutputBundle | None = None


class HealthResponse(BaseModel):
    status: str
    scratch_dir: str
    outputs_dir: str
    operations: list[str]


class ToolStatus(BaseModel):
    available: bool
    command: str | None = None
    source: str | None = None
    message: str
    profiles: list[str] = Field(default_factory=list)


class OutputJobSummary(BaseModel):
    job_id: str
    file_count: int = Field(ge=0)
    size_bytes: int = Field(ge=0)
    modified_at: str


class OutputJobList(BaseModel):
    outputs_dir: str
    jobs: list[OutputJobSummary]


class OutputCleanupResult(BaseModel):
    job_id: str
    deleted: bool
