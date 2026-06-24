import os
import shutil
import socket
import subprocess
import sys
import textwrap
import time
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
TMP_ROOT = ROOT / "scratch" / "tmp"
TMP_ROOT.mkdir(parents=True, exist_ok=True)
os.environ.setdefault("TEMP", str(TMP_ROOT))
os.environ.setdefault("TMP", str(TMP_ROOT))
LOCAL_PYTHONPATH = os.pathsep.join(str(path) for path in (ROOT / "engine", ROOT / "app", ROOT))
os.environ["PYTHONPATH"] = (
    f"{LOCAL_PYTHONPATH}{os.pathsep}{os.environ['PYTHONPATH']}"
    if os.environ.get("PYTHONPATH")
    else LOCAL_PYTHONPATH
)

ASSETS_DIR = ROOT / "scratch" / "smoke"
ASSETS_DIR.mkdir(parents=True, exist_ok=True)


def _find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def _start_server(port: int) -> subprocess.Popen[str]:
    return subprocess.Popen(
        [
            str(ROOT / ".venv/Scripts/python.exe"),
            "-m",
            "uvicorn",
            "pdf_forge_api.main:app",
            "--host",
            "127.0.0.1",
            "--port",
            str(port),
        ],
        cwd=str(ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )


def _wait_for_server(port: int, proc: subprocess.Popen[str], timeout: float = 15.0) -> bool:
    deadline = time.monotonic() + timeout
    health_url = f"http://127.0.0.1:{port}/health"
    while time.monotonic() < deadline:
        if proc.poll() is not None:
            output = proc.stdout.read() if proc.stdout else ""
            if output:
                print(output, file=sys.stderr)
            return False
        try:
            with urlopen(health_url, timeout=1) as response:
                return response.status == 200
        except (OSError, URLError):
            time.sleep(0.25)
    return False


def _make_wrong_file(path: Path) -> Path:
    path.write_text("not a supported document", encoding="utf-8")
    return path


def _build_sample_wrong_route_script(port: int) -> str:
    js = textwrap.dedent(
        """
        const { chromium } = require('playwright');

        (async () => {
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage({
                viewport: { width: 1440, height: 900 },
            });
            page.setDefaultTimeout(15000);

            const appUrl = 'http://127.0.0.1:__PORT__/';
            await page.goto(appUrl, { waitUntil: 'networkidle' });
            await page.waitForSelector('#pathWelcome:not([hidden])');
            const quickActionCount = await page.$$eval(
              '#pathQuickActions button',
              (buttons) => buttons.length,
            );
            if (quickActionCount < 3) {
              throw new Error(`Expected at least 3 path quick actions, found ${quickActionCount}`);
            }
            await page.screenshot({ path: '__DESKTOP_SCREENSHOT__' });

            await page.click('#pathWelcomeDismiss');
            const welcomeHidden = await page.$eval('#pathWelcome', (node) => node.hidden);
            if (!welcomeHidden) {
              throw new Error('Path welcome did not dismiss');
            }
            const storedDismissal = await page.evaluate(() =>
              localStorage.getItem('pdfForgePathWelcomeDismissed'),
            );
            if (storedDismissal !== 'true') {
              throw new Error(`Path welcome dismissal was not persisted: ${storedDismissal}`);
            }

            await page.click('#pathQuickActions [data-path-action="stage-sample"]');
            await page.waitForFunction(
              () => document.querySelectorAll('#fileList .file-row').length >= 2,
            );
            await page.focus('#pathSteps [data-path-step="2"]');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);
            const claimCount = await page.locator('.claim-card').count();
            if (claimCount > 0) {
              throw new Error('Pressing Enter on a path step unexpectedly started a build');
            }

            await page.setViewportSize({ width: 390, height: 844 });
            await page.goto(appUrl, { waitUntil: 'networkidle' });
            const overflow = await page.evaluate(
              () => document.documentElement.scrollWidth - window.innerWidth,
            );
            if (overflow > 6) {
              throw new Error(`Mobile viewport has horizontal overflow: ${overflow}`);
            }
            await page.screenshot({ path: '__MOBILE_SCREENSHOT__' });

            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(appUrl, { waitUntil: 'networkidle' });
            await page.click('button[data-operation="merge"]');
            const fileInput = await page.$('#fileInput');
            await fileInput.setInputFiles('__FIXTURE_PATH__');
            await page.waitForTimeout(400);

            await page.waitForSelector('#recoveryPanel:not([hidden])');
            const switchButton = await page.$('#recoverySwitchButton');
            if (!switchButton) {
              throw new Error('Recovery switch button not found');
            }
            const hidden = await switchButton.evaluate((node) => node.hidden);
            if (hidden) {
              throw new Error('Recovery switch button is hidden when recovery is expected');
            }
            const text = await switchButton.innerText();
            if (!/Switch to/.test(text)) {
              throw new Error(`Unexpected switch label: ${text}`);
            }
            await switchButton.click();

            const title = await page.$eval('#operationTitle', (node) => node.textContent?.trim());
            if (!title.includes('PDF') && !title.includes('Split')) {
              throw new Error(`Recovery did not switch route. Operation title: ${title}`);
            }

            await browser.close();
        })();
        """
    )
    return (
        js.replace("__PORT__", str(port))
        .replace("__FIXTURE_PATH__", str(ASSETS_DIR / "wrong.png").replace("\\", "/"))
        .replace(
            "__DESKTOP_SCREENSHOT__",
            str(ASSETS_DIR / "guided-path-desktop.png").replace("\\", "/"),
        )
        .replace(
            "__MOBILE_SCREENSHOT__",
            str(ASSETS_DIR / "guided-path-mobile.png").replace("\\", "/"),
        )
    )


def _run_playwright_script(port: int) -> int:
    script = _build_sample_wrong_route_script(port)
    js_path = TMP_ROOT / "smoke_recovery.js"
    js_path.write_text(script, encoding="utf-8")

    # Prefer node script invocation so this repo does not require pytest plugins.
    result = subprocess.run(
        ["node", str(js_path)],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
    )
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr)
    return result.returncode


def _require_playwright() -> bool:
    return shutil.which("node") is not None and __node_has_playwright_module()


def __node_has_playwright_module() -> bool:
    result = subprocess.run(
        [
            "node",
            "-e",
            "try { require('playwright'); console.log('ok'); } catch (error) { process.exit(1); }",
        ],
        capture_output=True,
        text=True,
    )
    return result.returncode == 0


def main() -> int:
    if shutil.which("node") is None:
        print("Node.js is required for this smoke check but not found on PATH.", file=sys.stderr)
        return 2

    if not _require_playwright():
        print(
            "Node Playwright module is required for this smoke check. "
            "Install with: npm install playwright && npx playwright install chromium",
            file=sys.stderr,
        )
        return 2

    wrong = _make_wrong_file(ASSETS_DIR / "wrong.png")
    if not wrong.exists():
        print("Failed to create smoke fixture", file=sys.stderr)
        return 1

    port = _find_free_port()
    proc = _start_server(port)
    try:
        if not _wait_for_server(port, proc):
            print("Smoke server did not become ready.", file=sys.stderr)
            return 1
        return _run_playwright_script(port)
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            proc.kill()


if __name__ == "__main__":
    raise SystemExit(main())
