/** 08 — Split Sticky
 *  A troca das fotos é do CSS (position: sticky por seção). Aqui só o índice
 *  lateral, que segue a seção em foco, e o menu móvel. */
const items = Array.from(document.querySelectorAll(".rail__item"));
const sections = items
    .map((a) => document.getElementById(a.dataset["target"] ?? ""))
    .filter((el) => el !== null);
if (sections.length) {
    const mark = (id) => {
        for (const a of items) {
            if (a.dataset["target"] === id)
                a.setAttribute("aria-current", "true");
            else
                a.removeAttribute("aria-current");
        }
    };
    const io = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible)
            mark(visible.target.id);
    }, { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6, 1] });
    for (const s of sections)
        io.observe(s);
}
/* menu móvel */
const burger = document.querySelector('[aria-controls="menu-movel"]');
const panel = document.getElementById("menu-movel");
function setOpen(open) {
    burger?.setAttribute("aria-expanded", String(open));
    if (panel)
        panel.hidden = !open;
}
burger?.addEventListener("click", () => {
    setOpen(burger.getAttribute("aria-expanded") !== "true");
});
panel?.addEventListener("click", (e) => {
    if (e.target.closest("a"))
        setOpen(false);
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger?.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        burger.focus();
    }
});
export {};
