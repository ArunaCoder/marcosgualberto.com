/** Template de HTML com escape automático. Interpolação escapa por padrão;
 *  use raw() para marcar trechos já confiáveis (markup nosso). */

const RAW = Symbol("raw");

export interface Raw {
  [RAW]: true;
  value: string;
}

export function raw(value: string): Raw {
  return { [RAW]: true, value };
}

function isRaw(v: unknown): v is Raw {
  return typeof v === "object" && v !== null && RAW in v;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Value = string | number | Raw | null | undefined | false | Value[];

function render(v: Value): string {
  if (v === null || v === undefined || v === false) return "";
  if (Array.isArray(v)) return v.map(render).join("");
  if (isRaw(v)) return v.value;
  if (typeof v === "number") return String(v);
  return escapeHtml(v);
}

export function html(strings: TemplateStringsArray, ...values: Value[]): Raw {
  let out = strings[0] ?? "";
  for (let i = 0; i < values.length; i++) {
    out += render(values[i] ?? "") + (strings[i + 1] ?? "");
  }
  return raw(out);
}

/** Texto do conteúdo que já contém markup simples (<em>, <strong>). */
export function rich(s: string): Raw {
  return raw(s);
}

/** Junta pedaços de markup. */
export function join(parts: Raw[], sep = ""): Raw {
  return raw(parts.map((p) => p.value).join(sep));
}

export function classes(...xs: (string | false | null | undefined)[]): string {
  return xs.filter(Boolean).join(" ");
}
