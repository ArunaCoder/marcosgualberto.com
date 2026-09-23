import { html, join, rich, raw } from "../../lib/html.js";
import { img } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import { u } from "../../lib/base.js";
import type { Variant } from "../../lib/types.js";

/** 01, 02, 03… — numeração de catálogo. */
const nn = (i: number): string => String(i + 1).padStart(2, "0");

/** Camada decorativa: as 12 linhas da grade, alinhadas às colunas do conteúdo. */
const rulegrid = raw(`<div class="rulegrid" aria-hidden="true">${"<i></i>".repeat(12)}</div>`);

/** Rótulo numerado da seção: 02 / Agenda */
const idx = (n: string, label: string) =>
  html`<p class="idx">
    <span class="idx__n">${n}</span><span class="idx__s" aria-hidden="true">/</span
    ><span class="idx__l">${label}</span>
  </p>`;

export const variant: Variant = {
  id: "04-suico",
  name: "Grid Suíço",
  blurb:
    "Estilo internacional: grade de 12 colunas à vista, rótulos numerados, uma sans neutra e uma cor só. Catálogo de museu.",
  tags: ["suíço", "grid", "claro", "tipográfico", "institucional"],
  accent: "#255AA6",
  scheme: "light",
  client: true,
  fonts: [
    "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap",
  ],

  render: (site) => html`
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>

    <header class="hd">
      <div class="hd__meta">
        <div class="wrap hd__metarow">
          <p class="hd__now">
            <span class="tick" aria-hidden="true"></span>
            <span class="micro hd__now-l">Próximo</span>
            <span class="hd__now-t">${site.events[0].title} — ${site.events[0].when}</span>
          </p>
          <div class="hd__metaright">
            <span class="micro hd__domain">${site.domain}</span>
            <button class="hd__grid js-grid" type="button" aria-pressed="false">
              <span class="hd__grid-box" aria-hidden="true"></span>Grade
            </button>
          </div>
        </div>
      </div>

      <div class="hd__bar">
        <div class="wrap hd__barrow">
          <a class="hd__logo" href="${u("/")}" aria-label="${site.name}">
            ${logo("horizontal", { className: "logo" })}
          </a>
          <nav class="hd__nav" aria-label="Principal">
            ${join(site.nav.map((n) => html`<a href="${n.href}">${n.label}</a>`))}
          </nav>
          <a class="hd__cta" href="#agenda">Próximo encontro</a>
          <button
            class="hd__burger js-menu"
            type="button"
            aria-expanded="false"
            aria-controls="menu-movel"
          >
            <span class="sr">Menu</span>
            <span aria-hidden="true"></span><span aria-hidden="true"></span>
          </button>
        </div>
      </div>

      <div class="hd__panel" id="menu-movel" hidden>
        <nav class="wrap hd__panelnav" aria-label="Principal (celular)">
          ${join(
            site.nav.map(
              (n, i) => html`
                <a href="${n.href}"><span class="micro">${nn(i)}</span>${n.label}</a>
              `,
            ),
          )}
          <a class="hd__panelcta" href="#agenda">Próximo encontro</a>
        </nav>
      </div>
    </header>

    <main id="conteudo">
      <!-- 01 ------------------------------------------------------------- -->
      <section class="sec sec--hero sec--grid">
        <div class="wrap">
          ${rulegrid}
          <div class="grid hero">
            ${idx("01", site.hero.kicker)}
            <h1 class="hero__t">${site.hero.title}</h1>
            <div class="hero__side">
              <p class="hero__lead">${site.hero.lead}</p>
              <p class="hero__note">
                <span class="tick tick--blue" aria-hidden="true"></span>${site.hero.note}
              </p>
              <div class="hero__act">
                <a class="btn" href="${site.hero.primary.href}">${site.hero.primary.label}</a>
                <a class="lnk" href="${site.hero.secondary.href}">${site.hero.secondary.label}</a>
              </div>
            </div>
            <figure class="hero__fig">
              ${img(site.hero.photo, {
                eager: true,
                sizes: "(max-width: 860px) 100vw, 40vw",
                ratio: "4 / 5",
              })}
              <figcaption class="cap">
                <span class="micro">Fig. 01</span><span class="cap__s" aria-hidden="true">/</span
                >Satsang
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <!-- 02 ------------------------------------------------------------- -->
      <section class="sec sec--agenda" id="agenda">
        <div class="wrap">
          ${rulegrid}
          <div class="grid sechead">
            ${idx("02", "Agenda")}
            <h2 class="sechead__t">Próximos encontros</h2>
            <p class="sechead__meta">
              <span class="micro">Total</span>${site.events.length} registros
            </p>
          </div>

          <div class="tbl">
            <div class="tbl__head grid" aria-hidden="true">
              <span class="tbl__h tbl__h--n">Nº</span>
              <span class="tbl__h tbl__h--main">Encontro</span>
              <span class="tbl__h tbl__h--when">Quando</span>
              <span class="tbl__h tbl__h--where">Onde</span>
              <span class="tbl__h tbl__h--price">Valor</span>
              <span class="tbl__h tbl__h--cta"></span>
            </div>
            <ol class="tbl__body">
              ${join(
                site.events.map(
                  (e, i) => html`
                    <li class="ev grid" data-kind="${e.kind}">
                      <span class="ev__n">${nn(i)}</span>
                      <div class="ev__main">
                        <p class="micro ev__kind">${e.kind}</p>
                        <h3 class="ev__t">${e.title}</h3>
                        <p class="ev__sum">${e.summary}</p>
                        <ul class="ev__tags">
                          ${join(e.highlights.map((h) => html`<li>${h}</li>`))}
                        </ul>
                      </div>
                      <div class="ev__when">
                        <span class="micro ev__lab">Quando</span>
                        <time datetime="${e.date}">${e.when}</time>
                      </div>
                      <div class="ev__where">
                        <span class="micro ev__lab">Onde</span>
                        <span>${e.place}</span>
                      </div>
                      <div class="ev__price">
                        <span class="micro ev__lab">Valor</span>
                        <span class="${e.free ? "is-free" : ""}">${e.price}</span>
                      </div>
                      <a class="ev__cta" href="${e.cta.href}">
                        ${e.cta.label}<span class="arw" aria-hidden="true">→</span>
                      </a>
                    </li>
                  `,
                ),
              )}
            </ol>
          </div>
        </div>
      </section>

      <!-- 03 ------------------------------------------------------------- -->
      <section class="sec sec--pale sec--about" id="marcos">
        <div class="wrap">
          ${rulegrid}
          <div class="grid sechead">
            ${idx("03", site.about.eyebrow)}
            <h2 class="sechead__t">${site.about.title}</h2>
            <p class="sechead__meta"><span class="micro">Desde</span>1962</p>
          </div>

          <div class="grid about">
            <figure class="about__fig">
              ${img(site.about.photo, { sizes: "(max-width: 860px) 100vw, 32vw", ratio: "3 / 4" })}
              <figcaption class="cap">
                <span class="micro">Fig. 02</span><span class="cap__s" aria-hidden="true">/</span
                >${site.about.title}
              </figcaption>
            </figure>
            <div class="about__txt">
              <p class="about__lead">${site.about.lead}</p>
              ${join(site.about.body.map((p) => html`<p class="about__p">${rich(p)}</p>`))}
              <dl class="facts">
                ${join(
                  site.about.facts.map(
                    (f) => html`
                      <div class="fact">
                        <dt>${f.value}</dt>
                        <dd class="micro">${f.label}</dd>
                      </div>
                    `,
                  ),
                )}
              </dl>
              <a class="lnk" href="${site.about.cta.href}">${site.about.cta.label}</a>
            </div>
          </div>
        </div>
      </section>

      <!-- 04 ------------------------------------------------------------- -->
      <section class="sec sec--dark sec--grid sec--quote" aria-label="Citação">
        <div class="wrap">
          ${rulegrid}
          <div class="grid quote">
            ${idx("04", "Citação")}
            <blockquote class="quote__b">
              <p>“${site.quotes[0].text}”</p>
              <cite class="micro">${site.quotes[0].source}</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <!-- 05 ------------------------------------------------------------- -->
      <section class="sec sec--grid sec--satsang" id="satsang">
        <div class="wrap">
          ${rulegrid}
          <div class="grid sechead sechead--split">
            ${idx("05", site.satsang.eyebrow)}
            <h2 class="sechead__t sechead__t--wide">${site.satsang.title}</h2>
            <p class="satsang__lead">${site.satsang.lead}</p>
          </div>

          <ol class="grid points">
            ${join(
              site.satsang.points.map(
                (p, i) => html`
                  <li class="point">
                    <span class="micro point__n">${nn(i)}</span>
                    <h3 class="point__t">${p.title}</h3>
                    <p class="point__p">${p.text}</p>
                  </li>
                `,
              ),
            )}
          </ol>

          <figure class="satsang__fig">
            ${img(site.satsang.photo, { sizes: "100vw", ratio: "21 / 9" })}
            <figcaption class="cap satsang__cap">
              <span class="cap__l"
                ><span class="micro">Fig. 03</span
                ><span class="cap__s" aria-hidden="true">/</span>Encontro</span
              >
              <a class="lnk lnk--sm" href="${site.satsang.cta.href}">${site.satsang.cta.label}</a>
            </figcaption>
          </figure>
        </div>
      </section>

      <!-- 06 ------------------------------------------------------------- -->
      <section class="sec sec--pale sec--media">
        <div class="wrap">
          ${rulegrid}
          <div class="grid sechead">
            ${idx("06", "Mídia")}
            <h2 class="sechead__t">Publicações</h2>
            <p class="sechead__meta"><span class="micro">Canais</span>${site.media.length}</p>
          </div>

          <ul class="grid media">
            ${join(
              site.media.map(
                (m, i) => html`
                  <li class="mitem">
                    <a href="${m.href}">
                      <span class="micro mitem__n">${nn(i)}</span>
                      <span class="micro mitem__label">${m.label}</span>
                      <h3 class="mitem__t">${m.title}</h3>
                      <p class="mitem__d">${m.description}</p>
                      <span class="mitem__meta"
                        >${m.meta}<span class="arw" aria-hidden="true">→</span></span
                      >
                    </a>
                  </li>
                `,
              ),
            )}
          </ul>
        </div>
      </section>

      <!-- 07 ------------------------------------------------------------- -->
      <section class="sec sec--news">
        <div class="wrap">
          ${rulegrid}
          <div class="grid news">
            ${idx("07", "Newsletter")}
            <div class="news__txt">
              <h2 class="news__t">${site.newsletter.title}</h2>
              <p class="news__p">${site.newsletter.text}</p>
            </div>
            <form class="news__form" method="post" action="#">
              <label class="micro news__lab" for="email">E-mail</label>
              <div class="news__row">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="${site.newsletter.placeholder}"
                  required
                />
                <button class="btn btn--sq" type="submit">${site.newsletter.button}</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>

    <footer class="ft">
      <div class="wrap">
        ${rulegrid}
        <div class="grid ft__top">
          <div class="ft__brand">
            ${logo("vertical", { className: "ft__logo", tone: "branco" })}
            <p class="ft__tag">${site.footer.tagline}</p>
            <div class="ft__col ft__col--contact">
              <h2 class="micro ft__h"><span class="ft__hn">—</span>Contato</h2>
              <ul>
                <li><a href="${site.contact.whatsappHref}">WhatsApp ${site.contact.whatsapp}</a></li>
                <li><a href="mailto:${site.contact.email}">${site.contact.email}</a></li>
                <li class="ft__person">${site.contact.person} — ${site.contact.role}</li>
              </ul>
            </div>
          </div>
          <nav class="ft__nav" aria-label="Rodapé">
            ${join(
              site.nav.map(
                (n, i) => html`
                  <div class="ft__col">
                    <h2 class="micro ft__h">
                      <span class="ft__hn">${nn(i)}</span>${n.label}
                    </h2>
                    <ul>
                      ${n.children
                        ? join(n.children.map((c) => html`<li><a href="${c.href}">${c.label}</a></li>`))
                        : raw(`<li><a href="${n.href}">${n.label}</a></li>`)}
                    </ul>
                  </div>
                `,
              ),
            )}
          </nav>
        </div>

        <div class="grid ft__bottom">
          <ul class="ft__social">
            ${join(site.social.map((s) => html`<li><a href="${s.href}">${s.label}</a></li>`))}
          </ul>
          <p class="micro ft__credit">${site.footer.credit}</p>
        </div>
      </div>
    </footer>
  `,
};
