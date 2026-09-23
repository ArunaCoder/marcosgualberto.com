/** 10 — Tipografia Cinética
 *  O movimento é do CSS (scroll-driven animations). Aqui só o que o CSS não
 *  faz: o fallback para navegadores sem animation-timeline e o menu. */

const supportsScrollTimeline =
  typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
const quiet = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!quiet) {
  document.documentElement.classList.add("jsanim");

  const targets = document.querySelectorAll<HTMLElement>(".sd, .sdw");
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
  );
  for (const t of targets) io.observe(t);

  // barra de progresso: só quando o CSS não consegue sozinho
  const bar = supportsScrollTimeline ? null : document.querySelector<HTMLElement>(".prog i");
  if (bar) {
    let ticking = false;
    const draw = (): void => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      ticking = false;
    };
    addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(draw);
      },
      { passive: true },
    );
    draw();
  }
}

/* menu móvel */
const burger = document.querySelector<HTMLButtonElement>('[aria-controls="menu"]');
const menu = document.getElementById("menu");

function setOpen(open: boolean): void {
  burger?.setAttribute("aria-expanded", String(open));
  if (menu) menu.hidden = !open;
}

burger?.addEventListener("click", () => {
  setOpen(burger.getAttribute("aria-expanded") !== "true");
});
menu?.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).closest("a")) setOpen(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && burger?.getAttribute("aria-expanded") === "true") {
    setOpen(false);
    burger.focus();
  }
});
