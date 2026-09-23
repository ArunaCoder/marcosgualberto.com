import { html, join, rich, raw } from "../../lib/html.js";
import { img } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import { u } from "../../lib/base.js";
import type { Variant } from "../../lib/types.js";
import type { PhotoKey } from "../../content/site.js";

/** Stills de apoio para os cartões da agenda, na ordem dos eventos. */
const STILLS: readonly PhotoKey[] = ["gesto", "salaAmpla", "publico"];

const KIND: Record<"online" | "presencial" | "retiro", string> = {
  online: "Online",
  presencial: "Presencial",
  retiro: "Retiro",
};

function day(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );
}

function month(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" })
    .format(new Date(`${iso}T12:00:00Z`))
    .replace(".", "")
    .toUpperCase();
}

function year(iso: string): string {
  return iso.slice(0, 4);
}

const arrow = () =>
  raw(
    `<svg class="arw" viewBox="0 0 22 12" aria-hidden="true" focusable="false"><path d="M15.4.8 20.6 6l-5.2 5.2M20.6 6H0" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="square"/></svg>`,
  );

export const variant: Variant = {
  id: "03-cinema",
  name: "Dark Cinema",
  blurb:
    "Sala escura: foto em tela cheia, serifa de display sobre o preto e o laranja como único ponto de luz.",
  tags: ["escuro", "cinematográfico", "full-bleed", "serifa de display"],
  accent: "#EF7911",
  scheme: "dark",
  client: true,
  fonts: [
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap",
  ],

  render: (site) => {
    /** primeiro evento da lista, usado na faixa fixa do hero */
    const next = site.events[0];

    return html`
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>

    <header class="hdr" data-hdr>
      <div class="hdr__in">
        <a class="hdr__logo" href="${u("/")}" aria-label="${site.name}">
          ${logo("horizontal", { className: "logo", tone: "branco" })}
        </a>
        <nav class="hdr__nav" aria-label="Principal">
          ${join(site.nav.map((n) => html`<a href="${n.href}">${n.label}</a>`))}
        </nav>
        <div class="hdr__end">
          <a class="btn btn--solid btn--sm" href="#agenda">Próximo encontro</a>
          <button
            class="burger"
            type="button"
            aria-expanded="false"
            aria-controls="menu-movel"
            aria-label="Abrir menu"
            data-burger
          >
            <span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <div class="menu" id="menu-movel" data-menu hidden>
      <nav class="menu__nav" aria-label="Menu móvel">
        ${join(
          site.nav.map(
            (n) => html`
              <div class="menu__group">
                <a class="menu__top" href="${n.href}">${n.label}</a>
                ${n.children
                  ? html`<ul>
                      ${join(
                        n.children.map((c) => html`<li><a href="${c.href}">${c.label}</a></li>`),
                      )}
                    </ul>`
                  : ""}
              </div>
            `,
          ),
        )}
      </nav>
      <a class="btn btn--solid menu__cta" href="#agenda">Próximo encontro</a>
    </div>

    <main id="conteudo">
      <section class="hero">
        <div class="hero__media">
          ${img(site.hero.photo, {
            eager: true,
            sizes: "100vw",
            className: "hero__img",
            focus: "50% 24%",
          })}
          <span class="hero__scrim" aria-hidden="true"></span>
        </div>

        <div class="hero__in">
          <p class="eyebrow"><span class="dot" aria-hidden="true"></span>${site.hero.kicker}</p>
          <h1 class="hero__title">${site.hero.title}</h1>
          <div class="hero__cols">
            <div class="hero__copy">
              <p class="hero__lead">${site.hero.lead}</p>
              <p class="hero__note">${site.hero.note}</p>
            </div>
            <div class="hero__actions">
              <a class="btn btn--solid" href="${site.hero.primary.href}"
                >${site.hero.primary.label}${arrow()}</a
              >
              <a class="btn btn--ghost" href="${site.hero.secondary.href}"
                >${site.hero.secondary.label}</a
              >
            </div>
          </div>
        </div>

        <a class="rail" href="#agenda">
          <span class="rail__tag">A seguir</span>
          <span class="rail__title">${next?.title}</span>
          <span class="rail__when">${next?.when}</span>
          <span class="rail__price">${next?.price}</span>
          <span class="rail__arrow" aria-hidden="true">${arrow()}</span>
        </a>
      </section>

      <section class="sec agenda" id="agenda">
        <div class="sec__head">
          <div>
            <p class="eyebrow"><span class="dot" aria-hidden="true"></span>Agenda</p>
            <h2 class="sec__title">Próximos encontros</h2>
          </div>
          <a class="link" href="/agenda">Ver a agenda completa${arrow()}</a>
        </div>

        <ol class="events">
          ${join(
            site.events.map(
              (e, i) => html`
                <li class="event" data-kind="${e.kind}">
                  <a class="event__link" href="${e.cta.href}">
                    <span class="event__date">
                      <span class="event__day">${day(e.date)}</span>
                      <span class="event__mon">${month(e.date)}</span>
                      <span class="event__year">${year(e.date)}</span>
                    </span>

                    <span class="event__still">
                      ${img(STILLS[i] ?? "conversa", {
                        sizes: "(max-width: 960px) 100vw, 22vw",
                        ratio: "16 / 10",
                      })}
                    </span>

                    <span class="event__main">
                      <span class="event__kind">${KIND[e.kind]}</span>
                      <span class="event__title">${e.title}</span>
                      <span class="event__summary">${e.summary}</span>
                      <span class="event__tags">
                        ${join(e.highlights.map((h) => html`<span>${h}</span>`))}
                      </span>
                    </span>

                    <span class="event__meta">
                      <span class="event__row"
                        ><span class="event__k">Quando</span
                        ><time class="event__v" datetime="${e.date}">${e.when}</time></span
                      >
                      <span class="event__row"
                        ><span class="event__k">Onde</span
                        ><span class="event__v">${e.place}</span></span
                      >
                      <span class="event__row"
                        ><span class="event__k">Quanto</span
                        ><span class="event__v ${e.free ? "is-free" : ""}">${e.price}</span></span
                      >
                    </span>

                    <span class="event__cta">${e.cta.label}${arrow()}</span>
                  </a>
                </li>
              `,
            ),
          )}
        </ol>
      </section>

      <section class="sec about" id="marcos">
        <figure class="about__fig">
          ${img(site.about.photo, {
            sizes: "(max-width: 960px) 100vw, 40vw",
            ratio: "4 / 5",
            className: "about__img",
          })}
        </figure>
        <div class="about__text">
          <p class="eyebrow"><span class="dot" aria-hidden="true"></span>${site.about.eyebrow}</p>
          <h2 class="sec__title">${site.about.title}</h2>
          <p class="about__lead">${site.about.lead}</p>
          ${join(site.about.body.map((p) => html`<p class="about__p">${rich(p)}</p>`))}
          <dl class="facts">
            ${join(
              site.about.facts.map(
                (f) => html`<div class="fact"><dt>${f.value}</dt><dd>${f.label}</dd></div>`,
              ),
            )}
          </dl>
          <a class="link" href="${site.about.cta.href}">${site.about.cta.label}${arrow()}</a>
        </div>
      </section>

      <section class="quote">
        <div class="quote__media">
          ${img("frase", { sizes: "100vw", className: "quote__img", focus: "50% 40%" })}
          <span class="quote__scrim" aria-hidden="true"></span>
        </div>
        <figure class="quote__in">
          <blockquote><p>“${site.quotes[0].text}”</p></blockquote>
          <figcaption>${site.quotes[0].source}</figcaption>
        </figure>
      </section>

      <section class="sec satsang" id="satsang">
        <div class="satsang__head">
          <p class="eyebrow"><span class="dot" aria-hidden="true"></span>${site.satsang.eyebrow}</p>
          <h2 class="sec__title">${site.satsang.title}</h2>
          <p class="satsang__lead">${site.satsang.lead}</p>
          <a class="link" href="${site.satsang.cta.href}">${site.satsang.cta.label}${arrow()}</a>
          <figure class="satsang__fig">
            ${img(site.satsang.photo, {
              sizes: "(max-width: 960px) 100vw, 42vw",
              ratio: "3 / 2",
            })}
          </figure>
        </div>
        <ol class="points">
          ${join(
            site.satsang.points.map(
              (p, i) => html`
                <li class="point">
                  <span class="point__n">${String(i + 1).padStart(2, "0")}</span>
                  <div class="point__body">
                    <h3>${p.title}</h3>
                    <p>${p.text}</p>
                  </div>
                </li>
              `,
            ),
          )}
        </ol>
      </section>

      <section class="sec media">
        <div class="sec__head">
          <div>
            <p class="eyebrow"><span class="dot" aria-hidden="true"></span>Para ouvir e ler</p>
            <h2 class="sec__title">O trabalho está todo publicado</h2>
          </div>
        </div>
        <ul class="media__grid">
          ${join(
            site.media.map(
              (m) => html`
                <li class="card">
                  <a href="${m.href}">
                    <span class="card__label">${m.label}</span>
                    <span class="card__title">${m.title}</span>
                    <span class="card__desc">${m.description}</span>
                    <span class="card__meta">${m.meta}${arrow()}</span>
                  </a>
                </li>
              `,
            ),
          )}
        </ul>
      </section>

      <section class="news">
        <div class="news__in">
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
              placeholder="${site.newsletter.placeholder}"
              autocomplete="email"
              required
            />
            <button class="btn btn--solid" type="submit">${site.newsletter.button}</button>
          </form>
        </div>
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
              (n) => html`
                <div class="foot__col">
                  <h3>${n.label}</h3>
                  <ul>
                    ${n.children
                      ? join(
                          n.children.map((c) => html`<li><a href="${c.href}">${c.label}</a></li>`),
                        )
                      : raw(`<li><a href="${n.href}">${n.label}</a></li>`)}
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
        <ul class="foot__social">
          ${join(site.social.map((s) => html`<li><a href="${s.href}">${s.label}</a></li>`))}
        </ul>
        <p class="foot__credit">${site.footer.credit}</p>
      </div>
    </footer>
  `;
  },
};
