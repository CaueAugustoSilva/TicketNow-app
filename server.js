const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const eventosDestaque = [
  {
    id: 1,
    nome: 'Festival Aurora 2026',
    categoria: 'Música',
    cidade: 'Rio de Janeiro',
    data: '2026-09-12',
    preco: 180,
    imagem: '/img/evento-festival.svg',
    destaque: true
  },
  {
    id: 2,
    nome: 'Noite do Stand-up Nacional',
    categoria: 'Comédia',
    cidade: 'São Paulo',
    data: '2026-08-20',
    preco: 95,
    imagem: '/img/evento-comedia.svg',
    destaque: false
  },
  {
    id: 3,
    nome: 'Rock Legends Tour',
    categoria: 'Show',
    cidade: 'Belo Horizonte',
    data: '2026-10-05',
    preco: 220,
    imagem: '/img/evento-rock.svg',
    destaque: true
  },
  {
    id: 4,
    nome: 'Arena Gamer Experience',
    categoria: 'Tecnologia',
    cidade: 'Curitiba',
    data: '2026-11-15',
    preco: 75,
    imagem: '/img/evento-gamer.svg',
    destaque: false
  }
];

const planos = [
  { nome: 'Pista', beneficio: 'Acesso ao evento', taxa: 'R$ 12,00' },
  { nome: 'Pista Premium', beneficio: 'Área próxima ao palco', taxa: 'R$ 18,00' },
  { nome: 'Camarote', beneficio: 'Área VIP + lounge', taxa: 'R$ 30,00' }
];

function renderizar(res, view, dados = {}) {
  res.render(view, {
    paginaAtual: view,
    eventosDestaque,
    planos,
    ...dados
  });
}

app.get('/', (req, res) => {
  renderizar(res, 'index', {
    titulo: 'TicketNow | Ingressos para eventos',
    subtitulo: 'Encontre shows, festivais, peças, eventos gamer e experiências ao vivo.'
  });
});

app.get('/eventos', (req, res) => {
  const categoria = req.query.categoria || 'Todos';
  const eventosFiltrados = categoria === 'Todos'
    ? eventosDestaque
    : eventosDestaque.filter(evento => evento.categoria === categoria);

  renderizar(res, 'eventos', {
    titulo: 'Eventos disponíveis',
    categoriaSelecionada: categoria,
    eventosFiltrados
  });
});

app.get('/ingressos', (req, res) => {
  renderizar(res, 'ingressos', {
    titulo: 'Ingressos e setores'
  });
});

app.get('/admin', (req, res) => {
  renderizar(res, 'admin', {
    titulo: 'Painel administrativo'
  });
});

app.get('/sobre', (req, res) => {
  renderizar(res, 'sobre', {
    titulo: 'Sobre o projeto'
  });
});

app.get('/contato', (req, res) => {
  renderizar(res, 'contato', {
    titulo: 'Contato'
  });
});

app.use((req, res) => {
  res.status(404).render('404', {
    titulo: 'Página não encontrada',
    paginaAtual: '404',
    eventosDestaque,
    planos
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
