import { photos, type PhotoKey } from "../content/site.js";
import { html, raw, type Raw } from "./html.js";
import { u } from "./base.js";

/** Larguras geradas por scripts/images.mjs */
export const WIDTHS = [640, 1024, 1600, 2200] as const;

export interface ImgOptions {
  /** valor do atributo sizes; default assume largura total */
  sizes?: string;
  className?: string;
  /** a primeira imagem da página não deve ser lazy */
  eager?: boolean;
  /** sobrescreve o object-position do recorte */
  focus?: string;
  /** proporção desejada (ex.: "3 / 4"); vira style aspect-ratio */
  ratio?: string;
}

function srcset(key: string, ext: "webp" | "jpg"): string {
  return WIDTHS.map((w) => `${u(`/photos/${key}-${w}.${ext}`)} ${w}w`).join(", ");
}

/** <picture> responsivo com webp + fallback jpg. */
export function img(key: PhotoKey, opts: ImgOptions = {}): Raw {
  const p = photos[key];
  const sizes = opts.sizes ?? "100vw";
  const focus = opts.focus ?? p.focus ?? "50% 50%";
  const style = [`object-position:${focus}`, opts.ratio ? `aspect-ratio:${opts.ratio}` : ""]
    .filter(Boolean)
    .join(";");
  return html`<picture
    ><source type="image/webp" srcset="${raw(srcset(p.key, "webp"))}" sizes="${sizes}" /><img
      src="${u(`/photos/${p.key}-1024.jpg`)}"
      srcset="${raw(srcset(p.key, "jpg"))}"
      sizes="${sizes}"
      alt="${p.alt}"
      ${raw(opts.className ? `class="${opts.className}"` : "")}
      loading="${opts.eager ? "eager" : "lazy"}"
      decoding="async"
      ${raw(opts.eager ? 'fetchpriority="high"' : "")}
      style="${raw(style)}"
  /></picture>`;
}

/** URL de uma largura específica, para background-image. */
export function photoUrl(key: PhotoKey, width: (typeof WIDTHS)[number] = 1600): string {
  return u(`/photos/${photos[key].key}-${width}.webp`);
}

export function photoAlt(key: PhotoKey): string {
  return photos[key].alt;
}
