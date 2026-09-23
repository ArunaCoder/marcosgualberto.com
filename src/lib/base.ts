/**
 * Prefixo de todas as URLs internas.
 *
 * Vazio no domínio próprio (marcosgualberto.com). No GitHub Pages o site é
 * servido em /<repositorio>/, então o build recebe BASE=/<repositorio>.
 *
 *   BASE=/marcosgualberto.com npm run build
 */
const raw = process.env["BASE"] ?? "";

/**
 * No Git Bash o MSYS converte variáveis de ambiente que parecem caminho POSIX
 * antes de entregá-las a um programa nativo: `BASE=/repositorio` chega aqui como
 * `C:/Program Files/Git/repositorio`, e aí todo link, CSS e imagem do site
 * apontam para o disco — sem erro nenhum, só um site quebrado no ar.
 * Melhor parar o build do que publicar isso.
 */
if (raw && !raw.startsWith("/")) {
  throw new Error(
    `BASE inválido: ${JSON.stringify(raw)}. Precisa ser vazio ou começar com "/".\n` +
      `Se veio do Git Bash, foi o MSYS que converteu o caminho — rode o build com ` +
      `MSYS2_ENV_CONV_EXCL=BASE.`,
  );
}

export const BASE = raw.endsWith("/") ? raw.slice(0, -1) : raw;

/** Caminho absoluto do site, já com o prefixo. `p` começa com "/". */
export function u(p: string): string {
  return `${BASE}${p}`;
}
