/**
 * Compila e constrói UM estudo isoladamente, para que vários possam ser
 * escritos em paralelo sem que o erro de um quebre o build do outro.
 *
 *   node scripts/preview.mjs 02-brutalista
 *
 * Gera .preview/<id>/ e diz em que porta servir.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const run = promisify(execFile);
const id = process.argv[2];

if (!id) {
  console.error("uso: node scripts/preview.mjs <id-do-estudo>");
  process.exit(1);
}
if (!existsSync(join("src", "variants", id))) {
  console.error(`! src/variants/${id} não existe`);
  process.exit(1);
}

const tscOut = `.tmp/${id}`;
const distOut = `.preview/${id}`;
const port = 4400 + Number(id.slice(0, 2) || 0);

// tsconfig próprio: compila só a biblioteca, o conteúdo e ESTE estudo.
await mkdir(tscOut, { recursive: true });
const cfgPath = join(tscOut, "tsconfig.json");
await writeFile(
  cfgPath,
  JSON.stringify(
    {
      extends: "../../tsconfig.json",
      compilerOptions: { outDir: ".", rootDir: "../../src" },
      include: [
        "../../src/lib/**/*.ts",
        "../../src/content/**/*.ts",
        "../../src/gallery/**/*.ts",
        "../../src/build.ts",
        `../../src/variants/${id}/**/*.ts`,
      ],
    },
    null,
    2,
  ),
  "utf8",
);

const tsc = join("node_modules", ".bin", process.platform === "win32" ? "tsc.cmd" : "tsc");
const win = process.platform === "win32";

try {
  await run(tsc, ["-p", cfgPath], { shell: win });
} catch (e) {
  console.error(e.stdout || e.message);
  process.exit(1);
}

try {
  const { stdout } = await run(process.execPath, [join(tscOut, "build.js")], {
    env: { ...process.env, ONLY: id, OUT: distOut },
  });
  process.stdout.write(stdout);
} catch (e) {
  console.error(e.stdout || e.message);
  process.exit(1);
}

console.log(`\n  servir:  DIST=${distOut} PORT=${port} node scripts/serve.mjs`);
console.log(`  abrir:   http://localhost:${port}/${id}/\n`);
