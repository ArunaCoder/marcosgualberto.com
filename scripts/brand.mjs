/**
 * Gera os arquivos de marca em public/brand/ a partir dos PNGs oficiais em
 * "Identidade Visual/2_MARCA_MESTRE_GUALBERTO/".
 *
 *   node scripts/brand.mjs
 *
 * Os PNGs originais são a fonte de verdade (o manual de identidade), e já vêm
 * recortados justos, sem margem transparente. Aqui só reduzimos para tamanhos de
 * web e derivamos as silhuetas branca/preta da gota a partir do canal alpha.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const run = promisify(execFile);

const SRC = "Identidade Visual/2_MARCA_MESTRE_GUALBERTO";
const OUT = "public/brand";

/** [arquivo de origem, nome de saída, largura alvo] */
const JOBS = [
  [`${SRC}/_MARCA_MESTRE_GUALBERTO.png`, "mg-horizontal.png", 600],
  [`${SRC}/_MARCA_MESTRE_GUALBERTO (branco).png`, "mg-horizontal-branco.png", 600],
  [`${SRC}/_MARCA_MESTRE_GUALBERTO (preto).png`, "mg-horizontal-preto.png", 600],
  [`${SRC}/_MARCA_MESTRE_GUALBERTO_VERTICAL.png`, "mg-vertical.png", 560],
  [`${SRC}/_MARCA_MESTRE_GUALBERTO vert (branco).png`, "mg-vertical-branco.png", 560],
  [`${SRC}/_MARCA_MESTRE_GUALBERTO vert (preto).png`, "mg-vertical-preto.png", 560],
  [`${SRC}/GOTA_MESTRE_GUALBERTO.png`, "mg-gota.png", 333],
];

const PY = `
import sys, json
from PIL import Image
jobs = json.loads(sys.argv[1])
out = {}
for src, name, w in jobs:
    im = Image.open(src).convert("RGBA")
    bb = im.getbbox()
    if bb: im = im.crop(bb)
    h = round(im.height * w / im.width)
    im = im.resize((w, h), Image.LANCZOS)
    im.save("public/brand/" + name, optimize=True)
    out[name] = [w, h]

# silhueta branca da gota, a partir do alpha (para marca d'agua sobre escuro)
g = Image.open("${SRC}/GOTA_MESTRE_GUALBERTO.png").convert("RGBA")
bb = g.getbbox()
if bb: g = g.crop(bb)
a = g.split()[3]
for name, rgb in (("mg-gota-branco.png", (255, 255, 255)), ("mg-gota-preto.png", (17, 17, 17))):
    sil = Image.new("RGBA", g.size, rgb + (0,))
    sil.putalpha(a)
    sil = sil.resize((333, round(g.height * 333 / g.width)), Image.LANCZOS)
    sil.save("public/brand/" + name, optimize=True)
    out[name] = list(sil.size)

# favicon e icone de toque, a partir da gota colorida (quadrado, com respiro)
for name, size in (("favicon-32.png", 32), ("icon-180.png", 180)):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pad = round(size * 0.10)
    inner = size - pad * 2
    gg = g.copy()
    ratio = min(inner / gg.width, inner / gg.height)
    gg = gg.resize((max(1, round(gg.width * ratio)), max(1, round(gg.height * ratio))), Image.LANCZOS)
    canvas.paste(gg, ((size - gg.width) // 2, (size - gg.height) // 2), gg)
    canvas.save("public/brand/" + name, optimize=True)
    out[name] = [size, size]

print(json.dumps(out))
`;

await mkdir(OUT, { recursive: true });
const { stdout } = await run("python", ["-c", PY, JSON.stringify(JOBS)]);
const sizes = JSON.parse(stdout.trim().split("\n").pop());

// dimensões intrínsecas, para o <img> reservar espaço e não causar salto
await writeFile(`${OUT}/sizes.json`, JSON.stringify(sizes, null, 2) + "\n", "utf8");
for (const [name, [w, h]] of Object.entries(sizes)) console.log(`  ${name}  ${w}x${h}`);
console.log(`✓ marca gerada em ${OUT}/`);
