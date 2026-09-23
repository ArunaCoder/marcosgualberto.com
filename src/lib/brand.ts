import { readFileSync } from "node:fs";
import { join } from "node:path";
import { raw, escapeHtml, type Raw } from "./html.js";
import { u } from "./base.js";

/**
 * A marca oficial, em PNG, vinda do manual de identidade visual.
 *
 * Os arquivos saem de `node scripts/brand.mjs`, que lê os originais em
 * "Identidade Visual/2_MARCA_MESTRE_GUALBERTO/". Antes havia SVGs redesenhados
 * à mão, recoloridos por --logo-blue/--logo-orange; os originais são mais
 * precisos, então a cor agora se escolhe pelo `tone`, não por variável CSS.
 */

export type LogoKind = "horizontal" | "vertical" | "gota";
/** Versão de cor da marca. "cor" é azul + laranja; as outras são chapadas. */
export type LogoTone = "cor" | "branco" | "preto";

/** Nome escrito na marca — é "Mestre Gualberto", não o nome do site. */
const BRAND = "Mestre Gualberto";

const brandDir = join(process.cwd(), "public", "brand");

type Dim = readonly [number, number];
let sizes: Record<string, Dim> | null = null;

function dimensions(file: string): Dim {
  sizes ??= JSON.parse(readFileSync(join(brandDir, "sizes.json"), "utf8")) as Record<string, Dim>;
  const dim = sizes[file];
  if (!dim) {
    throw new Error(`marca não gerada: ${file}. Rode \`node scripts/brand.mjs\`.`);
  }
  return dim;
}

export interface LogoOptions {
  className?: string;
  /** largura CSS aplicada à imagem, ex.: "180px" ou "clamp(140px,14vw,220px)" */
  width?: string;
  /** texto alternativo; use "" para marcar como decorativo */
  label?: string;
  /** qual versão de cor usar. Padrão: "cor". */
  tone?: LogoTone;
}

/**
 * Devolve a marca como <img>, com as dimensões intrínsecas declaradas para o
 * navegador reservar o espaço e a página não dar salto ao carregar.
 *
 * Sobre fundo escuro use `tone: "branco"`; marca d'água chapada, "preto".
 */
export function logo(kind: LogoKind, opts: LogoOptions = {}): Raw {
  const tone = opts.tone ?? "cor";
  const file = `mg-${kind}${tone === "cor" ? "" : `-${tone}`}.png`;
  const [w, h] = dimensions(file);

  const attrs = [
    `src="${u(`/brand/${file}`)}"`,
    `width="${w}"`,
    `height="${h}"`,
    opts.label === ""
      ? `alt="" aria-hidden="true"`
      : `alt="${escapeHtml(opts.label ?? BRAND)}"`,
    opts.className ? `class="${opts.className}"` : "",
    opts.width ? `style="width:${opts.width};height:auto"` : "",
    `decoding="async"`,
  ].filter(Boolean);

  return raw(`<img ${attrs.join(" ")} />`);
}
