# marcosgualberto.com

Novo site do Marcos Gualberto, saindo do WordPress + Elementor. Esta fase é um
**estudo de direção visual**: dez homepages com o mesmo conteúdo e a mesma marca,
em dez estilos diferentes, para escolher o rumo antes de construir o site todo.

Stack: **TypeScript + HTML + CSS, sem framework**. As páginas são geradas em
tempo de build por funções TypeScript e servidas como HTML estático — nenhum
runtime de UI no navegador, nenhuma dependência além do compilador.

```
npm install
npm run brand      # gera public/brand/ a partir dos PNGs da identidade
npm run images     # gera public/photos/ a partir de images/ (precisa do ImageMagick)
npm run dev        # build + servidor em http://localhost:4321
npm run thumbs     # miniaturas da galeria (precisa de dist/ pronto; depois rode build de novo)
```

A raiz (`/`) é a galeria: lista as dez propostas com miniatura, e é a página
feita para mandar ao Marcos escolher. Dentro de cada estudo há uma barra
flutuante para pular de um estilo para o outro.

## Estrutura

```
src/
  content/site.ts        todo o texto do site, em um lugar só
  lib/
    html.ts              template `html` com escape automático
    photos.ts            <picture> responsivo (webp + jpg) a partir de uma chave
    brand.ts             a marca como <img>, em cor/branco/preto
    base.ts              prefixo das URLs (para servir em subpasta)
    shell.ts             <head>, <body> e a barra de navegação entre estudos
    reset.css            reset colado no topo de cada style.css
    types.ts             interface Variant
  variants/<id>/         um estudo: page.ts + style.css (+ client.ts opcional)
  gallery/               a página inicial que lista as propostas
  build.ts               descobre os estudos e escreve dist/
scripts/
  brand.mjs              deriva a marca dos PNGs oficiais (Pillow)
  images.mjs             deriva as fotos do site (ImageMagick)
  thumbs.py              miniaturas da galeria (playwright + ImageMagick)
  preview.mjs            compila e constrói UM estudo isolado
  serve.mjs              servidor estático sem dependências
  shot.py                screenshot + checagem de erros (playwright)
  deploy.mjs             publica dist/ na branch gh-pages
public/
  brand/                 gerado por `npm run brand` (marca + favicons)
  photos/                gerado por `npm run images` (fora do git)
  thumbs/                gerado por `npm run thumbs` (fora do git)
```

## O que NÃO está no git

As fotos originais (`images/`, ~570 MB), a identidade visual original
(`Identidade Visual/`, ~66 MB) e as fotos derivadas (`public/photos/`) estão no
`.gitignore`. Para montar o projeto em outra máquina: copie `images/` e rode
`npm run images`.

## A marca

A marca vem dos PNGs oficiais do manual de identidade, em
`Identidade Visual/2_MARCA_MESTRE_GUALBERTO/`. `npm run brand` os recorta,
reduz para tamanhos de web e escreve `public/brand/`, junto com `sizes.json`
(dimensões intrínsecas, para o `<img>` reservar espaço e a página não saltar).

Antes havia SVGs redesenhados à mão e recoloridos por CSS; os originais são
mais precisos, então a cor agora se escolhe pela versão do arquivo.

Arquivos: `mg-horizontal`, `mg-vertical` e `mg-gota`, cada um em três versões —
sem sufixo (cor), `-branco` e `-preto` — mais `favicon-32.png` e `icon-180.png`,
derivados da gota.

Cores: azul `#255AA6` (gota: `#005EAA`), laranja `#EF7911`.

```ts
logo("horizontal")                          // azul + laranja
logo("vertical", { tone: "branco" })        // sobre fundo escuro
logo("gota", { label: "", tone: "branco" }) // marca d'água, decorativa
```

A transparência de marca d'água vem de `opacity` no CSS, não da cor do arquivo.

## Como escrever um estudo

Cada estudo vive em `src/variants/<NN-nome>/` com três arquivos:

