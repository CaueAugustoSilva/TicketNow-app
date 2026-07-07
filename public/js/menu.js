const menuBotao = document.querySelector('#menuBotao');
const menu = document.querySelector('#menu');

if (menuBotao && menu) {
  menuBotao.addEventListener('click', () => {
    menu.classList.toggle('aberto');
  });
}
