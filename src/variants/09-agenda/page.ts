import { html, join, rich, raw, type Raw } from "../../lib/html.js";
import { img } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import { u } from "../../lib/base.js";
import type { Variant } from "../../lib/types.js";
import type { Site } from "../../content/site.js";

type Ev = Site["events"][number];

/** Rótulo curto de modalidade, para o badge do card. */
const KIND_LABEL: Record<Ev["kind"], string> = {
  online: "Online",
  presencial: "Presencial",
  retiro: "Presencial",
};

/** "Presencial" no filtro cobre tanto encontro presencial quanto retiro. */
function isLimited(text: string): boolean {
  return /limitad/i.test(text);
}

function daysUntil(iso: string): number {
  const parts = iso.split("-").map((n) => Number(n));
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (y === undefined || m === undefined || d === undefined) return 0;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.UTC(y, m - 1, d) - today) / 86400000);
}

function countdownLabel(days: number): string {
  if (days < 0) return "em breve";
  if (days === 0) return "hoje";
  if (days === 1) return "amanhã";
  return `em ${days} dias`;
}

function countdown(e: Ev): Raw {
  return html`<span class="count" data-countdown data-date="${e.date}"
    ><span class="count__dot" aria-hidden="true"></span>${countdownLabel(daysUntil(e.date))}</span
  >`;
}

function badges(e: Ev): Raw {
  const limited = e.highlights.some((h) => isLimited(h));
  return html`
    <ul class="badges">
      <li class="badge badge--kind" data-kind="${e.kind}">
        <span class="badge__dot" aria-hidden="true"></span>${KIND_LABEL[e.kind]}
      </li>
      <li class="badge ${e.free ? "badge--free" : "badge--price"}">${e.free ? "Gratuito" : e.price}</li>
      ${limited ? html`<li class="badge badge--alert">Vagas limitadas</li>` : ""}
    </ul>
  `;
}

function meta(e: Ev): Raw {
  return html`
    <dl class="meta">
      <div>
        <dt>Quando</dt>
        <dd><time datetime="${e.date}">${e.when}</time></dd>
      </div>
      <div>
        <dt>Onde</dt>
        <dd>${e.place}</dd>
      </div>
      <div>
        <dt>Quanto</dt>
        <dd class="${e.free ? "is-free" : ""}">${e.price}</dd>
      </div>
    </dl>
  `;
}

function chips(e: Ev): Raw {
  const rest: readonly string[] = e.highlights;
  const visible = rest.filter((h) => !isLimited(h));
  if (visible.length === 0) return raw("");
  return html`<ul class="chips">${join(visible.map((h) => html`<li>${h}</li>`))}</ul>`;
}

const PHOTO: Record<Ev["kind"], "maos" | "sala" | "publico"> = {
  online: "maos",
  retiro: "sala",
  presencial: "publico",
};

function eventCard(e: Ev, featured: boolean): Raw {
  return html`
    <li class="event ${featured ? "event--next" : ""}" data-kind="${e.kind}">
      <div class="event__media">
        ${img(PHOTO[e.kind], {
          sizes: featured ? "(max-width: 900px) 100vw, 40vw" : "(max-width: 900px) 100vw, 30vw",
          ratio: featured ? "4 / 3" : "16 / 9",
          eager: featured,
          className: "event__img",
        })}
      </div>
      <div class="event__body">
        ${featured
          ? html`<p class="event__flag"><span>Próximo encontro</span>${countdown(e)}</p>`
          : html`<p class="event__flag event__flag--quiet">${countdown(e)}</p>`}
        ${badges(e)}
        <h3 class="event__title">${e.title}</h3>
        <p class="event__summary">${e.summary}</p>
        ${meta(e)} ${chips(e)}
        <a class="btn ${featured ? "btn--primary" : "btn--ghost"} event__cta" href="${e.cta.href}">
          ${e.cta.label}<span class="btn__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </li>
  `;
}

