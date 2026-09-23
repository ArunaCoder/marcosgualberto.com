import { html, join, rich, raw } from "../../lib/html.js";
import { img } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import { u } from "../../lib/base.js";
import type { Variant } from "../../lib/types.js";

/** Rótulo de tela para o tipo de encontro. */
const KIND: Record<string, string> = {
  online: "Online",
  presencial: "Presencial",
  retiro: "Retiro",
};

/** Silhuetas de gota usadas como clip-path (unidades relativas à caixa). */
const shapes = raw(`
<svg class="shapes" width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    <clipPath id="gota-a" clipPathUnits="objectBoundingBox">
      <path d="M.5.015C.585.15.972.38.972.625C.972.84.76.99.5.99C.24.99.028.84.028.625C.028.38.415.15.5.015Z"/>
    </clipPath>
    <clipPath id="gota-b" clipPathUnits="objectBoundingBox">
      <path d="M.04.045C.20.03.63.12.83.29C.98.42 1 .70.86.855C.71 1.01.36 1.02.19.88C.02.74-.02.40.04.045Z"/>
    </clipPath>
  </defs>
</svg>`);

export const variant: Variant = {
  id: "07-gota",
  name: "Gota",
  blurb:
    "A gota da marca vira o sistema inteiro: silhuetas recortando as fotos, curvas grandes e degradês azul-laranja.",
  tags: ["marca", "orgânico", "degradê", "curvas"],
  accent: "#005EAA",
  scheme: "light",
  client: true,
  fonts: [
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  ],

  render: (site) => html`
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>
    ${shapes}

    <header class="top">
      <div class="top__bar">
        <a class="top__logo" href="${u("/")}" aria-label="${site.name}">
          ${logo("horizontal", { className: "logo" })}
        </a>
        <nav class="top__nav" aria-label="Principal">
          ${join(site.nav.map((n) => html`<a href="${n.href}">${n.label}</a>`))}
        </nav>
        <a class="top__cta" href="#agenda">Próximo encontro</a>
        <button
          class="top__burger"
          type="button"
          aria-expanded="false"
          aria-controls="menu-movel"
          aria-label="Abrir o menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="top__panel" id="menu-movel" hidden>
        <nav aria-label="Menu móvel">
          ${join(
            site.nav.map(
              (n) => html`<a href="${n.href}"><span class="pin" aria-hidden="true"></span>${n.label}</a>`,
            ),
          )}
        </nav>
        <a class="btn btn--solid" href="#agenda">Próximo encontro</a>
      </div>
    </header>

    <main id="conteudo">
      <!-- ------------------------------------------------------------ hero -->
      <section class="hero">
        <div class="hero__field" aria-hidden="true">
          <span class="blob blob--1"></span>
          <span class="blob blob--2"></span>
          <span class="outline outline--1"></span>
          <span class="outline outline--2"></span>
        </div>

        <div class="hero__text">
          <p class="eyebrow"><span class="pin" aria-hidden="true"></span>${site.hero.kicker}</p>
          <h1 class="hero__title">${site.hero.title}</h1>
          <p class="hero__lead">${site.hero.lead}</p>
          <div class="hero__acts">
            <a class="btn btn--solid" href="${site.hero.primary.href}">
              ${site.hero.primary.label}<span class="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a class="btn btn--ghost" href="${site.hero.secondary.href}">${site.hero.secondary.label}</a>
          </div>
          <p class="hero__note">${site.hero.note}</p>
        </div>

        <div class="hero__media">
          <span class="hero__echo" aria-hidden="true"></span>
          <figure class="hero__figure">
            ${img(site.hero.photo, {
              eager: true,
              sizes: "(max-width: 980px) 86vw, 42vw",
              ratio: "4 / 5",
              focus: "50% 34%",
              className: "hero__img",
            })}
          </figure>
          <p class="hero__chip">
            <span class="pin" aria-hidden="true"></span>
            <strong>${site.events[0].title}</strong>
            <span>${site.events[0].when}</span>
          </p>
        </div>
      </section>

      <!-- ---------------------------------------------------------- agenda -->
      <section class="agenda" id="agenda">
        <div class="head">
          <p class="eyebrow"><span class="pin" aria-hidden="true"></span>Agenda</p>
          <h2 class="head__title">Próximos encontros</h2>
        </div>

        <ul class="cards">
          ${join(
            site.events.map(
              (e) => html`
                <li class="card" data-kind="${e.kind}">
                  <span class="card__wave" aria-hidden="true"></span>
                  <div class="card__top">
                    <span class="tag tag--kind">${KIND[e.kind] ?? e.kind}</span>
                    <span class="tag ${e.free ? "tag--free" : "tag--price"}">${e.price}</span>
                  </div>
                  <h3 class="card__title">${e.title}</h3>
                  <p class="card__when"><time datetime="${e.date}">${e.when}</time></p>
                  <p class="card__place">${e.place}</p>
                  <p class="card__summary">${e.summary}</p>
                  <ul class="chips">
                    ${join(e.highlights.map((h) => html`<li>${h}</li>`))}
                  </ul>
                  <a class="card__cta" href="${e.cta.href}">
                    ${e.cta.label}<span class="btn__arrow" aria-hidden="true">→</span>
                  </a>
                </li>
              `,
            ),
          )}
        </ul>
      </section>

      <!-- ----------------------------------------------------------- sobre -->
      <section class="sobre" id="marcos">
        <div class="sobre__media">
          <span class="sobre__echo" aria-hidden="true"></span>
          <figure class="sobre__figure">
            ${img(site.about.photo, {
              sizes: "(max-width: 980px) 80vw, 38vw",
              ratio: "5 / 6",
              focus: "50% 32%",
            })}
          </figure>
        </div>

        <div class="sobre__text">
          <p class="eyebrow"><span class="pin" aria-hidden="true"></span>${site.about.eyebrow}</p>
          <h2 class="head__title">${site.about.title}</h2>
          <p class="sobre__lead">${site.about.lead}</p>
          ${join(site.about.body.map((p) => html`<p class="sobre__p">${rich(p)}</p>`))}
          <dl class="facts">
            ${join(
              site.about.facts.map(
                (f) => html`
                  <div class="fact">
                    <dt>${f.value}</dt>
                    <dd>${f.label}</dd>
                  </div>
                `,
              ),
            )}
          </dl>
          <a class="link" href="${site.about.cta.href}">
            ${site.about.cta.label}<span class="btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <!-- --------------------------------------------------------- citação -->
      <section class="quote">
        <div class="quote__mark" aria-hidden="true">${logo("gota", { label: "" })}</div>
        <blockquote class="quote__body">
          <p>“${site.quotes[0].text}”</p>
          <cite>${site.quotes[0].source}</cite>
        </blockquote>
      </section>

      <!-- --------------------------------------------------------- satsang -->
      <section class="satsang" id="satsang">
        <div class="head head--wide">
          <p class="eyebrow"><span class="pin" aria-hidden="true"></span>${site.satsang.eyebrow}</p>
          <h2 class="head__title">${site.satsang.title}</h2>
          <p class="satsang__lead">${site.satsang.lead}</p>
        </div>

        <ul class="points">
          ${join(
            site.satsang.points.map(
              (p, i) => html`
                <li class="point">
                  <span class="point__n" aria-hidden="true">${String(i + 1)}</span>
                  <h3>${p.title}</h3>
                  <p>${p.text}</p>
                </li>
              `,
            ),
          )}
        </ul>

        <figure class="satsang__figure">
          ${img(site.satsang.photo, { sizes: "100vw", ratio: "2 / 1", focus: "50% 42%" })}
          <figcaption>
            <a class="btn btn--solid" href="${site.satsang.cta.href}">
              ${site.satsang.cta.label}<span class="btn__arrow" aria-hidden="true">→</span>
            </a>
          </figcaption>
        </figure>
      </section>

      <!-- ----------------------------------------------------------- mídia -->
      <section class="midia">
        <div class="head">
          <p class="eyebrow"><span class="pin" aria-hidden="true"></span>Para ouvir e ler</p>
          <h2 class="head__title">O trabalho está todo publicado</h2>
        </div>
        <ul class="midia__list">
          ${join(
            site.media.map(
              (m) => html`
                <li>
                  <a href="${m.href}">
                    <span class="midia__label">${m.label}</span>
                    <h3>${m.title}</h3>
                    <p>${m.description}</p>
                    <span class="midia__meta">
                      ${m.meta}<span class="btn__arrow" aria-hidden="true">→</span>
                    </span>
                  </a>
                </li>
              `,
            ),
          )}
        </ul>
      </section>

      <!-- ------------------------------------------------------ newsletter -->
      <section class="news">
        <div class="news__panel">
          <span class="news__gota" aria-hidden="true">${logo("gota", { label: "", tone: "branco" })}</span>
          <div class="news__text">
            <h2>${site.newsletter.title}</h2>
            <p>${site.newsletter.text}</p>
          </div>
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
      </section>
    </main>

    <!-- ---------------------------------------------------------- rodapé -->
    <footer class="foot">
      <div class="foot__grid">
        <div class="foot__brand">
          ${logo("vertical", { className: "foot__logo" })}
          <p class="foot__tagline">${site.footer.tagline}</p>
          <ul class="foot__social">
            ${join(site.social.map((s) => html`<li><a href="${s.href}">${s.label}</a></li>`))}
          </ul>
        </div>

        <nav class="foot__nav" aria-label="Rodapé">
          ${join(
            site.nav.map(
              (n) => html`
                <div class="foot__col">
                  <h3><a href="${n.href}">${n.label}</a></h3>
                  <ul>
                    ${n.children
                      ? join(n.children.map((c) => html`<li><a href="${c.href}">${c.label}</a></li>`))
                      : html`<li><a href="${n.href}">Ver tudo</a></li>`}
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
      </div>

      <div class="foot__bottom">
        <span class="pin" aria-hidden="true"></span>
        <p>${site.footer.credit}</p>
      </div>
    </footer>
  `,
};
