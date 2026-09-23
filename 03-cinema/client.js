/** 03 — Dark Cinema: cabeçalho que ganha corpo ao rolar, menu móvel e
 *  entrada suave das seções. */
const hdr = document.querySelector("[data-hdr]");
const burger = document.querySelector("[data-burger]");
const menu = document.querySelector("[data-menu]");
/* ---------------------------------------------------------- cabeçalho */
let ticking = false;
function onScroll() {
    if (ticking)
        return;
    ticking = true;
    requestAnimationFrame(() => {
        hdr?.classList.toggle("is-stuck", window.scrollY > 48);
        ticking = false;
    });
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
/* --------------------------------------------------------- menu móvel */
function setMenu(open) {
    if (!burger || !menu)
        return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
}
burger?.addEventListener("click", () => {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
});
menu?.addEventListener("click", (e) => {
    if (e.target.closest("a"))
        setMenu(false);
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger?.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        burger.focus();
    }
});
const wide = matchMedia("(min-width: 1001px)");
wide.addEventListener("change", () => {
    if (wide.matches)
        setMenu(false);
});
/* ------------------------------------------------------- entrada suave */
const reveals = document.querySelectorAll(".sec__head, .event, .about__fig, .about__text, .quote__in, .satsang__head, .point, .card, .news__in, .foot__top");
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reveals.forEach((el) => el.classList.add("is-in"));
}
else {
    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting)
                continue;
            const el = entry.target;
            el.classList.add("is-in");
            io.unobserve(el);
        }
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    reveals.forEach((el, i) => {
        el.dataset["reveal"] = "";
        el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
        io.observe(el);
    });
}
export {};
