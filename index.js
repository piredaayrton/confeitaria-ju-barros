const menuButton = document.querySelector("[data-menu]");
const menu = document.querySelector("[data-lateral-menu]");

menuButton.addEventListener('click', () => {
  menu.classList.toggle('lateral-menu--active');
})