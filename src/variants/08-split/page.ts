import { html, join, rich, raw } from "../../lib/html.js";
import { img } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import { u } from "../../lib/base.js";
import type { Variant } from "../../lib/types.js";
import type { PhotoKey } from "../../content/site.js";

/** Índice das seções: alimenta o trilho lateral e as legendas das fotos. */
const parts = [
  { id: "inicio", label: "Início" },
  { id: "agenda", label: "Agenda" },
  { id: "marcos", label: "Marcos" },
  { id: "frase", label: "Frase" },
  { id: "satsang", label: "Satsang" },
  { id: "midia", label: "Mídia" },
  { id: "avisos", label: "Avisos" },
] as const;

const two = (n: number): string => String(n).padStart(2, "0");

/** A foto de uma seção. No desktop vira uma camada fixa da coluna esquerda; no
 *  celular fica no topo da própria seção. */
function media(n: number, key: PhotoKey, label: string, first = false) {
  return html`
    <figure class="${first ? "sec__media is-active" : "sec__media"}">
      ${img(key, { sizes: "(max-width: 899px) 100vw, 46vw", eager: first })}
      <figcaption class="sec__cap">
        <span class="sec__cap-n">${two(n)}</span>
        <span class="sec__cap-r" aria-hidden="true"></span>
        <span class="sec__cap-t">${label}</span>
      </figcaption>
    </figure>
  `;
}

const kicker = (text: string) =>
  html`<p class="kicker"><span class="kicker__rule" aria-hidden="true"></span>${text}</p>`;

