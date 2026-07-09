const CHAVE_EVENTOS = "ticketnow_eventos";
const CHAVE_INGRESSOS = "ticketnow_ingressos";

const eventosPadrao = [
  {
    id: 1,
    nome: "Festival Aurora 2026",
    categoria: "Música",
    cidade: "Rio de Janeiro",
    data: "2026-09-12",
    preco: 180,
    status: "Disponível",
  },
  {
    id: 2,
    nome: "Noite do Stand-up Nacional",
    categoria: "Comédia",
    cidade: "São Paulo",
    data: "2026-08-20",
    preco: 95,
    status: "Últimos ingressos",
  },
  {
    id: 3,
    nome: "Rock Legends Tour",
    categoria: "Show",
    cidade: "Belo Horizonte",
    data: "2026-10-05",
    preco: 220,
    status: "Disponível",
  },
  {
    id: 4,
    nome: "Arena Gamer Experience",
    categoria: "Tecnologia",
    cidade: "Curitiba",
    data: "2026-11-15",
    preco: 75,
    status: "Disponível",
  },
];

const formCompraIngresso = document.querySelector("#formCompraIngresso");
const compradorCompra = document.querySelector("#compradorCompra");
const emailCompra = document.querySelector("#emailCompra");
const eventoCompra = document.querySelector("#eventoCompra");
const setorCompra = document.querySelector("#setorCompra");
const quantidadeCompra = document.querySelector("#quantidadeCompra");
const resumoCompra = document.querySelector("#resumoCompra");
const alertaCompraIngresso = document.querySelector("#alertaCompraIngresso");

function buscarDados(chave, dadosPadrao) {
  const dadosSalvos = localStorage.getItem(chave);

  if (!dadosSalvos) {
    localStorage.setItem(chave, JSON.stringify(dadosPadrao));
    return dadosPadrao;
  }

  try {
    return JSON.parse(dadosSalvos);
  } catch (erro) {
    localStorage.setItem(chave, JSON.stringify(dadosPadrao));
    return dadosPadrao;
  }
}

function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function buscarEventos() {
  return buscarDados(CHAVE_EVENTOS, eventosPadrao);
}

function buscarIngressos() {
  return buscarDados(CHAVE_INGRESSOS, []);
}

function salvarIngressos(ingressos) {
  salvarDados(CHAVE_INGRESSOS, ingressos);
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function buscarEventoPorId(id) {
  const eventos = buscarEventos();
  return eventos.find((evento) => Number(evento.id) === Number(id));
}

function buscarTaxaSelecionada() {
  const optionSelecionada = setorCompra.options[setorCompra.selectedIndex];
  return Number(optionSelecionada.dataset.taxa);
}

function atualizarResumoCompra() {
  const eventoId = Number(eventoCompra.value);
  const evento = buscarEventoPorId(eventoId);
  const taxa = buscarTaxaSelecionada();
  const quantidade = Number(quantidadeCompra.value);

  if (!evento || quantidade <= 0) {
    resumoCompra.innerHTML = `
      <p class="font-bold text-slate-600">
        Selecione um evento e informe uma quantidade válida.
      </p>
    `;
    return;
  }

  const subtotal = Number(evento.preco) * quantidade;
  const taxas = taxa * quantidade;
  const total = subtotal + taxas;

  resumoCompra.innerHTML = `
    <div class="grid gap-4 sm:grid-cols-3">
      <div>
        <span class="block text-xs font-black uppercase tracking-wide text-slate-500">Subtotal</span>
        <strong class="text-xl text-slate-950">${formatarMoeda(subtotal)}</strong>
      </div>

      <div>
        <span class="block text-xs font-black uppercase tracking-wide text-slate-500">Taxas</span>
        <strong class="text-xl text-slate-950">${formatarMoeda(taxas)}</strong>
      </div>

      <div>
        <span class="block text-xs font-black uppercase tracking-wide text-[#026CDF]">Total</span>
        <strong class="text-2xl text-[#026CDF]">${formatarMoeda(total)}</strong>
      </div>
    </div>
  `;
}

function popularSelectEventos() {
  const eventos = buscarEventos();

  eventoCompra.innerHTML = "";

  if (eventos.length === 0) {
    eventoCompra.innerHTML =
      '<option value="">Nenhum evento cadastrado</option>';
    return;
  }

  eventos.forEach((evento) => {
    const option = document.createElement("option");
    option.value = evento.id;
    option.textContent = `${evento.nome} - ${formatarMoeda(evento.preco)}`;
    eventoCompra.appendChild(option);
  });

  atualizarResumoCompra();
}

function exibirAlerta(mensagem) {
  alertaCompraIngresso.textContent = mensagem;
  alertaCompraIngresso.classList.remove("oculto");

  setTimeout(() => {
    alertaCompraIngresso.classList.add("oculto");
  }, 2500);
}

function limparFormularioCompra() {
  formCompraIngresso.reset();
  quantidadeCompra.value = 1;
  atualizarResumoCompra();
}

function registrarIngresso(event) {
  event.preventDefault();

  if (!eventoCompra.value) {
    exibirAlerta("Cadastre um evento antes de registrar um ingresso.");
    return;
  }

  const taxa = buscarTaxaSelecionada();
  const quantidade = Number(quantidadeCompra.value);

  if (
    !compradorCompra.value.trim() ||
    !emailCompra.value.trim() ||
    quantidade <= 0
  ) {
    exibirAlerta("Preencha todos os campos corretamente.");
    return;
  }

  const novoIngresso = {
    id: Date.now(),
    comprador: compradorCompra.value.trim(),
    email: emailCompra.value.trim(),
    eventoId: Number(eventoCompra.value),
    setor: setorCompra.value,
    taxa: taxa,
    quantidade: quantidade,
    status: "Reservado",
  };

  const ingressos = buscarIngressos();
  ingressos.push(novoIngresso);
  salvarIngressos(ingressos);

  limparFormularioCompra();
  exibirAlerta("Ingresso cadastrado com sucesso!");
}

function iniciarPaginaIngressos() {
  popularSelectEventos();

  formCompraIngresso.addEventListener("submit", registrarIngresso);
  eventoCompra.addEventListener("change", atualizarResumoCompra);
  setorCompra.addEventListener("change", atualizarResumoCompra);
  quantidadeCompra.addEventListener("input", atualizarResumoCompra);
}

if (formCompraIngresso) {
  iniciarPaginaIngressos();
}
