import { html, join, rich, raw } from "../../lib/html.js";
import { img } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import { u } from "../../lib/base.js";
import type { Variant } from "../../lib/types.js";

export const variant: Variant = {
  id: "01-editorial",
  name: "Editorial Sereno",
  blurb:
    "Revista impressa: serifa grande, fios finos, muito branco e uma foto que respira. Calmo sem ser mole.",
  tags: ["editorial", "serifa", "claro", "grid assimétrico"],
  accent: "#1B4E8E",
  scheme: "light",
  client: true,
  fonts: [
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap",
  ],

  render: (site) => html`
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>

    <header class="head">
      <a class="head__logo" href="${u("/")}" aria-label="${site.name}">
        ${logo("horizontal", { className: "logo" })}
      </a>
      <nav class="head__nav" aria-label="Principal">
        ${join(site.nav.map((n) => html`<a href="${n.href}">${n.label}</a>`))}
      </nav>
      <a class="head__cta" href="#agenda">Próximo encontro</a>
      <button class="head__toggle" aria-expanded="false" aria-controls="menu-movel">
        <span></span><span></span>
      </button>
      <div class="head__mobile" id="menu-movel" hidden>
        ${join(site.nav.map((n) => html`<a href="${n.href}">${n.label}</a>`))}
        <a class="head__mobile-cta" href="#agenda">Próximo encontro</a>
      </div>
    </header>

    <main id="conteudo">
      <section class="hero">
        <div class="hero__text">
          <p class="kicker"><span class="kicker__rule"></span>${site.hero.kicker}</p>
          <h1 class="hero__title">${site.hero.title}</h1>
          <p class="hero__lead">${site.hero.lead}</p>
          <p class="hero__note">${site.hero.note}</p>
          <div class="hero__actions">
            <a class="btn" href="${site.hero.primary.href}">${site.hero.primary.label}</a>
            <a class="link" href="${site.hero.secondary.href}">${site.hero.secondary.label}</a>
          </div>
        </div>
        <figure class="hero__figure">
          ${img(site.hero.photo, {
            eager: true,
            sizes: "(max-width: 900px) 100vw, 46vw",
            ratio: "4 / 5",
            className: "hero__img",
          })}
          <figcaption>${site.hero.caption}</figcaption>
        </figure>
      </section>

      <section class="agenda" id="agenda">
        <div class="section-head">
          <p class="kicker"><span class="kicker__rule"></span>Agenda</p>
          <h2 class="section-title">Próximos encontros</h2>
        </div>
        <ol class="events">
          ${join(
            site.events.map(
              (e, i) => html`
                <li class="event" data-kind="${e.kind}">
                  <span class="event__n">${String(i + 1).padStart(2, "0")}</span>
                  <div class="event__main">
                    <h3 class="event__title">${e.title}</h3>
                    <p class="event__summary">${e.summary}</p>
                    <ul class="event__tags">
                      ${join(e.highlights.map((h) => html`<li>${h}</li>`))}
                    </ul>
                  </div>
                  <dl class="event__meta">
                    <div><dt>Quando</dt><dd><time datetime="${e.date}">${e.when}</time></dd></div>
                    <div><dt>Onde</dt><dd>${e.place}</dd></div>
                    <div>
                      <dt>Quanto</dt>
                      <dd class="${e.free ? "is-free" : ""}">${e.price}</dd>
                    </div>
                  </dl>
                  <a class="event__cta" href="${e.cta.href}">${e.cta.label}<span aria-hidden="true">→</span></a>
                </li>
              `,
            ),
          )}
        </ol>
      </section>

      <section class="about" id="marcos">
        <figure class="about__figure">
          ${img(site.about.photo, { sizes: "(max-width: 900px) 100vw, 40vw", ratio: "3 / 4" })}
        </figure>
        <div class="about__text">
          <p class="kicker"><span class="kicker__rule"></span>${site.about.eyebrow}</p>
          <h2 class="section-title">${site.about.title}</h2>
          <p class="about__lead">${site.about.lead}</p>
          ${join(site.about.body.map((p) => html`<p class="about__p">${rich(p)}</p>`))}
          <dl class="facts">
            ${join(
              site.about.facts.map(
                (f) => html`<div><dt>${f.value}</dt><dd>${f.label}</dd></div>`,
              ),
            )}
          </dl>
          <a class="link" href="${site.about.cta.href}">${site.about.cta.label}</a>
        </div>
      </section>

      <section class="quote">
        <blockquote>
          <p>“${site.quotes[0].text}”</p>
          <cite>${site.quotes[0].source}</cite>
        </blockquote>
      </section>

      <section class="satsang" id="satsang">
        <div class="section-head section-head--wide">
          <p class="kicker"><span class="kicker__rule"></span>${site.satsang.eyebrow}</p>
          <h2 class="section-title">${site.satsang.title}</h2>
          <p class="satsang__lead">${site.satsang.lead}</p>
        </div>
        <div class="satsang__grid">
          ${join(
            site.satsang.points.map(
              (p) => html`
                <article class="point">
                  <h3>${p.title}</h3>
                  <p>${p.text}</p>
                </article>
              `,
            ),
          )}
        </div>
        <figure class="satsang__figure">
          ${img(site.satsang.photo, { sizes: "100vw", ratio: "21 / 9" })}
        </figure>
      </section>

      <section class="media">
        <div class="section-head">
          <p class="kicker"><span class="kicker__rule"></span>Para ouvir e ler</p>
          <h2 class="section-title">O trabalho está todo publicado</h2>
        </div>
        <ul class="media__list">
          ${join(
            site.media.map(
              (m) => html`
                <li>
                  <a href="${m.href}">
                    <span class="media__label">${m.label}</span>
                    <h3>${m.title}</h3>
                    <p>${m.description}</p>
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
          <h2>${site.newsletter.title}</h2>
          <p>${site.newsletter.text}</p>
        </div>
        <form class="news__form" method="post" action="#">
          <label class="sr" for="email">E-mail</label>
          <input id="email" type="email" name="email" placeholder="${site.newsletter.placeholder}" required />
          <button type="submit">${site.newsletter.button}</button>
        </form>
      </section>
    </main>

    <footer class="foot">
      <div class="foot__brand">
        ${logo("vertical", { className: "foot__logo", tone: "branco" })}
        <p>${site.footer.tagline}</p>
      </div>
      <nav class="foot__nav" aria-label="Rodapé">
        ${join(
          site.nav.map(
            (n) => html`
              <div>
                <h3>${n.label}</h3>
                <ul>
                  ${n.children
                    ? join(n.children.map((c) => html`<li><a href="${c.href}">${c.label}</a></li>`))
                    : raw(`<li><a href="${n.href}">${n.label}</a></li>`)}
                </ul>
              </div>
            `,
          ),
        )}
        <div>
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
          ${join(site.social.map((s) => html`<li><a href="${s.href}">${s.label}</a></li>`))}
        </ul>
        <p>${site.footer.credit}</p>
      </div>
    </footer>
  `,
};