export const variant: Variant = {
  id: "08-split",
  name: "Split Sticky",
  blurb:
    "Tela dividida: a foto ocupa metade e troca sozinha conforme a leitura desce. Escritório de arquitetura, portfólio de fotógrafo.",
  tags: ["split-screen", "sticky", "fotográfico", "claro"],
  accent: "#255AA6",
  scheme: "light",
  client: true,
  fonts: [
    "https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600&family=Prata&display=swap",
  ],

  render: (site) => html`
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>

    <header class="head">
      <div class="head__in">
        <div class="head__brand">
          <a class="head__logo" href="${u("/")}" aria-label="${site.name}">
            ${logo("horizontal", { className: "logo" })}
          </a>
        </div>
        <div class="head__side">
          <nav class="head__nav" aria-label="Principal">
            ${join(site.nav.map((n) => html`<a href="${n.href}">${n.label}</a>`))}
          </nav>
          <a class="head__cta" href="#agenda">Próximo encontro</a>
          <button
            class="head__burger"
            type="button"
            aria-expanded="false"
            aria-controls="menu-movel"
            aria-label="Abrir o menu"
          >
            <span aria-hidden="true"></span><span aria-hidden="true"></span>
          </button>
        </div>
      </div>
      <div class="head__panel" id="menu-movel" hidden>
        <nav aria-label="Menu">
          ${join(
            site.nav.map(
              (n) => html`
                <div class="head__group">
                  <a class="head__top" href="${n.href}">${n.label}</a>
                  ${n.children
                    ? html`<ul>
                        ${join(n.children.map((c) => html`<li><a href="${c.href}">${c.label}</a></li>`))}
                      </ul>`
                    : raw("")}
                </div>
              `,
            ),
          )}
        </nav>
        <a class="head__panel-cta" href="#agenda">Próximo encontro</a>
      </div>
    </header>

    <main class="split" id="conteudo">
      <nav class="rail" aria-label="Índice das seções">
        <ol>
          ${join(
            parts.map(
              (p, i) => html`
                <li>
                  <a
                    class="rail__item"
                    href="#${p.id}"
                    data-target="${p.id}"
                    aria-label="${p.label}"
                    title="${p.label}"
                    ${raw(i === 0 ? 'aria-current="true"' : "")}
                  >
                    <span class="rail__n">${two(i + 1)}</span>
                    <span class="rail__line" aria-hidden="true"></span>
                  </a>
                </li>
              `,
            ),
          )}
        </ol>
      </nav>

      <div class="flow">
        <!-- 01 — início -->
        <section class="sec sec--hero" id="inicio">
          ${media(1, site.hero.photo, "Início", true)}
          <div class="sec__body">
            <div class="hero__text">
              ${kicker(site.hero.kicker)}
              <h1 class="h1">${site.hero.title}</h1>
              <p class="lead">${site.hero.lead}</p>
              <p class="note">${site.hero.note}</p>
              <div class="actions">
                <a class="btn" href="${site.hero.primary.href}">${site.hero.primary.label}</a>
                <a class="link" href="${site.hero.secondary.href}">${site.hero.secondary.label}</a>
              </div>
              <p class="scroll-hint" aria-hidden="true">
                <span class="scroll-hint__line"></span>Role
              </p>
            </div>
          </div>
        </section>

        <!-- 02 — agenda -->
        <section class="sec" id="agenda">
          ${media(2, "salaAmpla", "Agenda")}
          <div class="sec__body">
            <header class="sec__head">
              ${kicker("Agenda")}
              <h2 class="h2">Próximos encontros</h2>
            </header>
            <ol class="events">
              ${join(
                site.events.map(
                  (e) => html`
                    <li class="event">
                      <div class="event__row">
                        <span class="event__kind">${e.kind}</span>
                        <span class="${e.free ? "event__price is-free" : "event__price"}">${e.price}</span>
                      </div>
                      <h3 class="event__title">${e.title}</h3>
                      <p class="event__sum">${e.summary}</p>
                      <dl class="event__meta">
                        <div>
                          <dt>Quando</dt>
                          <dd><time datetime="${e.date}">${e.when}</time></dd>
                        </div>
                        <div>
                          <dt>Onde</dt>
                          <dd>${e.place}</dd>
                        </div>
                      </dl>
                      <ul class="event__tags">
                        ${join(e.highlights.map((h) => html`<li>${h}</li>`))}
                      </ul>
                      <a class="event__go" href="${e.cta.href}">
                        ${e.cta.label}<span class="arrow" aria-hidden="true">→</span>
                      </a>
                    </li>
                  `,
                ),
              )}
            </ol>
          </div>
        </section>

        <!-- 03 — marcos -->
        <section class="sec" id="marcos">
          ${media(3, site.about.photo, "Marcos")}
          <div class="sec__body">
            <header class="sec__head">
              ${kicker(site.about.eyebrow)}
              <h2 class="h2">${site.about.title}</h2>
            </header>
            <div class="about__text">
              <p class="lead">${site.about.lead}</p>
              ${join(site.about.body.map((p) => html`<p class="prose">${rich(p)}</p>`))}
              <dl class="facts">
                ${join(
                  site.about.facts.map(
                    (f) => html`<div><dt>${f.value}</dt><dd>${f.label}</dd></div>`,
                  ),
                )}
              </dl>
              <a class="link" href="${site.about.cta.href}">${site.about.cta.label}</a>
            </div>
          </div>
        </section>

        <!-- 04 — frase -->
        <section class="sec sec--quote" id="frase">
          ${media(4, "frase", "Frase")}
          <div class="sec__body">
            <blockquote class="quote">
              <span class="quote__rule" aria-hidden="true"></span>
              <p>${site.quotes[0].text}</p>
              <cite>${site.quotes[0].source}</cite>
            </blockquote>
          </div>
        </section>

        <!-- 05 — satsang -->
        <section class="sec" id="satsang">
          ${media(5, site.satsang.photo, "Satsang")}
          <div class="sec__body">
            <header class="sec__head">
              ${kicker(site.satsang.eyebrow)}
              <h2 class="h2">${site.satsang.title}</h2>
              <p class="lead">${site.satsang.lead}</p>
            </header>
            <ol class="points">
              ${join(
                site.satsang.points.map(
                  (p, i) => html`
                    <li class="point">
                      <span class="point__n" aria-hidden="true">${two(i + 1)}</span>
                      <h3>${p.title}</h3>
                      <p>${p.text}</p>
                    </li>
                  `,
                ),
              )}
            </ol>
            <p class="satsang__cta">
              <a class="link" href="${site.satsang.cta.href}">${site.satsang.cta.label}</a>
            </p>
          </div>
        </section>

        <!-- 06 — mídia -->
        <section class="sec" id="midia">
          ${media(6, "explica", "Mídia")}
          <div class="sec__body">
            <header class="sec__head">
              ${kicker("Para ouvir e ler")}
              <h2 class="h2">O trabalho está todo publicado</h2>
            </header>
            <ul class="media">
              ${join(
                site.media.map((m) => {
                  const out = m.href.startsWith("http");
                  return html`
                    <li class="media__item">
                      <a
                        href="${m.href}"
                        ${raw(out ? 'target="_blank" rel="noopener"' : "")}
                      >
                        <span class="media__label">${m.label}</span>
                        <span class="media__main">
                          <span class="media__title">${m.title}</span>
                          <span class="media__desc">${m.description}</span>
                        </span>
                        <span class="media__meta">
                          ${m.meta}<span class="arrow" aria-hidden="true">${out ? "↗" : "→"}</span>
                        </span>
                      </a>
                    </li>
                  `;
                }),
              )}
            </ul>
          </div>
        </section>

        <!-- 07 — avisos -->
        <section class="sec sec--news" id="avisos">
          ${media(7, "acolhida", "Avisos")}
          <div class="sec__body">
            <div class="news">
              ${kicker("Newsletter")}
              <h2 class="h2 h2--sm">${site.newsletter.title}</h2>
              <p class="prose">${site.newsletter.text}</p>
              <form class="news__form" method="post" action="#">
                <label class="sr" for="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  placeholder="${site.newsletter.placeholder}"
                  required
                />
                <button type="submit">${site.newsletter.button}</button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>

    <footer class="foot">
      <div class="foot__in">
        <div class="foot__brand">
          ${logo("vertical", { className: "foot__logo", tone: "branco" })}
          <p class="foot__tagline">${site.footer.tagline}</p>
        </div>
        <nav class="foot__nav" aria-label="Rodapé">
          ${join(
            site.nav.map(
              (n) => html`
                <div class="foot__col">
                  <h3>${n.label}</h3>
                  <ul>
                    ${n.children
                      ? join(n.children.map((c) => html`<li><a href="${c.href}">${c.label}</a></li>`))
                      : html`<li><a href="${n.href}">Ver ${n.label}</a></li>`}
                  </ul>
                </div>
              `,
            ),
          )}
          <div class="foot__col">
            <h3>Contato</h3>
            <ul>
              <li><a href="${site.contact.whatsappHref}">WhatsApp ${site.contact.whatsapp}</a></li>
              <li><a href="mailto:${site.contact.email}">${site.contact.email}</a></li>
              <li class="foot__person">${site.contact.person} — ${site.contact.role}</li>
            </ul>
          </div>
        </nav>
        <div class="foot__bottom">
          <ul class="foot__social">
            ${join(
              site.social.map(
                (s) => html`<li><a href="${s.href}" target="_blank" rel="noopener">${s.label}</a></li>`,
              ),
            )}
          </ul>
          <p class="foot__credit">${site.footer.credit}</p>
        </div>
      </div>
    </footer>
  `,
};
