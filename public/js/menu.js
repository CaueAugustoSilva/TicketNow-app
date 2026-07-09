const menuBotao = document.querySelector("#menuBotao");
const menu = document.querySelector("#menu");

if (menuBotao && menu) {
  menuBotao.addEventListener("click", () => {
    const menuEstaAberto = menu.classList.toggle("hidden") === false;

    menu.classList.toggle("flex", menuEstaAberto);
    menuBotao.textContent = menuEstaAberto ? "×" : "☰";
  });
}
