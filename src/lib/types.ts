import type { Raw } from "./html.js";
import type { Site } from "../content/site.js";

export interface Variant {
  /** pasta e URL do estudo: /01-editorial/ */
  id: string;
  /** nome do estilo, mostrado na galeria */
  name: string;
  /** uma linha sobre a ideia do design */
  blurb: string;
  /** palavras-chave do estilo, para a galeria */
  tags: string[];
  /** cor de destaque usada no cartão da galeria */
  accent: string;
  /** claro ou escuro, para o cartão da galeria */
  scheme: "light" | "dark";
  /** <link> de fontes (Google Fonts), se usar */
  fonts?: string[];
  /** conteúdo do <body> */
  render(site: Site): Raw;
  /** se existir client.ts na pasta do estudo */
  client?: boolean;
}
