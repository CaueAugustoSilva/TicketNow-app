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
];

const formCompraIngresso = document.querySelector("#formCompraIngresso");
const compradorCompra = document.querySelector("#compradorCompra");
const emailCompra = document.querySelector("#emailCompra");
const eventoCompra = document.querySelector("#eventoCompra");
const setorCompra = document.querySelector("#setorCompra");
const quantidadeCompra = document.querySelector("#quantidadeCompra");
const resumoCompra = document.querySelector("#resumoCompra");
const alertaCompraIngresso = document.querySelector("#alertaCompraIngresso");
const buscaCompra = document.querySelector("#buscaCompra");
const contadorCompras = document.querySelector("#contadorCompras");
const corpoTabelaCompras = document.querySelector("#corpoTabelaCompras");

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

function obterClasseStatusIngresso(status) {
  if (status === "Pago") {
    return "status-badge status-disponivel";
  }

  if (status === "Reservado") {
    return "status-badge status-ultimos";
  }

  return "status-badge status-esgotado";
}

function calcularTotal(eventoId, taxa, quantidade) {
  const evento = buscarEventoPorId(eventoId);

  if (!evento) {
    return 0;
  }

  return (Number(evento.preco) + Number(taxa)) * Number(quantidade);
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
        <span class="block text-xs font-black uppercase tracking-wide text-pink-500">Total</span>
        <strong class="text-2xl text-pink-600">${formatarMoeda(total)}</strong>
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

  if (!novoIngresso.comprador || !novoIngresso.email || quantidade <= 0) {
    exibirAlerta("Preencha todos os campos corretamente.");
    return;
  }

  const ingressos = buscarIngressos();
  ingressos.push(novoIngresso);
  salvarIngressos(ingressos);

  limparFormularioCompra();
  renderizarTabelaCompras();
  exibirAlerta("Ingresso registrado com sucesso!");
}

function removerIngresso(id) {
  const confirmar = confirm("Tem certeza que deseja remover este ingresso?");

  if (!confirmar) {
    return;
  }

  const ingressos = buscarIngressos();
  const ingressosAtualizados = ingressos.filter(
    (ingresso) => Number(ingresso.id) !== Number(id),
  );

  salvarIngressos(ingressosAtualizados);
  renderizarTabelaCompras();
  exibirAlerta("Ingresso removido com sucesso!");
}

function renderizarTabelaCompras() {
  const termo = buscaCompra.value.toLowerCase().trim();
  const ingressos = buscarIngressos();

  const ingressosFiltrados = ingressos.filter((ingresso) => {
    const evento = buscarEventoPorId(ingresso.eventoId);
    const nomeEvento = evento ? evento.nome : "Evento removido";

    return (
      ingresso.comprador.toLowerCase().includes(termo) ||
      ingresso.email.toLowerCase().includes(termo) ||
      nomeEvento.toLowerCase().includes(termo) ||
      ingresso.setor.toLowerCase().includes(termo) ||
      ingresso.status.toLowerCase().includes(termo)
    );
  });

  contadorCompras.textContent = `${ingressosFiltrados.length} ingresso(s)`;
  corpoTabelaCompras.innerHTML = "";

  if (ingressosFiltrados.length === 0) {
    corpoTabelaCompras.innerHTML = `
      <tr>
        <td colspan="8" class="px-5 py-8 text-center font-bold text-slate-500">
          Nenhum ingresso registrado.
        </td>
      </tr>
    `;
    return;
  }

  ingressosFiltrados.forEach((ingresso, indice) => {
    const evento = buscarEventoPorId(ingresso.eventoId);
    const nomeEvento = evento ? evento.nome : "Evento removido";
    const total = calcularTotal(
      ingresso.eventoId,
      ingresso.taxa,
      ingresso.quantidade,
    );

    const linha = document.createElement("tr");

    linha.className =
      indice % 2 === 0
        ? "bg-white transition hover:bg-emerald-50"
        : "bg-slate-50 transition hover:bg-emerald-50";

    linha.innerHTML = `
      <td class="px-5 py-4 font-black text-slate-950">${ingresso.comprador}</td>
      <td class="px-5 py-4 text-slate-600">${ingresso.email}</td>
      <td class="px-5 py-4 font-bold text-slate-700">${nomeEvento}</td>
      <td class="px-5 py-4 text-slate-600">${ingresso.setor}</td>
      <td class="px-5 py-4 font-black text-slate-950">${ingresso.quantidade}</td>
      <td class="px-5 py-4 font-black text-slate-950">${formatarMoeda(total)}</td>
      <td class="px-5 py-4">
        <span class="${obterClasseStatusIngresso(ingresso.status)}">${ingresso.status}</span>
      </td>
      <td class="px-5 py-4">
        <button class="botao-pequeno remover" type="button" data-id="${ingresso.id}">
          Remover
        </button>
      </td>
    `;

    corpoTabelaCompras.appendChild(linha);
  });
}

function iniciarPaginaIngressos() {
  popularSelectEventos();
  renderizarTabelaCompras();

  formCompraIngresso.addEventListener("submit", registrarIngresso);
  eventoCompra.addEventListener("change", atualizarResumoCompra);
  setorCompra.addEventListener("change", atualizarResumoCompra);
  quantidadeCompra.addEventListener("input", atualizarResumoCompra);
  buscaCompra.addEventListener("input", renderizarTabelaCompras);

  corpoTabelaCompras.addEventListener("click", (event) => {
    const botao = event.target.closest("button");

    if (!botao) {
      return;
    }

    removerIngresso(Number(botao.dataset.id));
  });
}

if (formCompraIngresso) {
  iniciarPaginaIngressos();
}
