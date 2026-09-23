import { html, join, rich, raw, type Raw } from "../../lib/html.js";
import { img } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import { u } from "../../lib/base.js";
import type { Variant } from "../../lib/types.js";

/**
 * Quebra um texto do conteúdo em palavras animáveis. O texto nunca é escrito
 * aqui: vem sempre do objeto `site` e é fatiado por código.
 *
 * `mark` = quantas palavras finais viram um bloco destacado (tarja laranja).
 */
function kinetic(text: string, mark = 0): Raw {
  const parts = text.trim().split(/\s+/);
  const cut = mark > 0 && mark < parts.length ? parts.length - mark : parts.length;
  const head = parts.slice(0, cut);
  const tail = parts.slice(cut).join(" ");
  const units: Raw[] = head.map(
    (w, i) => html`<span class="kw" style="--wi:${i}"><span class="kw__i">${w}</span></span>`,
  );
  if (tail) {
    units.push(
      html`<span class="kw kw--mark" style="--wi:${head.length}"
        ><span class="kw__i">${tail}</span></span
      >`,
    );
  }
  return join(units);
}

const n2 = (i: number): string => String(i + 1).padStart(2, "0");

export const variant: Variant = {
  id: "10-cinetico",
  name: "Tipografia Cinética",
  blurb:
    "Manchete de capa de revista em movimento: tipo gigante, camadas que se sobrepõem e animação disparada pelo scroll.",
  tags: ["tipográfico", "movimento", "cartaz", "alto contraste"],
  accent: "#EF7911",
  scheme: "light",
  client: true,
  fonts: [
    "https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wdth,wght@75..125,400..900&family=Inter:wght@400;500;600&display=swap",
  ],

  render: (site) => {
    const quoteRun = join(
      site.quotes.map((q) => html`<span class="band__q">${q.text}</span>`),
    );
    const nameRun = join(
      [0, 1, 2].map(() => html`<span>${site.name}</span>`),
    );

    return html`
      <a class="skip" href="#conteudo">Pular para o conteúdo</a>
      <div class="prog" aria-hidden="true"><i></i></div>

      <header class="top">
        <a class="top__brand" href="${u("/")}" aria-label="${site.name}">
          ${logo("horizontal", { className: "top__logo" })}
        </a>
        <nav class="top__nav" aria-label="Principal">
          ${join(
            site.nav.map(
              (n) => html`
                <a class="nav" href="${n.href}"
                  ><span class="nav__m"
                    ><span class="nav__t">${n.label}</span
                    ><span class="nav__t nav__t--b" aria-hidden="true">${n.label}</span></span
                  ></a
                >
              `,
            ),
          )}
        </nav>
        <a class="btn btn--sm top__cta" href="#agenda"
          >Próximo encontro<span class="btn__a" aria-hidden="true">→</span></a
        >
        <button class="burger" type="button" aria-expanded="false" aria-controls="menu">
          <span class="sr">Menu</span><i></i><i></i>
        </button>
      </header>

      <div class="menu" id="menu" hidden>
        <nav class="menu__nav" aria-label="Menu">
          ${join(
            site.nav.map(
              (n, i) => html`
                <div class="menu__grp" style="--mi:${i}">
                  <a class="menu__top" href="${n.href}">${n.label}</a>
                  ${n.children
                    ? html`<ul class="menu__sub">
                        ${join(
                          n.children.map((c) => html`<li><a href="${c.href}">${c.label}</a></li>`),
                        )}
                      </ul>`
                    : raw("")}
                </div>
              `,
            ),
          )}
        </nav>
        <div class="menu__foot">
          <a class="btn btn--sm" href="#agenda">Próximo encontro</a>
          <a class="menu__wa" href="${site.contact.whatsappHref}">WhatsApp ${site.contact.whatsapp}</a>
        </div>
      </div>

      <main id="conteudo">
        <!-- ------------------------------------------------------------ hero -->
        <section class="hero">
          <div class="hero__top up">
            <p class="eyebrow">${site.hero.kicker}</p>
            <p class="hero__note">${site.hero.note}</p>
          </div>

          <h1 class="hero__t">${kinetic(site.hero.title, 2)}</h1>

          <div class="hero__bot">
            <p class="hero__lead up" style="--d:420ms">${site.hero.lead}</p>
            <div class="hero__acts up" style="--d:520ms">
              <a class="btn" href="${site.hero.primary.href}"
                >${site.hero.primary.label}<span class="btn__a" aria-hidden="true">→</span></a
              >
              <a class="ghost" href="${site.hero.secondary.href}">${site.hero.secondary.label}</a>
            </div>
          </div>

          <figure class="hero__shot px bleed">
            ${img(site.hero.photo, { eager: true, sizes: "100vw", className: "px__img" })}
          </figure>
        </section>

        <!-- --------------------------------------------------------- marquee -->
        <div class="band">
          <div class="band__shift">
            <div class="band__track">
              <div class="band__set">${quoteRun}</div>
              <div class="band__set" aria-hidden="true">${quoteRun}</div>
            </div>
          </div>
        </div>

        <!-- ---------------------------------------------------------- agenda -->
        <section class="ag" id="agenda">
          <div class="ag__head">
            <p class="eyebrow sd">Agenda</p>
            <h2 class="d2 sdw">${kinetic("Próximos encontros")}</h2>
          </div>

          <ol class="ag__list">
            ${join(
              site.events.map(
                (e, i) => html`
                  <li class="ev sd" data-kind="${e.kind}">
                    <span class="ev__line" aria-hidden="true"></span>
                    <span class="ev__n" aria-hidden="true">${n2(i)}</span>
                    <div class="ev__main">
                      <h3 class="ev__t">${e.title}</h3>
                      <p class="ev__when">
                        <time datetime="${e.date}">${e.when}</time>
                        <span class="ev__sep" aria-hidden="true">/</span>${e.place}
                      </p>
                      <p class="ev__sum">${e.summary}</p>
                      <ul class="ev__tags">
                        ${join(e.highlights.map((h) => html`<li>${h}</li>`))}
                      </ul>
                    </div>
                    <div class="ev__side">
                      <p class="ev__price ${e.free ? "is-free" : ""}">${e.price}</p>
                      <a class="ev__cta" href="${e.cta.href}" aria-label="${e.cta.label} — ${e.title}"
                        >${e.cta.label}<span class="ev__ar" aria-hidden="true">→</span></a
                      >
                    </div>
                  </li>
                `,
              ),
            )}
          </ol>
        </section>

        <!-- ----------------------------------------------------------- sobre -->
        <section class="ab" id="marcos">
          <div class="ab__grid">
            <p class="eyebrow ab__eyebrow sd">${site.about.eyebrow}</p>
            <h2 class="d1 ab__t sdw">${kinetic(site.about.title)}</h2>
            <figure class="ab__fig px sd">
              ${img(site.about.photo, {
                sizes: "(max-width: 900px) 100vw, 34vw",
                className: "px__img",
              })}
            </figure>
            <div class="ab__body">
              <p class="ab__lead sd">${site.about.lead}</p>
              <div class="ab__cols">
                ${join(site.about.body.map((p) => html`<p class="sd">${rich(p)}</p>`))}
              </div>
              <a class="ghost sd" href="${site.about.cta.href}">${site.about.cta.label}</a>
            </div>
            <dl class="facts">
              ${join(
                site.about.facts.map(
                  (f) => html`
                    <div class="fact sd">
                      <dt class="fact__v" data-count>${f.value}</dt>
                      <dd class="fact__l">${f.label}</dd>
                    </div>
                  `,
                ),
              )}
            </dl>
          </div>
        </section>

        <!-- ---------------------------------------------------------- citação -->
        <section class="q">
          <div class="q__bg px" aria-hidden="true">
            ${img("frase", { sizes: "100vw", className: "px__img" })}
          </div>
          <figure class="q__in">
            <span class="q__mark" aria-hidden="true">“</span>
            <blockquote class="q__q">
              <p class="d1 q__text sdw">${kinetic(site.quotes[0].text)}</p>
            </blockquote>
            <figcaption class="q__by sd">${site.quotes[0].source}</figcaption>
          </figure>
        </section>

        <!-- --------------------------------------------------------- satsang -->
        <section class="st" id="satsang">
          <div class="st__head">
            <p class="eyebrow sd">${site.satsang.eyebrow}</p>
            <h2 class="d2 sdw">${kinetic(site.satsang.title)}</h2>
            <p class="st__lead sd">${site.satsang.lead}</p>
          </div>

          <ol class="pts">
            ${join(
              site.satsang.points.map(
                (p, i) => html`
                  <li class="pt sd">
                    <span class="pt__line" aria-hidden="true"></span>
                    <span class="pt__n">${n2(i)}</span>
                    <h3 class="pt__t">${p.title}</h3>
                    <p class="pt__p">${p.text}</p>
                  </li>
                `,
              ),
            )}
          </ol>

          <figure class="st__fig px bleed">
            ${img(site.satsang.photo, { sizes: "100vw", className: "px__img" })}
            <figcaption class="st__cap">
              <a class="ghost ghost--light" href="${site.satsang.cta.href}"
                >${site.satsang.cta.label}</a
              >
            </figcaption>
          </figure>
        </section>

        <!-- ----------------------------------------------------------- mídia -->
        <section class="md">
          <div class="md__head">
            <p class="eyebrow sd">Mídia</p>
            <h2 class="d2 sdw">${kinetic("Ouvir e ler")}</h2>
          </div>
          <ul class="md__list">
            ${join(
              site.media.map(
                (m) => html`
                  <li class="md__i sd">
                    <a class="md__a" href="${m.href}">
                      <span class="md__lab">${m.label}</span>
                      <span class="md__mid">
                        <span class="md__t3">${m.title}</span>
                        <span class="md__d">${m.description}</span>
                      </span>
                      <span class="md__meta">${m.meta}</span>
                      <span class="md__ar" aria-hidden="true">→</span>
                    </a>
                  </li>
                `,
              ),
            )}
          </ul>
        </section>

        <!-- ------------------------------------------------------ newsletter -->
        <section class="nl">
          <div class="nl__in">
            <h2 class="d2 nl__t sdw">${kinetic(site.newsletter.title)}</h2>
            <div class="nl__side">
              <p class="nl__p sd">${site.newsletter.text}</p>
              <form class="nl__f sd" method="post" action="#">
                <label class="sr" for="nl-email">E-mail</label>
                <input
                  id="nl-email"
                  name="email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="${site.newsletter.placeholder}"
                />
                <button type="submit">
                  ${site.newsletter.button}<span class="btn__a" aria-hidden="true">→</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <!-- ---------------------------------------------------------- rodapé -->
      <footer class="ft">
        <div class="ft__grid">
          <div class="ft__brand">
            ${logo("vertical", { className: "ft__logo", tone: "branco" })}
            <p class="ft__tag">${site.footer.tagline}</p>
          </div>
          <nav class="ft__nav" aria-label="Rodapé">
            ${join(
              site.nav.map(
                (n) => html`
                  <div class="ft__col">
                    <h3>${n.label}</h3>
                    <ul>
                      ${n.children
                        ? join(
                            n.children.map(
                              (c) => html`<li><a href="${c.href}">${c.label}</a></li>`,
                            ),
                          )
                        : html`<li><a href="${n.href}">${n.label}</a></li>`}
                    </ul>
                  </div>
                `,
              ),
            )}
            <div class="ft__col">
              <h3>Contato</h3>
              <ul>
                <li><a href="${site.contact.whatsappHref}">WhatsApp ${site.contact.whatsapp}</a></li>
                <li><a href="mailto:${site.contact.email}">${site.contact.email}</a></li>
                <li class="ft__person">${site.contact.person} — ${site.contact.role}</li>
              </ul>
            </div>
          </nav>
        </div>

        <div class="ft__bottom">
          <ul class="ft__social">
            ${join(site.social.map((s) => html`<li><a href="${s.href}">${s.label}</a></li>`))}
          </ul>
          <p class="ft__credit">${site.footer.credit}</p>
        </div>

        <div class="ft__word" aria-hidden="true">
          <div class="ft__word-track">
            <div class="ft__word-set">${nameRun}</div>
            <div class="ft__word-set">${nameRun}</div>
          </div>
        </div>
      </footer>
    `;
  },
};
