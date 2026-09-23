import { html, join, rich, raw } from "../../lib/html.js";
import { img } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import { u } from "../../lib/base.js";
import type { Variant } from "../../lib/types.js";

/** 06 — Blocos de Cor
 *  Grandes áreas chapadas de azul e laranja, números gigantes como grafismo e
 *  cartões levemente tortos que endireitam no hover. O assunto é sério; a
 *  embalagem é alegre — que é o jeito dele. */

const nn = (i: number): string => String(i + 1).padStart(2, "0");

const seta = raw('<span class="seta" aria-hidden="true"></span>');

export const variant: Variant = {
  id: "06-blocos",
  name: "Blocos de Cor",
  blurb:
    "Blocos chapados de azul e laranja, números gigantes e cartões tortos. O assunto é sério; a embalagem é alegre.",
  tags: ["colorido", "geométrico", "alto contraste", "alegre"],
  accent: "#EF7911",
  scheme: "light",
  client: true,
  fonts: [
    "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700;800&display=swap",
  ],

  render: (site) => html`
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>

    <header class="topo">
      <div class="topo__in">
        <a class="topo__logo" href="${u("/")}" aria-label="${site.name}">
          ${logo("horizontal", { className: "logo" })}
        </a>
        <nav class="topo__nav" aria-label="Principal">
          ${join(site.nav.map((n) => html`<a href="${n.href}">${n.label}</a>`))}
        </nav>
        <a class="topo__cta" href="#agenda">Ver agenda</a>
        <button
          class="topo__burger"
          type="button"
          aria-expanded="false"
          aria-controls="menu-movel"
          aria-label="Abrir menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="topo__menu" id="menu-movel" hidden>
        <nav aria-label="Principal, celular">
          ${join(site.nav.map((n) => html`<a href="${n.href}">${n.label}${seta}</a>`))}
        </nav>
        <a class="topo__menu-cta" href="#agenda">Ver agenda</a>
      </div>
    </header>

    <main id="conteudo">
      <!-- ---------------------------------------------------------- hero -->
      <section class="hero">
        <div class="hero__texto">
          <p class="chip chip--laranja">${site.hero.kicker}</p>
          <h1 class="hero__titulo">${site.hero.title}</h1>
          <p class="hero__lead">${site.hero.lead}</p>
          <div class="hero__acoes">
            <a class="btn btn--laranja" href="${site.hero.primary.href}"
              >${site.hero.primary.label}${seta}</a
            >
            <a class="btn btn--vazado" href="${site.hero.secondary.href}"
              >${site.hero.secondary.label}${seta}</a
            >
          </div>
        </div>
        <div class="hero__foto">
          ${img(site.hero.photo, {
            eager: true,
            sizes: "(max-width: 900px) 100vw, 42vw",
            className: "hero__img",
          })}
        </div>
      </section>

      <div class="faixa">
        <div class="faixa__trilho">
          ${join(
            [0, 1, 2, 3].map(
              (i) => html`
                <span class="faixa__item" ${i > 0 ? raw('aria-hidden="true"') : raw("")}
                  >${site.hero.note}<i class="faixa__pt" aria-hidden="true"></i
                ></span>
              `,
            ),
          )}
        </div>
      </div>

      <!-- -------------------------------------------------------- agenda -->
      <section class="agenda" id="agenda">
        <div class="wrap">
          <div class="cab">
            <p class="chip chip--azul">Agenda</p>
            <h2 class="titulo">Próximos encontros</h2>
          </div>
          <ol class="cards">
            ${join(
              site.events.map(
                (e, i) => html`
                  <li class="card" data-kind="${e.kind}">
                    <div class="card__topo">
                      <span class="card__n" aria-hidden="true">${nn(i)}</span>
                      <span class="card__tipo">${e.kind}</span>
                    </div>
                    <h3 class="card__titulo">${e.title}</h3>
                    <dl class="card__meta">
                      <div>
                        <dt>Quando</dt>
                        <dd><time datetime="${e.date}">${e.when}</time></dd>
                      </div>
                      <div>
                        <dt>Onde</dt>
                        <dd>${e.place}</dd>
                      </div>
                    </dl>
                    <p class="card__resumo">${e.summary}</p>
                    <ul class="card__tags">
                      ${join(e.highlights.map((h) => html`<li>${h}</li>`))}
                    </ul>
                    <div class="card__pe">
                      <p class="card__preco">${e.price}</p>
                      <a class="card__cta" href="${e.cta.href}">${e.cta.label}${seta}</a>
                    </div>
                  </li>
                `,
              ),
            )}
          </ol>
        </div>
      </section>

      <!-- --------------------------------------------------------- sobre -->
      <section class="sobre" id="marcos">
        <div class="wrap sobre__grid">
          <div class="sobre__fotos">
            <figure class="sobre__foto-a">
              ${img(site.about.photo, { sizes: "(max-width: 900px) 92vw, 34vw", ratio: "4 / 5" })}
            </figure>
            <figure class="sobre__foto-b">
              ${img("maos", { sizes: "(max-width: 900px) 42vw, 16vw", ratio: "1 / 1" })}
            </figure>
          </div>
          <div class="sobre__texto">
            <p class="chip chip--laranja">${site.about.eyebrow}</p>
            <h2 class="titulo titulo--claro">${site.about.title}</h2>
            <p class="sobre__lead">${site.about.lead}</p>
            ${join(site.about.body.map((p) => html`<p class="sobre__p">${rich(p)}</p>`))}
            <a class="btn btn--laranja" href="${site.about.cta.href}"
              >${site.about.cta.label}${seta}</a
            >
          </div>
        </div>
        <dl class="fatos">
          ${join(
            site.about.facts.map(
              (f) => html`
                <div class="fato">
                  <dt class="fato__valor">${f.value}</dt>
                  <dd class="fato__rotulo">${f.label}</dd>
                </div>
              `,
            ),
          )}
        </dl>
      </section>

      <!-- ------------------------------------------------------- citação -->
      <section class="citacao">
        <div class="wrap">
          <blockquote>
            <span class="citacao__aspas" aria-hidden="true">“</span>
            <p>${site.quotes[0].text}</p>
            <cite>${site.quotes[0].source}</cite>
          </blockquote>
        </div>
      </section>

      <!-- ------------------------------------------------------- satsang -->
      <section class="satsang" id="satsang">
        <div class="wrap">
          <div class="cab cab--larga">
            <p class="chip chip--azul">${site.satsang.eyebrow}</p>
            <h2 class="titulo">${site.satsang.title}</h2>
            <p class="cab__lead">${site.satsang.lead}</p>
          </div>
          <ul class="pontos">
            ${join(
              site.satsang.points.map(
                (p, i) => html`
                  <li class="ponto">
                    <span class="ponto__n" aria-hidden="true">${nn(i)}</span>
                    <h3>${p.title}</h3>
                    <p>${p.text}</p>
                  </li>
                `,
              ),
            )}
          </ul>
          <div class="satsang__fim">
            <figure class="satsang__foto">
              ${img(site.satsang.photo, { sizes: "(max-width: 900px) 92vw, 62vw", ratio: "16 / 9" })}
            </figure>
            <a class="btn btn--azul" href="${site.satsang.cta.href}"
              >${site.satsang.cta.label}${seta}</a
            >
          </div>
        </div>
      </section>

      <!-- --------------------------------------------------------- mídia -->
      <section class="midia">
        <div class="wrap">
          <div class="cab cab--inverso">
            <p class="chip chip--laranja">Mídia</p>
            <h2 class="titulo titulo--claro">Para ouvir e ler</h2>
          </div>
          <ul class="midia__lista">
            ${join(
              site.media.map(
                (m, i) => html`
                  <li>
                    <a href="${m.href}">
                      <span class="midia__n" aria-hidden="true">${nn(i)}</span>
                      <span class="midia__label">${m.label}</span>
                      <span class="midia__corpo">
                        <span class="midia__titulo">${m.title}</span>
                        <span class="midia__desc">${m.description}</span>
                      </span>
                      <span class="midia__meta">${m.meta}${seta}</span>
                    </a>
                  </li>
                `,
              ),
            )}
          </ul>
        </div>
      </section>

      <!-- ---------------------------------------------------- newsletter -->
      <section class="news">
        <div class="wrap news__grid">
          <div class="news__texto">
            <h2 class="titulo">${site.newsletter.title}</h2>
            <p>${site.newsletter.text}</p>
            <form class="news__form" method="post" action="#">
              <label class="sr" for="email-06">E-mail</label>
              <input
                id="email-06"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="${site.newsletter.placeholder}"
                required
              />
              <button type="submit">${site.newsletter.button}</button>
            </form>
          </div>
          <figure class="news__foto">
            ${img("gesto", { sizes: "(max-width: 900px) 56vw, 26vw", ratio: "1 / 1" })}
          </figure>
        </div>
      </section>
    </main>

    <!-- --------------------------------------------------------- rodapé -->
    <footer class="rodape">
      <div class="wrap">
        <div class="rodape__topo">
          <div class="rodape__marca">
            ${logo("vertical", { className: "logo", tone: "branco" })}
            <p>${site.footer.tagline}</p>
          </div>
          <nav class="rodape__nav" aria-label="Rodapé">
            ${join(
              site.nav.map(
                (n) => html`
                  <div class="rodape__col">
                    <h3><a href="${n.href}">${n.label}</a></h3>
                    <ul>
                      ${n.children
                        ? join(
                            n.children.map(
                              (c) => html`<li><a href="${c.href}">${c.label}</a></li>`,
                            ),
                          )
                        : html`<li><a href="${n.href}">Ver tudo</a></li>`}
                    </ul>
                  </div>
                `,
              ),
            )}
            <div class="rodape__col">
              <h3>Contato</h3>
              <ul>
                <li><a href="${site.contact.whatsappHref}">WhatsApp ${site.contact.whatsapp}</a></li>
                <li><a href="mailto:${site.contact.email}">${site.contact.email}</a></li>
                <li class="rodape__pessoa">${site.contact.person} — ${site.contact.role}</li>
              </ul>
            </div>
          </nav>
        </div>
        <div class="rodape__pe">
          <ul class="rodape__social">
            ${join(site.social.map((s) => html`<li><a href="${s.href}">${s.label}</a></li>`))}
          </ul>
          <p class="rodape__credito">${site.footer.credit}</p>
        </div>
      </div>
    </footer>
  `,
};
