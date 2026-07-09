const eventosCarrossel = [
  {
    nome: "Festival Aurora 2026",
    categoria: "Evento em destaque",
    descricao:
      "Música, tecnologia, experiência premium e compra de ingressos simulada em poucos cliques.",
    cidade: "Rio de Janeiro",
    data: "2026-09-12",
    preco: 180,
    imagem: "/img/Aurora fest music.png",
    alt: "Imagem do Festival Aurora 2026",
  },
  {
    nome: "Noite do Stand-up Nacional",
    categoria: "Comédia ao vivo",
    descricao:
      "Uma noite leve e divertida com humor nacional, ambiente descontraído e ingressos acessíveis.",
    cidade: "São Paulo",
    data: "2026-08-20",
    preco: 95,
    imagem: "/img/Stand up.png",
    alt: "Imagem da Noite do Stand-up Nacional",
  },
  {
    nome: "Rock Legends Tour",
    categoria: "Show de rock",
    descricao:
      "Um grande show para quem gosta de guitarras, palco iluminado, energia alta e música ao vivo.",
    cidade: "Belo Horizonte",
    data: "2026-10-05",
    preco: 220,
    imagem: "/img/rock fest.png",
    alt: "Imagem do Rock Legends Tour",
  },
  {
    nome: "Arena Gamer Experience",
    categoria: "Evento gamer",
    descricao:
      "Competições, jogos, experiências imersivas e atrações para fãs do universo gamer.",
    cidade: "Curitiba",
    data: "2026-11-15",
    preco: 75,
    imagem: "/img/gamer event.png",
    alt: "Imagem da Arena Gamer Experience",
  },
];

const imagemEventoDestaque = document.querySelector("#imagemEventoDestaque");
const categoriaEventoDestaque = document.querySelector(
  "#categoriaEventoDestaque",
);
const nomeEventoDestaque = document.querySelector("#nomeEventoDestaque");
const descricaoEventoDestaque = document.querySelector(
  "#descricaoEventoDestaque",
);
const localDataEventoDestaque = document.querySelector(
  "#localDataEventoDestaque",
);
const precoEventoDestaque = document.querySelector("#precoEventoDestaque");
const botaoEventoAnterior = document.querySelector("#botaoEventoAnterior");
const botaoProximoEvento = document.querySelector("#botaoProximoEvento");
const indicadoresEventoDestaque = document.querySelector(
  "#indicadoresEventoDestaque",
);

let indiceEventoAtual = 0;

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function renderizarIndicadores() {
  indicadoresEventoDestaque.innerHTML = "";

  eventosCarrossel.forEach((evento, indice) => {
    const indicador = document.createElement("button");

    indicador.type = "button";
    indicador.setAttribute("aria-label", `Ir para ${evento.nome}`);

    indicador.className =
      indice === indiceEventoAtual
        ? "h-2.5 w-8 rounded-full bg-[#00AEEF] shadow-lg shadow-blue-400/40 transition"
        : "h-2.5 w-2.5 rounded-full bg-white/50 transition hover:bg-white";

    indicador.addEventListener("click", () => {
      indiceEventoAtual = indice;
      renderizarEventoDestaque();
    });

    indicadoresEventoDestaque.appendChild(indicador);
  });
}

function renderizarEventoDestaque() {
  const evento = eventosCarrossel[indiceEventoAtual];

  imagemEventoDestaque.style.opacity = "0";

  setTimeout(() => {
    imagemEventoDestaque.src = evento.imagem;
    imagemEventoDestaque.alt = evento.alt;

    categoriaEventoDestaque.textContent = evento.categoria;
    nomeEventoDestaque.textContent = evento.nome;
    descricaoEventoDestaque.textContent = evento.descricao;
    localDataEventoDestaque.textContent = `${evento.cidade} • ${evento.data}`;
    precoEventoDestaque.textContent = formatarMoeda(evento.preco);

    imagemEventoDestaque.style.opacity = "1";

    renderizarIndicadores();
  }, 180);
}

function irParaEventoAnterior() {
  indiceEventoAtual--;

  if (indiceEventoAtual < 0) {
    indiceEventoAtual = eventosCarrossel.length - 1;
  }

  renderizarEventoDestaque();
}

function irParaProximoEvento() {
  indiceEventoAtual++;

  if (indiceEventoAtual >= eventosCarrossel.length) {
    indiceEventoAtual = 0;
  }

  renderizarEventoDestaque();
}

if (
  imagemEventoDestaque &&
  botaoEventoAnterior &&
  botaoProximoEvento &&
  indicadoresEventoDestaque
) {
  botaoEventoAnterior.addEventListener("click", irParaEventoAnterior);
  botaoProximoEvento.addEventListener("click", irParaProximoEvento);

  renderizarEventoDestaque();
}
