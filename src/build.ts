import { cp, mkdir, readFile, readdir, rm, writeFile, access } from "node:fs/promises";
import { dirname, join as pjoin } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { page } from "./lib/shell.js";
import { gallery } from "./gallery/page.js";
import type { Variant } from "./lib/types.js";

const here = dirname(fileURLToPath(import.meta.url)); // .tsc/ (ou .tmp/<id>/)
const root = process.cwd();
const src = pjoin(root, "src");
const dist = pjoin(root, process.env["OUT"] ?? "dist");

/** limita o build a alguns estudos: ONLY=02-brutalista,03-cinema */
const only = (process.env["ONLY"] ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/** Descobre os estudos lendo as pastas de src/variants — sem arquivo de índice
 *  compartilhado, para que vários possam ser escritos em paralelo. */
async function discover(): Promise<Variant[]> {
  const dirs = await readdir(pjoin(src, "variants"), { withFileTypes: true });
  const found: Variant[] = [];
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const mod = pjoin(here, "variants", d.name, "page.js");
    if (!(await exists(mod))) {
      console.warn(`  ! ${d.name}: page.js não compilado, pulando`);
      continue;
    }
    const imported = (await import(pathToFileURL(mod).href)) as { variant?: Variant };
    if (!imported.variant) {
      console.warn(`  ! ${d.name}: não exporta \`variant\`, pulando`);
      continue;
    }
    found.push(imported.variant);
  }
  return found.sort((a, b) => a.id.localeCompare(b.id));
}

async function main(): Promise<void> {
  const all = await discover();
  const build = only.length ? all.filter((v) => only.includes(v.id)) : all;

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  const reset = await readFile(pjoin(src, "lib/reset.css"), "utf8");

  for (const v of build) {
    const out = pjoin(dist, v.id);
    await mkdir(out, { recursive: true });
    await writeFile(pjoin(out, "index.html"), page(v, all), "utf8");

    const css = await readFile(pjoin(src, "variants", v.id, "style.css"), "utf8");
    await writeFile(pjoin(out, "style.css"), `${reset}\n${css}`, "utf8");

    const js = pjoin(here, "variants", v.id, "client.js");
    if (v.client && (await exists(js))) await cp(js, pjoin(out, "client.js"));
  }

  await writeFile(pjoin(dist, "index.html"), gallery(build), "utf8");
  const galleryCss = await readFile(pjoin(src, "gallery/style.css"), "utf8");
  await writeFile(pjoin(dist, "gallery.css"), `${reset}\n${galleryCss}`, "utf8");

  await cp(pjoin(root, "public"), dist, { recursive: true });

  console.log(`✓ ${build.length} estudo(s) em ${dist}`);
  for (const v of build) console.log(`  /${v.id}/  ${v.name}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
