/**
 * Publica dist/ na branch gh-pages.
 *
 * NÃO é mais o caminho normal: quem publica é .github/workflows/deploy.yml, a
 * cada push na main. Com o Pages apontado para "GitHub Actions", rodar isto aqui
 * atualiza a branch gh-pages e NÃO muda o site. Fica como saída de emergência —
 * para voltar a valer, o Source em Settings › Pages tem que apontar a branch.
 *
 *   node scripts/deploy.mjs            # deduz o caminho base pelo remote
 *   node scripts/deploy.mjs --dry      # constrói e mostra o que faria, sem publicar
 *
 * O GitHub Pages serve o site em https://<usuario>.github.io/<repositorio>/,
 * então o build recebe BASE=/<repositorio> para os caminhos não quebrarem.
 * Se for usar domínio próprio, rode com BASE="" e crie public/CNAME.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dry = process.argv.includes("--dry");
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

let remote;
try {
  remote = git("remote", "get-url", "origin");
} catch {
  console.error(
    "! este repositório ainda não tem remote `origin`.\n" +
      "  crie o repositório no GitHub e rode:\n" +
      "    git remote add origin git@github.com:<usuario>/<repositorio>.git",
  );
  process.exit(1);
}

const repo = remote.replace(/\.git$/, "").split(/[/:]/).pop();
const base = process.env.BASE ?? `/${repo}`;
const branch = "gh-pages";

console.log(`repositório : ${repo}`);
console.log(`base        : ${base || "(raiz)"}`);

execFileSync("npm", ["run", "build"], {
  stdio: "inherit",
  // MSYS2_ENV_CONV_EXCL: no Git Bash o MSYS converteria BASE=/repositorio em
  // C:/Program Files/Git/repositorio, quebrando todos os caminhos do site.
  env: { ...process.env, BASE: base, MSYS2_ENV_CONV_EXCL: "BASE" },
  shell: process.platform === "win32",
});

if (!existsSync("dist/index.html")) {
  console.error("! dist/index.html não foi gerado.");
  process.exit(1);
}
writeFileSync("dist/.nojekyll", "");

if (dry) {
  console.log(`\n[--dry] publicaria dist/ em ${branch}. Nada foi enviado.`);
  process.exit(0);
}

// Branch local descartável: o histórico publicado é sempre um commit só, e um
// nome fixo faria o segundo deploy falhar ("a branch named gh-pages already exists").
const tmpBranch = `pages-${Date.now()}`;
const work = mkdtempSync(join(tmpdir(), "mg-pages-"));
try {
  execFileSync("git", ["worktree", "add", "--detach", work], { stdio: "inherit" });
  execFileSync("git", ["-C", work, "checkout", "--orphan", tmpBranch], { stdio: "inherit" });
  execFileSync("git", ["-C", work, "rm", "-rf", "--quiet", "."], { stdio: "inherit" });
  cpSync("dist", work, { recursive: true });
  execFileSync("git", ["-C", work, "add", "-A"], { stdio: "inherit" });
  execFileSync(
    "git",
    ["-C", work, "commit", "-m", `estudos de homepage — ${new Date().toISOString().slice(0, 10)}`],
    { stdio: "inherit" },
  );
  execFileSync("git", ["-C", work, "push", "-f", "origin", `HEAD:${branch}`], { stdio: "inherit" });
  console.log(
    `\n✓ publicado.\n  Em Settings › Pages, aponte para a branch ${branch} (pasta /).\n` +
      `  O endereço fica https://<usuario>.github.io${base}/`,
  );
} finally {
  execFileSync("git", ["worktree", "remove", "--force", work], { stdio: "ignore" });
  rmSync(work, { recursive: true, force: true });
  try {
    execFileSync("git", ["branch", "-D", tmpBranch], { stdio: "ignore" });
  } catch {
    // a branch nem chegou a existir (falha antes do commit) — nada a limpar
  }
}
