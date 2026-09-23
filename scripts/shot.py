"""Tira screenshot de uma página servida localmente e reporta erros de JS/console.

    python scripts/shot.py http://localhost:4402/02-brutalista/ saida.png
    python scripts/shot.py <url> <saida.png> --mobile     # 390x844
    python scripts/shot.py <url> <saida.png> --full       # página inteira

Requer playwright (já instalado). Percorre a página inteira antes de fotografar,
para disparar lazy-load e animações de entrada.
"""
import sys
from playwright.sync_api import sync_playwright

args = [a for a in sys.argv[1:] if not a.startswith("--")]
if len(args) < 2:
    print(__doc__)
    sys.exit(1)

url, out = args[0], args[1]
mobile = "--mobile" in sys.argv
full = "--full" in sys.argv
vp = {"width": 390, "height": 844} if mobile else {"width": 1440, "height": 950}

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport=vp, device_scale_factor=1)
    problems = []
    pg.on("console", lambda m: problems.append(f"console.{m.type}: {m.text}")
          if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: problems.append(f"pageerror: {e}"))
    pg.on("requestfailed", lambda r: problems.append(f"falhou: {r.url}"))

    pg.goto(url, wait_until="networkidle")
    pg.add_style_tag(content="html{scroll-behavior:auto !important}")
    pg.wait_for_timeout(600)

    h = pg.evaluate("document.body.scrollHeight")
    y = 0
    while y < h:
        pg.evaluate(f"window.scrollTo(0,{y})")
        pg.wait_for_timeout(240)
        y += vp["height"]
    pg.evaluate("window.scrollTo(0,0)")
    pg.wait_for_timeout(800)

    overflow = pg.evaluate(
        "document.documentElement.scrollWidth > document.documentElement.clientWidth"
    )
    pg.screenshot(path=out, full_page=full)
    b.close()

print(out)
if overflow:
    print("!! SCROLL HORIZONTAL — algo estoura a largura da viewport")
for pr in dict.fromkeys(problems):
    print("!!", pr)
