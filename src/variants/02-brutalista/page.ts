import { html, join, rich, raw } from "../../lib/html.js";
import { img } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import { u } from "../../lib/base.js";
import type { Variant } from "../../lib/types.js";

const KIND = {
  online: "Online",
  presencial: "Presencial",
  retiro: "Retiro",
} as const;

const n2 = (i: number) => String(i + 1).padStart(2, "0");

const blank = (href: string) =>
  href.startsWith("http") ? raw(' target="_blank" rel="noopener"') : raw("");

export const variant: Variant = {
  id: "02-brutalista",
  name: "Brutalista Tipográfico",
  blurb:
    "Pôster suíço punk: fio preto grosso, blocos chapados de azul e laranja, manchete gigante encostada em metadado miúdo.",
  tags: ["brutalista", "tipográfico", "claro", "grid visível"],
  accent: "#EF7911",
  scheme: "light",
  client: true,
  fonts: [
    "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap",
  ],

  render: (site) => html`
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>

    <header class="head">
      <div class="head__bar">
        <a class="head__logo" href="${u("/")}" aria-label="${site.name}">
          ${logo("horizontal", { className: "logo" })}
        </a>
        <nav class="head__nav" aria-label="Principal">
          ${join(site.nav.map((item) => html`<a href="${item.href}">${item.label}</a>`))}
        </nav>
        <a class="head__cta" href="#agenda">Próximo encontro</a>
        <button class="head__toggle" type="button" aria-expanded="false" aria-controls="menu-movel">
          <span class="sr">Abrir menu</span>
          <span class="head__toggle-bar" aria-hidden="true"></span>
          <span class="head__toggle-bar" aria-hidden="true"></span>
        </button>
      </div>
      <div class="head__mobile" id="menu-movel" hidden>
        <nav aria-label="Menu móvel">
          ${join(site.nav.map((item) => html`<a href="${item.href}">${item.label}</a>`))}
        </nav>
        <a class="head__mobile-cta" href="#agenda">Próximo encontro</a>
      </div>
    </header>

    <main id="conteudo">
      <section class="hero">
        <p class="flag">
          <span class="flag__tag">${site.hero.kicker}</span>
          <span class="flag__meta">${site.domain}</span>
          <span class="flag__rule" aria-hidden="true"></span>
        </p>

        <h1 class="hero__title">${site.hero.title}</h1>

        <div class="hero__body">
          <div class="hero__text">
            <p class="hero__lead">${site.hero.lead}</p>
            <div class="hero__actions">
              <a class="btn btn--solid" href="${site.hero.primary.href}"
                >${site.hero.primary.label}<span aria-hidden="true">→</span></a
              >
              <a class="btn" href="${site.hero.secondary.href}">${site.hero.secondary.label}</a>
            </div>
          </div>

          <figure class="hero__fig">
            <span class="hero__fig-block" aria-hidden="true"></span>
            <span class="hero__fig-frame">
              ${img(site.hero.photo, {
                eager: true,
                sizes: "(max-width: 900px) 92vw, 42vw",
                ratio: "4 / 5",
              })}
            </span>
            <figcaption class="hero__cap">
              <span>${site.name}</span><span aria-hidden="true">/</span><span>${site.hero.kicker}</span>
            </figcaption>
          </figure>
        </div>

        <p class="ticker">
          <span class="ticker__item">${site.hero.note}</span>
          <span class="ticker__item ticker__item--alt">${site.events[0].when}</span>
        </p>
      </section>

      <section class="sec sec--agenda" id="agenda">
        <div class="sec-head">
          <p class="idx"><span class="idx__n">01</span><span class="idx__l">Agenda</span></p>
          <h2 class="sec-title">Próximos encontros</h2>
        </div>

        <ol class="events">
          ${join(
            site.events.map(
              (e, i) => html`
                <li class="event">
                  <div class="cell cell--idx">
                    <span class="event__n">${n2(i)}</span>
                    <span class="event__kind">${KIND[e.kind]}</span>
                  </div>
                  <div class="cell cell--main">
                    <h3 class="event__title">${e.title}</h3>
                    <p class="event__sum">${e.summary}</p>
                    <ul class="chips">${join(e.highlights.map((h) => html`<li>${h}</li>`))}</ul>
                  </div>
                  <dl class="cell cell--meta">
                    <div><dt>Quando</dt><dd><time datetime="${e.date}">${e.when}</time></dd></div>
                    <div><dt>Onde</dt><dd>${e.place}</dd></div>
                    <div>
                      <dt>Quanto</dt>
                      <dd class="${e.free ? "is-free" : ""}">${e.price}</dd>
                    </div>
                  </dl>
                  <div class="cell cell--go">
                    <a class="event__go" href="${e.cta.href}"
                      >${e.cta.label}<span aria-hidden="true">→</span></a
                    >
                  </div>
                </li>
              `,
            ),
          )}
        </ol>
      </section>

      <section class="sec sec--about" id="marcos">
        <div class="sec-head">
          <p class="idx">
            <span class="idx__n">02</span><span class="idx__l">${site.about.eyebrow}</span>
          </p>
          <h2 class="sec-title">${site.about.title}</h2>
        </div>

        <div class="about">
          <figure class="about__fig">
            <span class="about__fig-block" aria-hidden="true"></span>
            <span class="about__fig-frame">
              ${img(site.about.photo, { sizes: "(max-width: 900px) 92vw, 36vw", ratio: "3 / 4" })}
            </span>
          </figure>
          <div class="about__text">
            <p class="about__lead">${site.about.lead}</p>
            ${join(site.about.body.map((p) => html`<p class="about__p">${rich(p)}</p>`))}
            <a class="arrow" href="${site.about.cta.href}"
              >${site.about.cta.label}<span aria-hidden="true">→</span></a
            >
          </div>
        </div>

        <dl class="facts">
          ${join(
            site.about.facts.map(
              (f) => html`<div class="fact"><dt>${f.value}</dt><dd>${f.label}</dd></div>`,
            ),
          )}
        </dl>
      </section>

      <section class="quote">
        <blockquote class="quote__block">
          <p class="quote__text">${site.quotes[0].text}</p>
          <cite class="quote__cite">${site.quotes[0].source}</cite>
        </blockquote>
      </section>

      <section class="sec sec--satsang" id="satsang">
        <div class="sec-head">
          <p class="idx">
            <span class="idx__n">03</span><span class="idx__l">${site.satsang.eyebrow}</span>
          </p>
          <h2 class="sec-title">${site.satsang.title}</h2>
          <p class="sec-lead">${site.satsang.lead}</p>
        </div>

        <div class="cells points">
          ${join(
            site.satsang.points.map(
              (p, i) => html`
                <article class="cellbox point">
                  <span class="cellbox__n">${n2(i)}</span>
                  <h3 class="point__title">${p.title}</h3>
                  <p class="point__text">${p.text}</p>
                </article>
              `,
            ),
          )}
        </div>

        <figure class="band">
          ${img(site.satsang.photo, { sizes: "100vw", ratio: "21 / 9", className: "band__img" })}
          <figcaption class="band__cap">${site.satsang.eyebrow} — ${site.name}</figcaption>
        </figure>

        <a class="arrow arrow--big" href="${site.satsang.cta.href}"
          >${site.satsang.cta.label}<span aria-hidden="true">→</span></a
        >
      </section>

      <section class="sec sec--media">
        <div class="sec-head">
          <p class="idx"><span class="idx__n">04</span><span class="idx__l">Mídia</span></p>
          <h2 class="sec-title">Ouvir, ver e ler</h2>
        </div>

        <ul class="cells media">
          ${join(
            site.media.map(
              (m) => html`
                <li class="cellbox media__item">
                  <a href="${m.href}"${blank(m.href)}>
                    <span class="tag">${m.label}</span>
                    <h3 class="media__title">${m.title}</h3>
                    <p class="media__desc">${m.description}</p>
                    <span class="media__meta">${m.meta}<span aria-hidden="true">→</span></span>
                  </a>
                </li>
              `,
            ),
          )}
        </ul>
      </section>

      <section class="news">
        <div class="news__text">
          <h2 class="news__title">${site.newsletter.title}</h2>
          <p class="news__p">${site.newsletter.text}</p>
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
      </section>
    </main>

    <footer class="foot">
      <div class="foot__top">
        <div class="foot__brand">
          ${logo("vertical", { className: "foot__logo", tone: "branco" })}
          <p class="foot__tagline">${site.footer.tagline}</p>
        </div>
        <nav class="foot__nav" aria-label="Rodapé">
          ${join(
            site.nav.map(
              (item) => html`
                <div class="foot__col">
                  <h3>${item.label}</h3>
                  <ul>
                    ${item.children
                      ? join(
                          item.children.map((c) => html`<li><a href="${c.href}">${c.label}</a></li>`),
                        )
                      : raw(`<li><a href="${item.href}">${item.label}</a></li>`)}
                  </ul>
                </div>
              `,
            ),
          )}
          <div class="foot__col">
            <h3>Contato</h3>
            <ul>
              <li>
                <a href="${site.contact.whatsappHref}" target="_blank" rel="noopener"
                  >WhatsApp ${site.contact.whatsapp}</a
                >
              </li>
              <li><a href="mailto:${site.contact.email}">${site.contact.email}</a></li>
              <li class="foot__person">${site.contact.person} — ${site.contact.role}</li>
            </ul>
          </div>
        </nav>
      </div>

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
    </footer>
  `,
};
