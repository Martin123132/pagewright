<#
.SYNOPSIS
Starts the local Pagewright API with temp/cache/output paths under this repo.

.EXAMPLE
.\scripts\start_pagewright.ps1

.EXAMPLE
.\scripts\start_pagewright.ps1 -NoBrowser

.EXAMPLE
.\scripts\start_pagewright.ps1 -Check -NoBrowser
#>

param(
    [string]$HostAddress = "127.0.0.1",
    [int]$Port = 8787,
    [switch]$NoBrowser,
    [switch]$Check
)

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$RepoDrive = ([System.IO.DirectoryInfo]$RepoRoot).Root.FullName

if ($RepoDrive -ieq "C:\") {
    throw "Refusing to run Pagewright from C:. Move the repo to D: or another data drive before starting."
}

$ScratchRoot = Join-Path $RepoRoot "scratch"
$TempRoot = Join-Path $ScratchRoot "tmp"
$PycacheRoot = Join-Path $ScratchRoot "pycache"
$OutputRoot = Join-Path $RepoRoot "outputs"

foreach ($Path in @($ScratchRoot, $TempRoot, $PycacheRoot, $OutputRoot)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
}

$env:TEMP = $TempRoot
$env:TMP = $TempRoot
$env:PYTHONPYCACHEPREFIX = $PycacheRoot

$LocalPython = Join-Path $RepoRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $LocalPython)) {
    throw "Missing local virtual environment. Run: py -3.13 -m venv .venv; .\.venv\Scripts\python.exe -m pip install -e `".[dev,api]`""
}

$Url = "http://${HostAddress}:${Port}/"

Write-Host "Pagewright local launch"
Write-Host "Repo: $RepoRoot"
Write-Host "Temp: $TempRoot"
Write-Host "Outputs: $OutputRoot"
Write-Host "URL: $Url"

if ($Check) {
    Write-Host "Check only: launcher paths are ready."
    exit 0
}

if (-not $NoBrowser) {
    Start-Process $Url
}

& $LocalPython -m uvicorn pdf_forge_api.main:app --host $HostAddress --port $Port
