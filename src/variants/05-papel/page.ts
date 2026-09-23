import { html, join, rich } from "../../lib/html.js";
import { img } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import { u } from "../../lib/base.js";
import type { Variant } from "../../lib/types.js";

const KIND: Record<string, string> = {
  online: "Online",
  presencial: "Presencial",
  retiro: "Retiro",
};

export const variant: Variant = {
  id: "05-papel",
  name: "Papel Quente",
  blurb:
    "Creme impresso, tinta marrom e cantos arredondados: uma página de livro bem feita, calorosa sem ser mística.",
  tags: ["claro", "serifa", "quente", "impresso"],
  accent: "#EF7911",
  scheme: "light",
  client: true,
  fonts: [
    "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..500&family=Karla:wght@400;500;600;700&display=swap",
  ],

  render: (site) => html`
    <a class="pular" href="#conteudo">Pular para o conteúdo</a>

    <header class="topo" id="topo">
      <div class="topo__barra caixa">
        <a class="topo__logo" href="${u("/")}" aria-label="${site.name}">
          ${logo("horizontal", { className: "logo" })}
        </a>

        <nav class="topo__nav" aria-label="Principal">
          <ul>
            ${join(
              site.nav.map(
                (n) => html`
                  <li class="${n.children ? "tem-filhos" : ""}">
                    <a href="${n.href}">${n.label}</a>
                    ${n.children
                      ? html`
                          <div class="submenu">
                            <ul>
                              ${join(
                                n.children.map(
                                  (c) => html`<li><a href="${c.href}">${c.label}</a></li>`,
                                ),
                              )}
                            </ul>
                          </div>
                        `
                      : ""}
                  </li>
                `,
              ),
            )}
          </ul>
        </nav>

        <a class="btn btn--peq topo__cta" href="#agenda">Próximo encontro</a>

        <button
          class="topo__botao"
          type="button"
          aria-expanded="false"
          aria-controls="menu-movel"
          aria-label="Abrir menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <div class="topo__movel" id="menu-movel" hidden>
        <ul class="caixa">
          ${join(
            site.nav.map(
              (n) => html`
                <li>
                  <a href="${n.href}">${n.label}</a>
                  ${n.children
                    ? html`<span class="topo__movel-filhos"
                        >${join(
                          n.children.map((c) => html`<a href="${c.href}">${c.label}</a>`),
                        )}</span
                      >`
                    : ""}
                </li>
              `,
            ),
          )}
          <li><a class="btn btn--peq" href="#agenda">Próximo encontro</a></li>
        </ul>
      </div>
    </header>

    <main id="conteudo">
      <!-- ------------------------------------------------------------- herói -->
      <section class="heroi">
        <div class="caixa heroi__grade">
          <div class="heroi__texto">
            <p class="olho"><span class="olho__ponto" aria-hidden="true"></span>${site.hero.kicker}</p>
            <h1 class="heroi__titulo">${site.hero.title}</h1>
            <p class="heroi__linha">${site.hero.lead}</p>
            <p class="heroi__nota">${site.hero.note}</p>
            <div class="heroi__acoes">
              <a class="btn" href="${site.hero.primary.href}"
                >${site.hero.primary.label}<span class="seta" aria-hidden="true">→</span></a
              >
              <a class="link-sub" href="${site.hero.secondary.href}">${site.hero.secondary.label}</a>
            </div>
          </div>

          <figure class="heroi__foto moldura">
            ${img(site.hero.photo, {
              eager: true,
              sizes: "(max-width: 880px) 92vw, 42vw",
              ratio: "4 / 5",
            })}
          </figure>
        </div>
      </section>

      <!-- ------------------------------------------------------------ agenda -->
      <section class="agenda" id="agenda">
        <div class="caixa">
          <div class="secao__cabeca">
            <div>
              <p class="olho"><span class="olho__ponto" aria-hidden="true"></span>Agenda</p>
              <h2 class="secao__titulo">Próximos encontros</h2>
            </div>
            <a class="link-sub" href="/agenda">Ver agenda completa</a>
          </div>

          <ol class="eventos">
            ${join(
              site.events.map(
                (e) => html`
                  <li class="evento cartao" data-kind="${e.kind}">
                    <div class="evento__selos">
                      <span class="selo selo--tipo">${KIND[e.kind] ?? e.kind}</span>
                      <span class="selo ${e.free ? "selo--gratis" : "selo--preco"}">${e.price}</span>
                    </div>
                    <h3 class="evento__titulo">${e.title}</h3>
                    <p class="evento__resumo">${e.summary}</p>
                    <dl class="evento__dados">
                      <div>
                        <dt>Quando</dt>
                        <dd><time datetime="${e.date}">${e.when}</time></dd>
                      </div>
                      <div>
                        <dt>Onde</dt>
                        <dd>${e.place}</dd>
                      </div>
                    </dl>
                    <ul class="evento__notas">
                      ${join(e.highlights.map((h) => html`<li>${h}</li>`))}
                    </ul>
                    <a class="evento__cta" href="${e.cta.href}"
                      >${e.cta.label}<span class="seta" aria-hidden="true">→</span></a
                    >
                  </li>
                `,
              ),
            )}
          </ol>
        </div>
      </section>

      <!-- ------------------------------------------------------------- sobre -->
      <section class="sobre" id="marcos">
        <div class="caixa sobre__grade">
          <div class="sobre__coluna-foto">
            <figure class="moldura sobre__foto">
              ${img(site.about.photo, { sizes: "(max-width: 880px) 92vw, 40vw", ratio: "4 / 5" })}
            </figure>
            <dl class="fatos">
              ${join(
                site.about.facts.map(
                  (f) => html`<div><dt>${f.value}</dt><dd>${f.label}</dd></div>`,
                ),
              )}
            </dl>
          </div>

          <div class="sobre__texto">
            <p class="olho"><span class="olho__ponto" aria-hidden="true"></span>${site.about.eyebrow}</p>
            <h2 class="secao__titulo">${site.about.title}</h2>
            <p class="sobre__linha">${site.about.lead}</p>
            ${join(site.about.body.map((p) => html`<p class="sobre__p">${rich(p)}</p>`))}
            <a class="link-sub" href="${site.about.cta.href}">${site.about.cta.label}</a>
          </div>
        </div>
      </section>

      <!-- ------------------------------------------------------------ citação -->
      <section class="citacao">
        <div class="caixa">
          <blockquote>
            <p>${site.quotes[0].text}</p>
            <cite>${site.quotes[0].source}</cite>
          </blockquote>
        </div>
      </section>

      <!-- ----------------------------------------------------------- satsang -->
      <section class="satsang" id="satsang">
        <div class="caixa">
          <div class="secao__cabeca secao__cabeca--larga">
            <div>
              <p class="olho">
                <span class="olho__ponto" aria-hidden="true"></span>${site.satsang.eyebrow}
              </p>
              <h2 class="secao__titulo">${site.satsang.title}</h2>
            </div>
            <p class="satsang__linha">${site.satsang.lead}</p>
          </div>

          <div class="satsang__grade">
            <figure class="moldura satsang__foto">
              ${img(site.satsang.photo, { sizes: "(max-width: 880px) 92vw, 44vw", ratio: "5 / 6" })}
            </figure>

            <ol class="pontos">
              ${join(
                site.satsang.points.map(
                  (p, i) => html`
                    <li class="ponto">
                      <span class="ponto__n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>${p.title}</h3>
                        <p>${p.text}</p>
                      </div>
                    </li>
                  `,
                ),
              )}
              <li class="ponto ponto--cta">
                <a class="link-sub" href="${site.satsang.cta.href}">${site.satsang.cta.label}</a>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- -------------------------------------------------------------- mídia -->
      <section class="midia">
        <div class="caixa">
          <div class="secao__cabeca">
            <div>
              <p class="olho"><span class="olho__ponto" aria-hidden="true"></span>Para ver, ouvir e ler</p>
              <h2 class="secao__titulo">Onde acompanhar</h2>
            </div>
          </div>

          <ul class="midia__lista">
            ${join(
              site.media.map(
                (m) => html`
                  <li>
                    <a href="${m.href}">
                      <span class="midia__rotulo">${m.label}</span>
                      <div class="midia__corpo">
                        <h3>${m.title}</h3>
                        <p>${m.description}</p>
                      </div>
                      <span class="midia__meta"
                        >${m.meta}<span class="seta" aria-hidden="true">→</span></span
                      >
                    </a>
                  </li>
                `,
              ),
            )}
          </ul>
        </div>
      </section>

      <!-- --------------------------------------------------------- newsletter -->
      <section class="news">
        <div class="caixa">
          <div class="news__cartao">
            <div class="news__texto">
              <h2>${site.newsletter.title}</h2>
              <p>${site.newsletter.text}</p>
            </div>
            <form class="news__form" method="post" action="#">
              <label class="sr" for="email-news">E-mail</label>
              <input
                id="email-news"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="${site.newsletter.placeholder}"
                required
              />
              <button class="btn btn--laranja" type="submit">${site.newsletter.button}</button>
            </form>
          </div>
        </div>
      </section>
    </main>

    <!-- ------------------------------------------------------------- rodapé -->
    <footer class="rodape">
      <div class="caixa">
        <div class="rodape__topo">
          <div class="rodape__marca">
            ${logo("vertical", { className: "rodape__logo", tone: "branco" })}
            <p>${site.footer.tagline}</p>
          </div>

          <nav class="rodape__nav" aria-label="Rodapé">
            ${join(
              site.nav.map(
                (n) => html`
                  <div>
                    <h2><a href="${n.href}">${n.label}</a></h2>
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
            <div>
              <h2>Contato</h2>
              <ul>
                <li><a href="${site.contact.whatsappHref}">WhatsApp ${site.contact.whatsapp}</a></li>
                <li><a href="mailto:${site.contact.email}">${site.contact.email}</a></li>
                <li class="rodape__pessoa">${site.contact.person} — ${site.contact.role}</li>
              </ul>
            </div>
          </nav>
        </div>

        <div class="rodape__fim">
          <ul class="rodape__social">
            ${join(site.social.map((s) => html`<li><a href="${s.href}">${s.label}</a></li>`))}
          </ul>
          <p>${site.footer.credit}</p>
        </div>
      </div>
    </footer>
  `,
};
