const CHAVE_EVENTOS = 'ticketnow_eventos';

const eventosPadrao = [
  {
    id: 1,
    nome: 'Festival Aurora 2026',
    categoria: 'Música',
    cidade: 'Rio de Janeiro',
    data: '2026-09-12',
    preco: 180,
    status: 'Disponível'
  },
  {
    id: 2,
    nome: 'Noite do Stand-up Nacional',
    categoria: 'Comédia',
    cidade: 'São Paulo',
    data: '2026-08-20',
    preco: 95,
    status: 'Últimos ingressos'
  },
  {
    id: 3,
    nome: 'Rock Legends Tour',
    categoria: 'Show',
    cidade: 'Belo Horizonte',
    data: '2026-10-05',
    preco: 220,
    status: 'Disponível'
  }
];

const formEvento = document.querySelector('#formEvento');
const eventoId = document.querySelector('#eventoId');
const nomeEvento = document.querySelector('#nomeEvento');
const categoriaEvento = document.querySelector('#categoriaEvento');
const cidadeEvento = document.querySelector('#cidadeEvento');
const dataEvento = document.querySelector('#dataEvento');
const precoEvento = document.querySelector('#precoEvento');
const statusEvento = document.querySelector('#statusEvento');
const corpoTabelaEventos = document.querySelector('#corpoTabelaEventos');
const buscaEvento = document.querySelector('#buscaEvento');
const contadorEventos = document.querySelector('#contadorEventos');
const botaoSalvar = document.querySelector('#botaoSalvar');
const botaoCancelar = document.querySelector('#botaoCancelar');
const alertaTabela = document.querySelector('#alertaTabela');

function buscarEventos() {
  const dados = localStorage.getItem(CHAVE_EVENTOS);

  if (!dados) {
    localStorage.setItem(CHAVE_EVENTOS, JSON.stringify(eventosPadrao));
    return eventosPadrao;
  }

  return JSON.parse(dados);
}

function salvarEventos(eventos) {
  localStorage.setItem(CHAVE_EVENTOS, JSON.stringify(eventos));
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function exibirAlerta(mensagem) {
  alertaTabela.textContent = mensagem;
  alertaTabela.classList.remove('oculto');

  setTimeout(() => {
    alertaTabela.classList.add('oculto');
  }, 2500);
}

function limparFormulario() {
  formEvento.reset();
  eventoId.value = '';
  botaoSalvar.textContent = 'Cadastrar evento';
}

function renderizarTabela() {
  const termo = buscaEvento.value.toLowerCase().trim();
  const eventos = buscarEventos();

  const eventosFiltrados = eventos.filter((evento) => {
    return evento.nome.toLowerCase().includes(termo)
      || evento.categoria.toLowerCase().includes(termo)
      || evento.cidade.toLowerCase().includes(termo)
      || evento.status.toLowerCase().includes(termo);
  });

  corpoTabelaEventos.innerHTML = '';
  contadorEventos.textContent = `${eventosFiltrados.length} evento(s)`;

  if (eventosFiltrados.length === 0) {
    corpoTabelaEventos.innerHTML = `
      <tr>
        <td colspan="7">Nenhum evento encontrado para a busca realizada.</td>
      </tr>
    `;
    return;
  }

  eventosFiltrados.forEach((evento) => {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${evento.nome}</td>
      <td>${evento.categoria}</td>
      <td>${evento.cidade}</td>
      <td>${formatarData(evento.data)}</td>
      <td>${formatarMoeda(evento.preco)}</td>
      <td>${evento.status}</td>
      <td>
        <div class="acoes-tabela">
          <button class="botao-pequeno editar" type="button" onclick="editarEvento(${evento.id})">Editar</button>
          <button class="botao-pequeno remover" type="button" onclick="removerEvento(${evento.id})">Remover</button>
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
    status: statusEvento.value
  };

  if (!evento.nome || !evento.cidade || !evento.data || evento.preco < 0) {
    exibirAlerta('Preencha todos os campos corretamente.');
    return;
  }

  if (idEmEdicao) {
    const eventosAtualizados = eventos.map((item) => {
      return item.id === Number(idEmEdicao) ? evento : item;
    });

    salvarEventos(eventosAtualizados);
    exibirAlerta('Evento atualizado com sucesso!');
  } else {
    eventos.push(evento);
    salvarEventos(eventos);
    exibirAlerta('Evento cadastrado com sucesso!');
  }

  limparFormulario();
  renderizarTabela();
}

window.editarEvento = function editarEvento(id) {
  const eventos = buscarEventos();
  const evento = eventos.find((item) => item.id === id);

  if (!evento) {
    exibirAlerta('Evento não encontrado.');
    return;
  }

  eventoId.value = evento.id;
  nomeEvento.value = evento.nome;
  categoriaEvento.value = evento.categoria;
  cidadeEvento.value = evento.cidade;
  dataEvento.value = evento.data;
  precoEvento.value = evento.preco;
  statusEvento.value = evento.status;
  botaoSalvar.textContent = 'Salvar alterações';

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.removerEvento = function removerEvento(id) {
  const confirmar = confirm('Tem certeza que deseja remover este evento?');

  if (!confirmar) {
    return;
  }

  const eventos = buscarEventos();
  const eventosAtualizados = eventos.filter((evento) => evento.id !== id);

  salvarEventos(eventosAtualizados);
  exibirAlerta('Evento removido com sucesso!');
  renderizarTabela();
};

if (formEvento) {
  formEvento.addEventListener('submit', cadastrarOuAtualizarEvento);
  buscaEvento.addEventListener('input', renderizarTabela);
  botaoCancelar.addEventListener('click', limparFormulario);
  renderizarTabela();
}
