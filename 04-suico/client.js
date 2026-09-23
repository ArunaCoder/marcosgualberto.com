/** 04 — Grid Suíço: menu móvel e o interruptor que revela a grade de 12 colunas. */
const burger = document.querySelector(".js-menu");
const panel = document.querySelector(".hd__panel");
burger?.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    if (panel)
        panel.hidden = open;
});
panel?.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
        burger?.setAttribute("aria-expanded", "false");
        panel.hidden = true;
    }
});
const gridBtn = document.querySelector(".js-grid");
gridBtn?.addEventListener("click", () => {
    const on = document.body.classList.toggle("is-grid");
    gridBtn.setAttribute("aria-pressed", String(on));
});
export {};