- `page.ts` — exporta `const variant: Variant`, com `render(site)` devolvendo o
  conteúdo do `<body>`
- `style.css` — o CSS do estudo (o reset é concatenado antes automaticamente)
- `client.ts` — opcional; vira um módulo ES carregado com `<script type="module">`

O build descobre as pastas sozinho, sem arquivo de índice.

```ts
import { html, join, rich, raw } from "../../lib/html.js";
import { img, photoUrl } from "../../lib/photos.js";
import { logo } from "../../lib/brand.js";
import type { Variant } from "../../lib/types.js";

export const variant: Variant = {
  id: "02-exemplo",
  name: "Nome do estilo",
  blurb: "Uma linha sobre a ideia.",
  tags: ["escuro", "tipográfico"],
  accent: "#255AA6",
  scheme: "light",
  client: false,
  fonts: ["https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"],
  render: (site) => html`...`,
};
```

Helpers:

| função | o quê |
| --- | --- |
| `` html`…` `` | escapa interpolações; devolve `Raw` |
| `join(lista)` | junta uma lista de `Raw` |
| `rich(texto)` | texto do conteúdo que já contém `<em>` |
| `img(chave, opts)` | `<picture>` responsivo; `opts`: `sizes`, `eager`, `ratio`, `className`, `focus` |
| `photoUrl(chave, largura)` | URL para `background-image` (640 \| 1024 \| 1600 \| 2200) |
| `logo(kind, opts)` | SVG inline: `horizontal`, `vertical`, `gota`, `wordmark` |

Chaves de foto: `riso`, `acolhida`, `claro`, `sereno`, `direto`, `atento`,
`perfil`, `maos`, `explica`, `aponta`, `conversa`, `saudacao`, `saudacaoClara`,
`sala`, `publico`, `salaAmpla`, `frase`, `gesto`, `cor`, `dourado`.

### Trabalhar em um estudo isolado

```
node scripts/preview.mjs 02-exemplo
DIST=.preview/02-exemplo PORT=4402 node scripts/serve.mjs
python scripts/shot.py http://localhost:4402/02-exemplo/ shot.png --full
```

## Publicar no GitHub Pages

As fotos estão no `.gitignore`, então **não adianta apontar o Pages para a
branch principal** — o site sairia sem imagem nenhuma. O que vai publicado é a
pasta `dist/` já construída, numa branch à parte:

```
git remote add origin git@github.com:<usuario>/<repositorio>.git
npm run images          # se ainda não tiver rodado
npm run build && npm run thumbs && npm run build
npm run deploy          # constrói e empurra dist/ para a branch gh-pages
```

Depois, em *Settings › Pages*, aponte para a branch `gh-pages`, pasta `/`.
O endereço fica `https://<usuario>.github.io/<repositorio>/`.

O `deploy` deduz o prefixo das URLs pelo nome do repositório (o Pages serve
numa subpasta) e passa como `BASE`. Para publicar na raiz de um domínio
próprio, rode `BASE= npm run deploy` e crie `public/CNAME` com o domínio.

Use `node scripts/deploy.mjs --dry` para ver o que aconteceria sem enviar nada.

## Tom

O Marcos **não é místico**. É alegre, ri bastante, fala de forma direta — e o
trabalho é sério. O design deve parecer o site de um professor respeitado, não
o de um retiro de yoga: nada de mandalas, lótus, chakras, gradientes roxos,
tipografia "new age" ou fundo de nebulosa.

## Pendências antes de publicar

- Datas, preços e links de inscrição dos eventos (confirmar com o Leo)
- E-mail de contato real
- Depoimentos verdadeiros, que hoje só existem no site antigo
- Auto-hospedar as fontes (hoje vêm do Google Fonts)
- Decidir quem edita a agenda no dia a dia — isso define se entra um CMS
- O logo embutido inline pesa ~48 KB por página (horizontal + vertical). Some
  bem com gzip, mas se virar incômodo, dá para servir como `<img>` onde não
  precisa recolorir
