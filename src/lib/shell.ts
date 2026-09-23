import { html, raw, join } from "./html.js";
import type { Variant } from "./types.js";
import { site } from "../content/site.js";
import { u } from "./base.js";

/** Barra que permite pular entre os estudos, só no ambiente de comparação. */
function switcher(current: Variant, all: Variant[]): string {
  const links = all
    .map(
      (v) =>
        `<a href="${u(`/${v.id}/`)}"${v.id === current.id ? ' aria-current="page"' : ""} title="${
          v.name
        }">${v.id.slice(0, 2)}</a>`,
    )
    .join("");
  return `<nav class="studies" aria-label="Estudos de homepage">
  <a class="studies__home" href="${u("/")}" title="Todos os estudos">&#9632;</a>
  ${links}
  <span class="studies__name">${current.name}</span>
</nav>`;
}

const SWITCHER_CSS = `
.studies{position:fixed;z-index:9999;left:50%;bottom:16px;transform:translateX(-50%);display:flex;
align-items:center;gap:2px;padding:5px;border-radius:999px;background:rgba(17,20,24,.88);
backdrop-filter:blur(12px);box-shadow:0 8px 30px rgba(0,0,0,.28);font:500 12px/1 ui-sans-serif,system-ui,sans-serif}
.studies a{display:grid;place-items:center;width:26px;height:26px;border-radius:999px;color:#c9ced6;
text-decoration:none;transition:background .15s,color .15s}
.studies a:hover{background:rgba(255,255,255,.14);color:#fff}
.studies a[aria-current]{background:#fff;color:#111}
.studies__home{font-size:9px}
.studies__name{padding:0 10px 0 6px;color:#8b93a0;white-space:nowrap}
@media (max-width:720px){.studies__name{display:none}}
@media print{.studies{display:none}}
`;

export function page(v: Variant, all: Variant[]): string {
  const fonts = (v.fonts ?? [])
    .map((href) => `<link rel="stylesheet" href="${href}" />`)
    .join("\n    ");

  const body = v.render(site);

  return `<!doctype html>
<html lang="${site.locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${site.seo.title} — ${v.name}</title>
    <meta name="description" content="${site.seo.description}" />
    <meta name="theme-color" content="${v.accent}" />
    <link rel="icon" href="${u("/brand/favicon-32.png")}" sizes="32x32" />
    <link rel="apple-touch-icon" href="${u("/brand/icon-180.png")}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${site.seo.title}" />
    <meta property="og:description" content="${site.seo.description}" />
    <meta property="og:url" content="${site.url}" />
    ${fonts ? `<link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    ${fonts}` : ""}
    <link rel="stylesheet" href="${u(`/${v.id}/style.css`)}" />
    <style>${SWITCHER_CSS}</style>
  </head>
  <body>
${body.value}
${switcher(v, all)}
${v.client ? `<script type="module" src="${u(`/${v.id}/client.js`)}"></script>` : ""}
  </body>
</html>
`;
}

export { html, raw, join };
