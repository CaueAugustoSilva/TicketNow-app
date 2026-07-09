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

const ingressosPadrao = [
  {
    id: 1,
    comprador: "Carlos Henrique",
    email: "carlos@email.com",
    eventoId: 1,
    setor: "Pista",
    taxa: 12,
    quantidade: 2,
    status: "Pago",
  },
  {
    id: 2,
    comprador: "Mariana Lima",
    email: "mariana@email.com",
    eventoId: 2,
    setor: "Camarote",
    taxa: 30,
    quantidade: 1,
    status: "Reservado",
  },
];

const formEvento = document.querySelector("#formEvento");
const eventoId = document.querySelector("#eventoId");
const nomeEvento = document.querySelector("#nomeEvento");
const categoriaEvento = document.querySelector("#categoriaEvento");
const cidadeEvento = document.querySelector("#cidadeEvento");
const dataEvento = document.querySelector("#dataEvento");
const precoEvento = document.querySelector("#precoEvento");
const statusEvento = document.querySelector("#statusEvento");
const botaoSalvarEvento = document.querySelector("#botaoSalvarEvento");
const botaoCancelarEvento = document.querySelector("#botaoCancelarEvento");
const buscaEvento = document.querySelector("#buscaEvento");
const corpoTabelaEventos = document.querySelector("#corpoTabelaEventos");
const contadorEventos = document.querySelector("#contadorEventos");
const alertaEventos = document.querySelector("#alertaEventos");

const formIngresso = document.querySelector("#formIngresso");
const ingressoId = document.querySelector("#ingressoId");
const compradorIngresso = document.querySelector("#compradorIngresso");
const emailIngresso = document.querySelector("#emailIngresso");
const eventoIngresso = document.querySelector("#eventoIngresso");
const setorIngresso = document.querySelector("#setorIngresso");
const quantidadeIngresso = document.querySelector("#quantidadeIngresso");
const statusIngresso = document.querySelector("#statusIngresso");
const botaoSalvarIngresso = document.querySelector("#botaoSalvarIngresso");
const botaoCancelarIngresso = document.querySelector("#botaoCancelarIngresso");
const buscaIngresso = document.querySelector("#buscaIngresso");
const corpoTabelaIngressos = document.querySelector("#corpoTabelaIngressos");
const contadorIngressos = document.querySelector("#contadorIngressos");
const alertaIngressos = document.querySelector("#alertaIngressos");

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

function salvarEventos(eventos) {
  salvarDados(CHAVE_EVENTOS, eventos);
}

function buscarIngressos() {
  return buscarDados(CHAVE_INGRESSOS, ingressosPadrao);
}

function salvarIngressos(ingressos) {
  salvarDados(CHAVE_INGRESSOS, ingressos);
}

