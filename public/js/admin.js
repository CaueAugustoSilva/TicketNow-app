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

const ingressosPadrao = [];

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

function criarModal(titulo, conteudoFormulario) {
  const modalAntigo = document.querySelector("#modalEdicao");

  if (modalAntigo) {
    modalAntigo.remove();
  }

  const modal = document.createElement("div");
  modal.id = "modalEdicao";
  modal.className =
    "fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-5 py-8 backdrop-blur-sm";

  modal.innerHTML = `
    <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <p class="section-kicker bg-[#00AEEF]/10 text-[#026CDF]">Edição</p>
          <h2 class="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950">${titulo}</h2>
        </div>

        <button id="fecharModalEdicao" class="rounded-full bg-slate-100 px-4 py-2 text-xl font-black text-slate-950 transition hover:bg-slate-200" type="button">
          ×
        </button>
      </div>

      ${conteudoFormulario}
    </div>
  `;

  document.body.appendChild(modal);

  const fecharModalEdicao = document.querySelector("#fecharModalEdicao");

  fecharModalEdicao.addEventListener("click", fecharModal);

  modal.addEventListener("click", (event) => {
    if (event.target.id === "modalEdicao") {
      fecharModal();
    }
  });
}

function fecharModal() {
  const modal = document.querySelector("#modalEdicao");

  if (modal) {
    modal.remove();
  }
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
        ? "bg-white transition hover:bg-blue-50"
        : "bg-slate-50 transition hover:bg-blue-50";

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

  const evento = {
    id: Date.now(),
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

  eventos.push(evento);
  salvarEventos(eventos);

  limparFormularioEvento();
  atualizarSelectEventosDosIngressos();
  renderizarTabelaEventos();
  renderizarTabelaIngressos();

  exibirAlerta(alertaEventos, "Evento cadastrado com sucesso!");
}

function abrirModalEditarEvento(id) {
  const evento = buscarEventoPorId(id);

  if (!evento) {
    exibirAlerta(alertaEventos, "Evento não encontrado.");
    return;
  }

  criarModal(
    "Editar evento",
    `
    <form id="formModalEvento" class="grid gap-5">
      <div>
        <label class="form-label" for="modalNomeEvento">Nome do evento</label>
        <input id="modalNomeEvento" class="form-control" type="text" value="${evento.nome}" required>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <div>
          <label class="form-label" for="modalCategoriaEvento">Categoria</label>
          <select id="modalCategoriaEvento" class="form-control" required>
            <option value="Música">Música</option>
            <option value="Comédia">Comédia</option>
            <option value="Show">Show</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Teatro">Teatro</option>
            <option value="Esporte">Esporte</option>
          </select>
        </div>

        <div>
          <label class="form-label" for="modalCidadeEvento">Cidade</label>
          <input id="modalCidadeEvento" class="form-control" type="text" value="${evento.cidade}" required>
        </div>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        <div>
          <label class="form-label" for="modalDataEvento">Data</label>
          <input id="modalDataEvento" class="form-control" type="date" value="${evento.data}" required>
        </div>

        <div>
          <label class="form-label" for="modalPrecoEvento">Preço</label>
          <input id="modalPrecoEvento" class="form-control" type="number" min="0" step="0.01" value="${evento.preco}" required>
        </div>

        <div>
          <label class="form-label" for="modalStatusEvento">Status</label>
          <select id="modalStatusEvento" class="form-control" required>
            <option value="Disponível">Disponível</option>
            <option value="Últimos ingressos">Últimos ingressos</option>
            <option value="Esgotado">Esgotado</option>
          </select>
        </div>
      </div>

      <div class="grid gap-3 md:grid-cols-2">
        <button class="btn-primary" type="submit">Salvar alterações</button>
        <button class="btn-secondary" id="cancelarModalEvento" type="button">Cancelar</button>
      </div>
    </form>
  `,
  );

  document.querySelector("#modalCategoriaEvento").value = evento.categoria;
  document.querySelector("#modalStatusEvento").value = evento.status;

  document
    .querySelector("#cancelarModalEvento")
    .addEventListener("click", fecharModal);

  document
    .querySelector("#formModalEvento")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const eventoAtualizado = {
        id: evento.id,
        nome: document.querySelector("#modalNomeEvento").value.trim(),
        categoria: document.querySelector("#modalCategoriaEvento").value,
        cidade: document.querySelector("#modalCidadeEvento").value.trim(),
        data: document.querySelector("#modalDataEvento").value,
        preco: Number(document.querySelector("#modalPrecoEvento").value),
        status: document.querySelector("#modalStatusEvento").value,
      };

      if (
        !eventoAtualizado.nome ||
        !eventoAtualizado.cidade ||
        !eventoAtualizado.data ||
        eventoAtualizado.preco < 0
      ) {
        alert("Preencha todos os campos corretamente.");
        return;
      }

      const eventos = buscarEventos();

      const eventosAtualizados = eventos.map((item) => {
        return Number(item.id) === Number(id) ? eventoAtualizado : item;
      });

      salvarEventos(eventosAtualizados);
      atualizarSelectEventosDosIngressos();
      renderizarTabelaEventos();
      renderizarTabelaIngressos();
      fecharModal();

      exibirAlerta(alertaEventos, "Evento editado com sucesso!");
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
        ? "bg-white transition hover:bg-blue-50"
        : "bg-slate-50 transition hover:bg-blue-50";

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

  if (!eventoIngresso.value) {
    exibirAlerta(
      alertaIngressos,
      "Cadastre um evento antes de registrar um ingresso.",
    );
    return;
  }

  const ingresso = {
    id: Date.now(),
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

  ingressos.push(ingresso);
  salvarIngressos(ingressos);

  limparFormularioIngresso();
  renderizarTabelaIngressos();

  exibirAlerta(alertaIngressos, "Ingresso registrado com sucesso!");
}

function abrirModalEditarIngresso(id) {
  const ingressos = buscarIngressos();
  const ingresso = ingressos.find((item) => Number(item.id) === Number(id));

  if (!ingresso) {
    exibirAlerta(alertaIngressos, "Ingresso não encontrado.");
    return;
  }

  const eventos = buscarEventos();

  const optionsEventos = eventos
    .map((evento) => {
      return `<option value="${evento.id}">${evento.nome} - ${formatarMoeda(evento.preco)}</option>`;
    })
    .join("");

  criarModal(
    "Editar ingresso",
    `
    <form id="formModalIngresso" class="grid gap-5">
      <div class="grid gap-5 md:grid-cols-2">
        <div>
          <label class="form-label" for="modalCompradorIngresso">Comprador</label>
          <input id="modalCompradorIngresso" class="form-control" type="text" value="${ingresso.comprador}" required>
        </div>

        <div>
          <label class="form-label" for="modalEmailIngresso">E-mail</label>
          <input id="modalEmailIngresso" class="form-control" type="email" value="${ingresso.email}" required>
        </div>
      </div>

      <div>
        <label class="form-label" for="modalEventoIngresso">Evento</label>
        <select id="modalEventoIngresso" class="form-control" required>
          ${optionsEventos}
        </select>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        <div>
          <label class="form-label" for="modalSetorIngresso">Setor</label>
          <select id="modalSetorIngresso" class="form-control" required>
            <option value="Pista" data-taxa="12">Pista - taxa R$ 12,00</option>
            <option value="Pista Premium" data-taxa="18">Pista Premium - taxa R$ 18,00</option>
            <option value="Camarote" data-taxa="30">Camarote - taxa R$ 30,00</option>
          </select>
        </div>

        <div>
          <label class="form-label" for="modalQuantidadeIngresso">Quantidade</label>
          <input id="modalQuantidadeIngresso" class="form-control" type="number" min="1" value="${ingresso.quantidade}" required>
        </div>

        <div>
          <label class="form-label" for="modalStatusIngresso">Status</label>
          <select id="modalStatusIngresso" class="form-control" required>
            <option value="Reservado">Reservado</option>
            <option value="Pago">Pago</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div class="grid gap-3 md:grid-cols-2">
        <button class="btn-primary" type="submit">Salvar alterações</button>
        <button class="btn-secondary" id="cancelarModalIngresso" type="button">Cancelar</button>
      </div>
    </form>
  `,
  );

  document.querySelector("#modalEventoIngresso").value = ingresso.eventoId;
  document.querySelector("#modalSetorIngresso").value = ingresso.setor;
  document.querySelector("#modalStatusIngresso").value = ingresso.status;

  document
    .querySelector("#cancelarModalIngresso")
    .addEventListener("click", fecharModal);

  document
    .querySelector("#formModalIngresso")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const modalSetor = document.querySelector("#modalSetorIngresso");
      const optionSelecionada = modalSetor.options[modalSetor.selectedIndex];

      const ingressoAtualizado = {
        id: ingresso.id,
        comprador: document
          .querySelector("#modalCompradorIngresso")
          .value.trim(),
        email: document.querySelector("#modalEmailIngresso").value.trim(),
        eventoId: Number(document.querySelector("#modalEventoIngresso").value),
        setor: modalSetor.value,
        taxa: Number(optionSelecionada.dataset.taxa),
        quantidade: Number(
          document.querySelector("#modalQuantidadeIngresso").value,
        ),
        status: document.querySelector("#modalStatusIngresso").value,
      };

      if (
        !ingressoAtualizado.comprador ||
        !ingressoAtualizado.email ||
        ingressoAtualizado.quantidade <= 0
      ) {
        alert("Preencha todos os campos corretamente.");
        return;
      }

      const ingressosAtualizados = buscarIngressos().map((item) => {
        return Number(item.id) === Number(id) ? ingressoAtualizado : item;
      });

      salvarIngressos(ingressosAtualizados);
      renderizarTabelaIngressos();
      fecharModal();

      exibirAlerta(alertaIngressos, "Ingresso editado com sucesso!");
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
      abrirModalEditarEvento(id);
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
      abrirModalEditarIngresso(id);
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
