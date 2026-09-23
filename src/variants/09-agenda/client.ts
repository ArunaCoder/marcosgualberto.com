/**
 * 09 — Agenda Utilitária
 * Três coisas pequenas: menu do celular, contagem regressiva ao vivo e o
 * status do filtro (o filtro em si é CSS puro, funciona sem JS).
 */

function daysUntil(iso: string): number | null {
  const parts = iso.split("-");
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.UTC(y, m - 1, d) - today) / 86400000);
}

function countdownLabel(days: number): string {
  if (days < 0) return "em breve";
  if (days === 0) return "hoje";
  if (days === 1) return "amanhã";
  return `em ${days} dias`;
}

function refreshCountdowns(): void {
  const nodes = document.querySelectorAll<HTMLElement>("[data-countdown]");
  nodes.forEach((node) => {
    const iso = node.dataset["date"];
    if (!iso) return;
    const days = daysUntil(iso);
    if (days === null) return;
    const dot = node.querySelector(".count__dot");
    node.textContent = countdownLabel(days);
    if (dot) node.prepend(dot);
  });
}

/* ------------------------------------------------------------ menu celular */
const toggle = document.querySelector<HTMLButtonElement>(".site__toggle");
const menu = document.querySelector<HTMLElement>("#menu-movel");

function setMenu(open: boolean): void {
  if (!toggle || !menu) return;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menu.hidden = !open;
  document.documentElement.classList.toggle("is-menu-open", open);
}

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  menu.addEventListener("click", (ev) => {
    if (ev.target instanceof HTMLAnchorElement) setMenu(false);
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenu(false);
  });
}

/* --------------------------------------------------- status do filtro */
const filters = document.querySelector<HTMLFormElement>(".filters");
const status = document.querySelector<HTMLElement>("#agenda-status");
const cards = Array.from(document.querySelectorAll<HTMLElement>(".event"));

function matches(kind: string | undefined, mode: string): boolean {
  if (mode === "todos") return true;
  if (mode === "online") return kind === "online";
  return kind !== "online";
}

if (filters && status) {
  filters.addEventListener("change", () => {
    const checked = filters.querySelector<HTMLInputElement>('input[name="modo"]:checked');
    const mode = checked ? checked.value : "todos";
    const n = cards.filter((c) => matches(c.dataset["kind"], mode)).length;
    status.textContent = n === 1 ? "1 encontro" : `${n} encontros`;
  });
}

refreshCountdowns();
window.setInterval(refreshCountdowns, 60 * 60 * 1000);
