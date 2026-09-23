"""Gera as miniaturas da galeria a partir dos estudos já construídos.

    npm run build            # precisa existir dist/
    python scripts/thumbs.py # sobe um servidor, fotografa cada estudo e salva em public/thumbs/

Miniatura estática em vez de iframe: a galeria fica leve no celular, que é como
o Marcos vai abrir.
"""
import os
import re
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
OUT = ROOT / "public" / "thumbs"
PORT = 4399

if not DIST.exists():
    sys.exit("! dist/ não existe. Rode `npm run build` antes.")

ids = sorted(p.name for p in DIST.iterdir() if p.is_dir() and re.match(r"^\d\d-", p.name))
if not ids:
    sys.exit("! nenhum estudo em dist/")

OUT.mkdir(parents=True, exist_ok=True)

server = subprocess.Popen(
    ["node", str(ROOT / "scripts" / "serve.mjs")],
    cwd=ROOT,
    env={**os.environ, "PORT": str(PORT), "DIST": "dist"},
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)
time.sleep(1.5)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        for vid in ids:
            page.goto(f"http://localhost:{PORT}/{vid}/", wait_until="networkidle")
            page.add_style_tag(content="html{scroll-behavior:auto!important}.studies{display:none!important}")
            page.wait_for_timeout(700)
            raw = OUT / f"{vid}.png"
            page.screenshot(path=str(raw))
            subprocess.run(
                ["magick", str(raw), "-resize", "720x450^", "-gravity", "north",
                 "-extent", "720x450", "-quality", "80", str(OUT / f"{vid}.webp")],
                check=True,
            )
            raw.unlink()
            print(f"  ✓ {vid}")
        browser.close()
finally:
    server.terminate()

print(f"\n{len(ids)} miniaturas em public/thumbs/")
