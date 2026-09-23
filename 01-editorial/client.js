/** 01 — Editorial Sereno: menu móvel + revelação suave ao rolar. */
const toggle = document.querySelector(".head__toggle");
const menu = document.querySelector(".head__mobile");
toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    if (menu)
        menu.hidden = open;
});
menu?.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
        toggle?.setAttribute("aria-expanded", "false");
        menu.hidden = true;
    }
});
const reveals = document.querySelectorAll(".section-head, .event, .about__text, .about__figure, .point, .media__list li, .quote blockquote");
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
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el, i) => {
        el.dataset["reveal"] = "";
        el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
        io.observe(el);
    });
}
export {};
