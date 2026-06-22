# App

This folder is reserved for the API and UI.

The FastAPI service exposes the engine through local job endpoints with:

- isolated job directories under `D:\CodexProjects\pdf-forge\scratch`
- upload size limits
- automatic cleanup
- structured operation errors
- output files written under `D:\CodexProjects\pdf-forge\outputs`

Run it from the repo root:

```powershell
$env:TEMP='D:\CodexProjects\pdf-forge\scratch\tmp'
$env:TMP='D:\CodexProjects\pdf-forge\scratch\tmp'
.\.venv\Scripts\python.exe -m uvicorn pdf_forge_api.main:app --host 127.0.0.1 --port 8787 --reload
```

Then open:

```text
http://127.0.0.1:8787/
```

API docs are available at:

```text
http://127.0.0.1:8787/docs
```
