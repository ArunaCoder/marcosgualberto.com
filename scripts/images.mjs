/**
 * Gera as fotos do site a partir de images/ (originais, fora do git).
 * Requer ImageMagick 7 (comando `magick`) no PATH.
 *
 *   npm run images
 */
import { execFile } from "node:child_process";
import { mkdir, access } from "node:fs/promises";
import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "images");
const OUT = join(root, "public", "photos");
const WIDTHS = [640, 1024, 1600, 2200];

/** chave usada no site -> arquivo original */
const MAP = {
  riso: "DSC01959.JPG",
  acolhida: "DSC03951.JPG",
  claro: "DSC05311.JPG",
  sereno: "DSC05405.JPG",
  direto: "DSC05582.JPG",
  atento: "DSC06423.JPG",
  perfil: "DSC01812.JPG",
  maos: "DSC04618.JPG",
  explica: "DSC05912.JPG",
  aponta: "_MG_9760.JPG",
  conversa: "DSC06087.JPG",
  saudacao: "_MG_8899.JPG",
  "saudacao-clara": "_MG_9097.JPG",
  sala: "DSC05847.JPG",
  publico: "DSC06035.JPG",
  "sala-ampla": "DSC06152.JPG",
  frase: "DSC05991.JPG",
  gesto: "DSC02993.JPG",
  cor: "_MG_9018.JPG",
  dourado: "_MG_9387.JPG",
};

async function has(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await has(SRC))) {
    console.error(`! pasta ${SRC} não encontrada (as fotos originais estão fora do git).`);
    process.exit(1);
  }
  try {
    await run("magick", ["-version"]);
  } catch {
    console.error("! ImageMagick não encontrado. Instale o `magick` e rode de novo.");
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });
  let made = 0;

  for (const [key, file] of Object.entries(MAP)) {
    const input = join(SRC, file);
    if (!(await has(input))) {
      console.warn(`  · pulando ${key}: ${file} não existe`);
      continue;
    }
    for (const w of WIDTHS) {
      await run("magick", [
        input,
        "-auto-orient",
        "-resize", `${w}x>`,
        "-strip",
        "-quality", "82",
        "-define", "webp:method=6",
        join(OUT, `${key}-${w}.webp`),
      ]);
      await run("magick", [
        input,
        "-auto-orient",
        "-resize", `${w}x>`,
        "-strip",
        "-quality", "80",
        "-interlace", "Plane",
        "-sampling-factor", "4:2:0",
        join(OUT, `${key}-${w}.jpg`),
      ]);
      made += 2;
    }
    console.log(`  ✓ ${key}`);
  }

  console.log(`\n${made} arquivos em public/photos/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
