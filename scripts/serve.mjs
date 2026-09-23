/** Servidor estático de desenvolvimento, sem dependências. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, process.env.DIST ?? "dist");
const PORT = Number(process.env.PORT ?? 4321);
const OPEN = process.argv.includes("--open");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  let path = join(DIST, normalize(url).replace(/^(\.\.[/\\])+/, ""));

  try {
    const s = await stat(path).catch(() => null);
    if (s?.isDirectory()) path = join(path, "index.html");
    const body = await readFile(path);
    res.writeHead(200, {
      "content-type": TYPES[extname(path)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end('<meta charset="utf-8"><p style="font:16px system-ui;padding:40px">404 — não encontrado. <a href="/">voltar</a></p>');
  }
}).listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n  marcosgualberto.com — estudos de homepage`);
  console.log(`  ${url}\n`);

  if (OPEN) {
    const cmd =
      process.platform === "win32"
        ? `start "" "${url}"`
        : process.platform === "darwin"
          ? `open "${url}"`
          : `xdg-open "${url}"`;
    exec(cmd, { shell: process.platform === "win32" ? "cmd.exe" : undefined });
  }
});
