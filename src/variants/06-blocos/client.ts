/** Menu móvel: o botão controla o painel declarado em aria-controls. */

const toggle = document.querySelector<HTMLButtonElement>('[aria-controls="menu-movel"]');
const menu = document.getElementById("menu-movel");

function setOpen(open: boolean): void {
  toggle?.setAttribute("aria-expanded", String(open));
  if (menu) menu.hidden = !open;
}

toggle?.addEventListener("click", () => {
  setOpen(toggle.getAttribute("aria-expanded") !== "true");
});

menu?.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).closest("a")) setOpen(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
    setOpen(false);
    toggle.focus();
  }
});