export const variant: Variant = {
  id: "09-agenda",
  name: "Agenda Utilitária",
  blurb:
    "O site como produto: a agenda sobe para o topo, com cards, badges e filtro que funciona. Achar e entrar no próximo encontro em cinco segundos.",
  tags: ["produto", "agenda", "claro", "denso"],
  accent: "#255AA6",
  scheme: "light",
  client: true,
  fonts: [
    "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@400;500;600&display=swap",
  ],

  render: (site) => {
    const events = [...site.events].sort((a, b) => a.date.localeCompare(b.date));
    const next = events[0] ?? site.events[0];

    return html`
      <a class="skip" href="#conteudo">Pular para o conteúdo</a>

      <div class="ticker">
        <div class="ticker__in">
          <p class="ticker__text">
            <strong>Próximo encontro</strong>
            <span class="ticker__count">${countdown(next)}</span>
            <span class="ticker__sep" aria-hidden="true"></span>
            <span class="ticker__what">${next.title} — ${next.when}</span>
          </p>
          <a class="ticker__link" href="${next.cta.href}"
            >${next.cta.label}<span aria-hidden="true">→</span></a
          >
        </div>
      </div>

      <header class="site">
        <div class="site__in">
          <a class="site__logo" href="${u("/")}" aria-label="${site.name}">
            ${logo("horizontal", { className: "logo" })}
          </a>
          <nav class="site__nav" aria-label="Principal">
            ${join(site.nav.map((n) => html`<a href="${n.href}">${n.label}</a>`))}
          </nav>
          <div class="site__actions">
            <a class="btn btn--primary btn--sm site__cta" href="#agenda">Ver agenda</a>
            <button
              class="site__toggle"
              type="button"
              aria-expanded="false"
              aria-controls="menu-movel"
              aria-label="Abrir menu"
            >
              <span aria-hidden="true"></span><span aria-hidden="true"></span
              ><span aria-hidden="true"></span>
            </button>
          </div>
        </div>
        <div class="site__mobile" id="menu-movel" hidden>
          <nav aria-label="Principal (celular)">
            ${join(site.nav.map((n) => html`<a href="${n.href}">${n.label}</a>`))}
          </nav>
          <a class="btn btn--primary" href="#agenda">Ver agenda</a>
        </div>
      </header>

      <main id="conteudo">
        <section class="hero">
          <div class="hero__in">
            <div class="hero__text">
              <p class="eyebrow"><span class="eyebrow__mark" aria-hidden="true"></span>${site.hero.kicker}</p>
              <h1 class="hero__title">${site.hero.title}</h1>
              <p class="hero__lead">${site.hero.lead}</p>
              <p class="hero__note">${site.hero.note}</p>
              <div class="hero__actions">
                <a class="btn btn--primary" href="${site.hero.primary.href}"
                  >${site.hero.primary.label}<span class="btn__arrow" aria-hidden="true">→</span></a
                >
                <a class="btn btn--ghost" href="${site.hero.secondary.href}">${site.hero.secondary.label}</a>
              </div>
            </div>
            <figure class="hero__figure">
              ${img(site.hero.photo, {
                eager: true,
                sizes: "(max-width: 980px) 100vw, 44vw",
                ratio: "5 / 4",
                className: "hero__img",
              })}
              <figcaption>Satsang. Ele ri bastante — o assunto é que é sério.</figcaption>
            </figure>
          </div>
        </section>

        <section class="agenda" id="agenda">
          <div class="agenda__in">
            <div class="agenda__head">
              <div>
                <p class="eyebrow"><span class="eyebrow__mark" aria-hidden="true"></span>Agenda</p>
                <h2 class="h2">Próximos encontros</h2>
                <p class="agenda__sub">
                  ${site.satsang.points[3]?.text ?? ""}
                </p>
              </div>
              <form class="filters" id="filtros">
                <fieldset>
                  <legend class="sr">Filtrar encontros por modalidade</legend>
                  <div class="filters__set">
                    <input type="radio" name="modo" id="f-todos" value="todos" checked />
                    <label for="f-todos">Todos</label>
                    <input type="radio" name="modo" id="f-online" value="online" />
                    <label for="f-online">Online</label>
                    <input type="radio" name="modo" id="f-presencial" value="presencial" />
                    <label for="f-presencial">Presencial</label>
                  </div>
                </fieldset>
                <p class="filters__status" id="agenda-status" role="status">
                  ${events.length} encontros
                </p>
              </form>
            </div>

            <ul class="events">
              ${join(events.map((e, i) => eventCard(e, i === 0)))}
            </ul>

            <p class="agenda__foot">
              <a class="link" href="/agenda">Ver agenda completa</a>
              <span aria-hidden="true">·</span>
              <span class="agenda__foot-help"
                >Dúvida sobre inscrição?
                <a class="link" href="${site.contact.whatsappHref}"
                  >Fale com ${site.contact.person} no WhatsApp</a
                ></span
              >
            </p>
          </div>
        </section>

        <section class="about" id="marcos">
          <div class="about__in">
            <figure class="about__figure">
              ${img(site.about.photo, {
                sizes: "(max-width: 900px) 100vw, 38vw",
                ratio: "4 / 5",
                className: "about__img",
              })}
            </figure>
            <div class="about__text">
              <p class="eyebrow"><span class="eyebrow__mark" aria-hidden="true"></span>${site.about.eyebrow}</p>
              <h2 class="h2 h2--serif">${site.about.title}</h2>
              <p class="about__lead">${site.about.lead}</p>
              ${join(site.about.body.map((p) => html`<p class="about__p">${rich(p)}</p>`))}
              <dl class="facts">
                ${join(
                  site.about.facts.map(
                    (f) => html`<div class="fact"><dt>${f.value}</dt><dd>${f.label}</dd></div>`,
                  ),
                )}
              </dl>
              <a class="link link--strong" href="${site.about.cta.href}"
                >${site.about.cta.label}<span aria-hidden="true">→</span></a
              >
            </div>
          </div>
        </section>

        <section class="quote">
          <div class="quote__in">
            ${logo("gota", { className: "quote__mark", label: "", tone: "branco" })}
            <blockquote>
              <p>“${site.quotes[0].text}”</p>
              <cite>${site.quotes[0].source}</cite>
            </blockquote>
          </div>
        </section>

        <section class="satsang" id="satsang">
          <div class="satsang__in">
            <div class="satsang__head">
              <p class="eyebrow"><span class="eyebrow__mark" aria-hidden="true"></span>${site.satsang.eyebrow}</p>
              <h2 class="h2 h2--serif">${site.satsang.title}</h2>
              <p class="satsang__lead">${site.satsang.lead}</p>
              <a class="link link--strong" href="${site.satsang.cta.href}"
                >${site.satsang.cta.label}<span aria-hidden="true">→</span></a
              >
            </div>
            <div class="satsang__body">
              <figure class="satsang__figure">
                ${img(site.satsang.photo, {
                  sizes: "(max-width: 900px) 100vw, 32vw",
                  ratio: "3 / 4",
                  className: "satsang__img",
                })}
              </figure>
              <ul class="points">
                ${join(
                  site.satsang.points.map(
                    (p, i) => html`
                      <li class="point">
                        <span class="point__n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
                        <h3>${p.title}</h3>
                        <p>${p.text}</p>
                      </li>
                    `,
                  ),
                )}
              </ul>
            </div>
          </div>
        </section>

        <section class="media">
          <div class="media__in">
            <div class="media__head">
              <p class="eyebrow"><span class="eyebrow__mark" aria-hidden="true"></span>Para ouvir e ler</p>
              <h2 class="h2">O trabalho está todo publicado</h2>
            </div>
            <ul class="media__list">
              ${join(
                site.media.map((m) => {
                  const ext = m.href.startsWith("http");
                  return html`
                    <li>
                      <a
                        href="${m.href}"
                        ${raw(ext ? 'target="_blank" rel="noopener"' : "")}
                        class="media__card"
                      >
                        <span class="media__label">${m.label}</span>
                        <h3>${m.title}</h3>
                        <p>${m.description}</p>
                        <span class="media__meta"
                          >${m.meta}<span class="media__arrow" aria-hidden="true"
                            >${ext ? "↗" : "→"}</span
                          ></span
                        >
                      </a>
                    </li>
                  `;
                }),
              )}
            </ul>
          </div>
        </section>

        <section class="news">
          <div class="news__in">
            <div class="news__text">
              <h2 class="h3">${site.newsletter.title}</h2>
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
              <button class="btn btn--primary" type="submit">${site.newsletter.button}</button>
            </form>
          </div>
        </section>
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
                        : html`<li><a href="${n.href}">${n.label}</a></li>`}
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
    `;
  },
};
