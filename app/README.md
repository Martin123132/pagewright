# App

This folder is reserved for the API and UI.

The FastAPI service exposes the engine through local job endpoints with:

- isolated job directories under `D:\CodexProjects\pdf-forge\scratch`
- route-level upload validation for expected file types
- merge validation that requires at least two PDFs
- structured operation errors
- output files written under `D:\CodexProjects\pdf-forge\outputs`
- local cleanup controls for ignored output folders under the configured outputs directory

Cleanup is intentionally limited to direct child folders of the configured `outputs` directory.
It refuses `C:` storage, path escapes, loose files, symlinks, and the outputs root itself.

Run it from the repo root:

```powershell
.\scripts\start_pagewright.ps1 -NoBrowser
```

Then open:

```text
http://127.0.0.1:8787/
```

API docs are available at:

```text
http://127.0.0.1:8787/docs
```
