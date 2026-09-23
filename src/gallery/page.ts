import { html, join } from "../lib/html.js";
import { logo } from "../lib/brand.js";
import { u } from "../lib/base.js";
import type { Variant } from "../lib/types.js";
import { site } from "../content/site.js";

function mesAno(): string {
  const s = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function gallery(variants: Variant[]): string {
  const cards = join(
    variants.map(
      (v, i) => html`
        <article class="card" data-scheme="${v.scheme}" style="--accent:${v.accent}">
          <a class="card__shot" href="${u(`/${v.id}/`)}" tabindex="-1" aria-hidden="true">
            <img
              src="${u(`/thumbs/${v.id}.webp`)}"
              alt=""
              width="720"
              height="450"
              loading="${i < 2 ? "eager" : "lazy"}"
              decoding="async"
            />
          </a>
          <div class="card__body">
            <p class="card__n">Opção ${String(i + 1).padStart(2, "0")}</p>
            <h2><a href="${u(`/${v.id}/`)}">${v.name}</a></h2>
            <p class="card__blurb">${v.blurb}</p>
            <ul class="card__tags">
              ${join(v.tags.map((t) => html`<li>${t}</li>`))}
            </ul>
            <span class="card__go">Abrir<span aria-hidden="true">→</span></span>
          </div>
        </article>
      `,
    ),
  );

  return `<!doctype html>
<html lang="${site.locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${site.name} — dez propostas de site</title>
    <meta name="description" content="Dez propostas visuais para o novo site de ${site.name}." />
    <link rel="icon" href="${u("/brand/favicon-32.png")}" sizes="32x32" />
    <link rel="apple-touch-icon" href="${u("/brand/icon-180.png")}" />
    <meta name="theme-color" content="#0e1116" />
    <meta property="og:title" content="${site.name} — dez propostas de site" />
    <meta property="og:description" content="Mesma informação em todas; muda só o visual." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,300;9..144,400&display=swap"
    />
    <link rel="stylesheet" href="${u("/gallery.css")}" />
  </head>
  <body>
    <header class="top">
      ${logo("horizontal", { className: "top__logo", tone: "branco" }).value}
      <div class="top__text">
        <h1>Dez propostas para o site novo</h1>
        <p class="top__lead">
          Todas têm a mesma informação — o que muda é o visual. Abra as que
          chamarem sua atenção e diga qual agradou. Pode ser mais de uma, e pode
          ser “nenhuma”.
        </p>
        <p class="top__note">
          São rascunhos só da página de entrada. O texto, as datas e os preços
          vieram do site atual, e os links do menu levam para lá. Dentro de cada
          proposta há uma barrinha embaixo para pular direto para a seguinte.
        </p>
      </div>
    </header>

    <main class="grid">
${cards.value}
    </main>

    <footer class="bottom">
      <p>${site.domain}</p>
      <p>Propostas de design — ${mesAno()}</p>
    </footer>
  </body>
</html>
`;
}
