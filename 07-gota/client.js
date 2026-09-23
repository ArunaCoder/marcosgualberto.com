/** Menu móvel: o botão controla o painel declarado em aria-controls. */
const toggle = document.querySelector('[aria-controls="menu-movel"]');
const menu = document.getElementById("menu-movel");
function setOpen(open) {
    toggle?.setAttribute("aria-expanded", String(open));
    if (menu)
        menu.hidden = !open;
}
toggle?.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
});
menu?.addEventListener("click", (e) => {
    if (e.target.closest("a"))
        setOpen(false);
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
    }
});
export {};