function formatarData(dataISO) {
  if (!dataISO || !dataISO.includes("-")) {
    return "Sem data";
  }

  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function exibirAlerta(elemento, mensagem) {
  elemento.textContent = mensagem;
  elemento.classList.remove("oculto");

  setTimeout(() => {
    elemento.classList.add("oculto");
  }, 2500);
}

function obterClasseStatusEvento(status) {
  if (status === "Disponível") {
    return "status-badge status-disponivel";
  }

  if (status === "Últimos ingressos") {
    return "status-badge status-ultimos";
  }

  return "status-badge status-esgotado";
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

function buscarEventoPorId(id) {
  const eventos = buscarEventos();
  return eventos.find((evento) => Number(evento.id) === Number(id));
}

function calcularTotalIngresso(ingresso) {
  const evento = buscarEventoPorId(ingresso.eventoId);

  if (!evento) {
    return 0;
  }

  const precoBase = Number(evento.preco);
  const taxa = Number(ingresso.taxa);
  const quantidade = Number(ingresso.quantidade);

  return (precoBase + taxa) * quantidade;
}

function limparFormularioEvento() {
  formEvento.reset();
  eventoId.value = "";
  botaoSalvarEvento.textContent = "Cadastrar evento";
}

function limparFormularioIngresso() {
  formIngresso.reset();
  ingressoId.value = "";
  quantidadeIngresso.value = 1;
  botaoSalvarIngresso.textContent = "Registrar ingresso";
}

function atualizarSelectEventosDosIngressos() {
  const eventos = buscarEventos();

  eventoIngresso.innerHTML = "";

  if (eventos.length === 0) {
    eventoIngresso.innerHTML =
      '<option value="">Cadastre um evento primeiro</option>';
    return;
  }

  eventos.forEach((evento) => {
    const option = document.createElement("option");
    option.value = evento.id;
    option.textContent = `${evento.nome} - ${formatarMoeda(evento.preco)}`;
    eventoIngresso.appendChild(option);
  });
}

function renderizarTabelaEventos() {
  const termo = buscaEvento.value.toLowerCase().trim();
  const eventos = buscarEventos();

  const eventosFiltrados = eventos.filter((evento) => {
    return (
      evento.nome.toLowerCase().includes(termo) ||
      evento.categoria.toLowerCase().includes(termo) ||
      evento.cidade.toLowerCase().includes(termo) ||
      evento.status.toLowerCase().includes(termo)
    );
  });

  corpoTabelaEventos.innerHTML = "";
  contadorEventos.textContent = `${eventosFiltrados.length} evento(s)`;

  if (eventosFiltrados.length === 0) {
    corpoTabelaEventos.innerHTML = `
      <tr>
        <td colspan="7" class="px-5 py-8 text-center font-bold text-slate-500">
          Nenhum evento encontrado.
        </td>
      </tr>
    `;
    return;
  }

  eventosFiltrados.forEach((evento, indice) => {
    const linha = document.createElement("tr");

    linha.className =
      indice % 2 === 0
        ? "bg-white transition hover:bg-pink-50"
        : "bg-slate-50 transition hover:bg-pink-50";

    linha.innerHTML = `
      <td class="px-5 py-4 font-black text-slate-950">${evento.nome}</td>
      <td class="px-5 py-4 font-bold text-slate-600">${evento.categoria}</td>
      <td class="px-5 py-4 text-slate-600">${evento.cidade}</td>
      <td class="px-5 py-4 text-slate-600">${formatarData(evento.data)}</td>
      <td class="px-5 py-4 font-black text-slate-950">${formatarMoeda(evento.preco)}</td>
      <td class="px-5 py-4">
        <span class="${obterClasseStatusEvento(evento.status)}">${evento.status}</span>
      </td>
      <td class="px-5 py-4">
        <div class="acoes-tabela">
          <button class="botao-pequeno editar" type="button" data-acao="editar-evento" data-id="${evento.id}">
            Editar
          </button>

          <button class="botao-pequeno remover" type="button" data-acao="remover-evento" data-id="${evento.id}">
            Remover
          </button>
        </div>
      </td>
    `;

    corpoTabelaEventos.appendChild(linha);
  });
}

function cadastrarOuAtualizarEvento(event) {
  event.preventDefault();

  const eventos = buscarEventos();
  const idEmEdicao = eventoId.value;

  const evento = {
    id: idEmEdicao ? Number(idEmEdicao) : Date.now(),
    nome: nomeEvento.value.trim(),
    categoria: categoriaEvento.value,
    cidade: cidadeEvento.value.trim(),
    data: dataEvento.value,
    preco: Number(precoEvento.value),
    status: statusEvento.value,
  };

  if (!evento.nome || !evento.cidade || !evento.data || evento.preco < 0) {
    exibirAlerta(
      alertaEventos,
      "Preencha todos os campos do evento corretamente.",
    );
    return;
  }

  if (idEmEdicao) {
    const eventosAtualizados = eventos.map((item) => {
      return Number(item.id) === Number(idEmEdicao) ? evento : item;
    });

    salvarEventos(eventosAtualizados);
    exibirAlerta(alertaEventos, "Evento editado com sucesso!");
  } else {
    eventos.push(evento);
    salvarEventos(eventos);
    exibirAlerta(alertaEventos, "Evento cadastrado com sucesso!");
  }

  limparFormularioEvento();
  atualizarSelectEventosDosIngressos();
  renderizarTabelaEventos();
  renderizarTabelaIngressos();
}

function editarEvento(id) {
  const evento = buscarEventoPorId(id);

  if (!evento) {
    exibirAlerta(alertaEventos, "Evento não encontrado.");
    return;
  }

  eventoId.value = evento.id;
  nomeEvento.value = evento.nome;
  categoriaEvento.value = evento.categoria;
  cidadeEvento.value = evento.cidade;
  dataEvento.value = evento.data;
  precoEvento.value = evento.preco;
  statusEvento.value = evento.status;

  botaoSalvarEvento.textContent = "Salvar alterações";

  formEvento.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function removerEvento(id) {
  const ingressos = buscarIngressos();
  const existemIngressosVinculados = ingressos.some(
    (ingresso) => Number(ingresso.eventoId) === Number(id),
  );

  let mensagemConfirmacao = "Tem certeza que deseja remover este evento?";

  if (existemIngressosVinculados) {
    mensagemConfirmacao =
      'Este evento possui ingressos registrados. Se remover o evento, os ingressos continuarão salvos, mas aparecerão como "Evento removido". Deseja continuar?';
  }

  const confirmar = confirm(mensagemConfirmacao);

  if (!confirmar) {
    return;
  }

  const eventos = buscarEventos();
  const eventosAtualizados = eventos.filter(
    (evento) => Number(evento.id) !== Number(id),
  );

  salvarEventos(eventosAtualizados);
  limparFormularioEvento();
  atualizarSelectEventosDosIngressos();
  renderizarTabelaEventos();
  renderizarTabelaIngressos();

  exibirAlerta(alertaEventos, "Evento removido com sucesso!");
}

function renderizarTabelaIngressos() {
  const termo = buscaIngresso.value.toLowerCase().trim();
  const ingressos = buscarIngressos();

  const ingressosFiltrados = ingressos.filter((ingresso) => {
    const evento = buscarEventoPorId(ingresso.eventoId);
    const nomeEventoEncontrado = evento ? evento.nome : "Evento removido";

    return (
      ingresso.comprador.toLowerCase().includes(termo) ||
      ingresso.email.toLowerCase().includes(termo) ||
      nomeEventoEncontrado.toLowerCase().includes(termo) ||
      ingresso.setor.toLowerCase().includes(termo) ||
      ingresso.status.toLowerCase().includes(termo)
    );
  });

  corpoTabelaIngressos.innerHTML = "";
  contadorIngressos.textContent = `${ingressosFiltrados.length} ingresso(s)`;

  if (ingressosFiltrados.length === 0) {
    corpoTabelaIngressos.innerHTML = `
      <tr>
        <td colspan="8" class="px-5 py-8 text-center font-bold text-slate-500">
          Nenhum ingresso encontrado.
        </td>
      </tr>
    `;
    return;
  }

  ingressosFiltrados.forEach((ingresso, indice) => {
    const evento = buscarEventoPorId(ingresso.eventoId);
    const nomeDoEvento = evento ? evento.nome : "Evento removido";
    const total = calcularTotalIngresso(ingresso);

    const linha = document.createElement("tr");

    linha.className =
      indice % 2 === 0
        ? "bg-white transition hover:bg-emerald-50"
        : "bg-slate-50 transition hover:bg-emerald-50";

    linha.innerHTML = `
      <td class="px-5 py-4 font-black text-slate-950">${ingresso.comprador}</td>
      <td class="px-5 py-4 text-slate-600">${ingresso.email}</td>
      <td class="px-5 py-4 font-bold text-slate-700">${nomeDoEvento}</td>
      <td class="px-5 py-4 text-slate-600">${ingresso.setor}</td>
      <td class="px-5 py-4 font-black text-slate-950">${ingresso.quantidade}</td>
      <td class="px-5 py-4 font-black text-slate-950">${formatarMoeda(total)}</td>
      <td class="px-5 py-4">
        <span class="${obterClasseStatusIngresso(ingresso.status)}">${ingresso.status}</span>
      </td>
      <td class="px-5 py-4">
        <div class="acoes-tabela">
          <button class="botao-pequeno editar" type="button" data-acao="editar-ingresso" data-id="${ingresso.id}">
            Editar
          </button>

          <button class="botao-pequeno remover" type="button" data-acao="remover-ingresso" data-id="${ingresso.id}">
            Remover
          </button>
        </div>
      </td>
    `;

    corpoTabelaIngressos.appendChild(linha);
  });
}

function buscarTaxaDoSetorSelecionado() {
  const optionSelecionada = setorIngresso.options[setorIngresso.selectedIndex];
  return Number(optionSelecionada.dataset.taxa);
}

function cadastrarOuAtualizarIngresso(event) {
  event.preventDefault();

  const ingressos = buscarIngressos();
  const idEmEdicao = ingressoId.value;

  if (!eventoIngresso.value) {
    exibirAlerta(
      alertaIngressos,
      "Cadastre um evento antes de registrar um ingresso.",
    );
    return;
  }

  const ingresso = {
    id: idEmEdicao ? Number(idEmEdicao) : Date.now(),
    comprador: compradorIngresso.value.trim(),
    email: emailIngresso.value.trim(),
    eventoId: Number(eventoIngresso.value),
    setor: setorIngresso.value,
    taxa: buscarTaxaDoSetorSelecionado(),
    quantidade: Number(quantidadeIngresso.value),
    status: statusIngresso.value,
  };

  if (
    !ingresso.comprador ||
    !ingresso.email ||
    !ingresso.eventoId ||
    ingresso.quantidade <= 0
  ) {
    exibirAlerta(
      alertaIngressos,
      "Preencha todos os campos do ingresso corretamente.",
    );
    return;
  }

  if (idEmEdicao) {
    const ingressosAtualizados = ingressos.map((item) => {
      return Number(item.id) === Number(idEmEdicao) ? ingresso : item;
    });

    salvarIngressos(ingressosAtualizados);
    exibirAlerta(alertaIngressos, "Ingresso editado com sucesso!");
  } else {
    ingressos.push(ingresso);
    salvarIngressos(ingressos);
    exibirAlerta(alertaIngressos, "Ingresso registrado com sucesso!");
  }

  limparFormularioIngresso();
  renderizarTabelaIngressos();
}

function editarIngresso(id) {
  const ingressos = buscarIngressos();
  const ingresso = ingressos.find((item) => Number(item.id) === Number(id));

  if (!ingresso) {
    exibirAlerta(alertaIngressos, "Ingresso não encontrado.");
    return;
  }

  ingressoId.value = ingresso.id;
  compradorIngresso.value = ingresso.comprador;
  emailIngresso.value = ingresso.email;
  eventoIngresso.value = ingresso.eventoId;
  setorIngresso.value = ingresso.setor;
  quantidadeIngresso.value = ingresso.quantidade;
  statusIngresso.value = ingresso.status;

  botaoSalvarIngresso.textContent = "Salvar alterações";

  formIngresso.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
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
  limparFormularioIngresso();
  renderizarTabelaIngressos();

  exibirAlerta(alertaIngressos, "Ingresso removido com sucesso!");
}

function configurarEventosDaPagina() {
  formEvento.addEventListener("submit", cadastrarOuAtualizarEvento);
  botaoCancelarEvento.addEventListener("click", limparFormularioEvento);
  buscaEvento.addEventListener("input", renderizarTabelaEventos);

  formIngresso.addEventListener("submit", cadastrarOuAtualizarIngresso);
  botaoCancelarIngresso.addEventListener("click", limparFormularioIngresso);
  buscaIngresso.addEventListener("input", renderizarTabelaIngressos);

  corpoTabelaEventos.addEventListener("click", (event) => {
    const botao = event.target.closest("button");

    if (!botao) {
      return;
    }

    const id = Number(botao.dataset.id);

    if (botao.dataset.acao === "editar-evento") {
      editarEvento(id);
    }

    if (botao.dataset.acao === "remover-evento") {
      removerEvento(id);
    }
  });

  corpoTabelaIngressos.addEventListener("click", (event) => {
    const botao = event.target.closest("button");

    if (!botao) {
      return;
    }

    const id = Number(botao.dataset.id);

    if (botao.dataset.acao === "editar-ingresso") {
      editarIngresso(id);
    }

    if (botao.dataset.acao === "remover-ingresso") {
      removerIngresso(id);
    }
  });
}

function iniciarPaginaAdmin() {
  atualizarSelectEventosDosIngressos();
  renderizarTabelaEventos();
  renderizarTabelaIngressos();
  configurarEventosDaPagina();
}

if (formEvento && formIngresso) {
  iniciarPaginaAdmin();
}
