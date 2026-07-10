# TicketNow - Plataforma Acadêmica de Ingressos

O **TicketNow** é um projeto acadêmico desenvolvido com **Node.js**, **ExpressJS** e **EJS**, inspirado em plataformas de venda de ingressos online.

A aplicação permite visualizar eventos, cadastrar compras de ingressos e gerenciar eventos e ingressos por meio de um painel administrativo com operações de cadastro, edição, remoção e filtro.

---

## Objetivo do Projeto

O objetivo do projeto é simular uma plataforma de venda e gerenciamento de ingressos para eventos, aplicando conceitos de desenvolvimento web com:

- Rotas utilizando ExpressJS;
- Template engine EJS;
- CSS externo;
- JavaScript no navegador;
- Manipulação do DOM;
- Armazenamento de dados no localStorage;
- CRUD com inserir, editar, remover e filtrar registros;
- Renderização dinâmica de tabelas a partir de dados em JSON.

---

## Tecnologias Utilizadas

- **Node.js**
- **ExpressJS**
- **EJS**
- **HTML5**
- **CSS3**
- **Tailwind CSS via CDN**
- **JavaScript**
- **localStorage**
- **JSON**

---

## Funcionalidades

### Página Inicial

A página inicial apresenta o projeto e possui um carrossel de eventos em destaque.

O carrossel permite navegar entre diferentes eventos, alterando dinamicamente:

- Imagem;
- Nome do evento;
- Categoria;
- Descrição;
- Cidade;
- Data;
- Preço.

---

### Página de Eventos

A página de eventos exibe os eventos disponíveis cadastrados inicialmente no projeto.

Ela possui filtro por categoria, permitindo visualizar eventos como:

- Música;
- Comédia;
- Show;
- Tecnologia.

O filtro é feito através de parâmetros na URL, utilizando a rota `/eventos`.

---

### Página de Ingressos

A página de ingressos representa a visão do usuário comum.

Nela, o usuário pode cadastrar uma compra de ingresso informando:

- Nome do comprador;
- E-mail;
- Evento;
- Setor;
- Quantidade.

O sistema calcula automaticamente:

- Subtotal;
- Taxas;
- Valor total.

Os ingressos cadastrados são salvos no `localStorage` e podem ser visualizados posteriormente no painel administrativo.

---

### Painel Administrativo

A página Admin é a principal área de gerenciamento da aplicação.

Ela possui dois CRUDs:

#### CRUD de Eventos

Permite:

- Cadastrar eventos;
- Listar eventos;
- Filtrar eventos por texto;
- Editar eventos em uma janela modal;
- Remover eventos.

Cada evento possui:

- Nome;
- Categoria;
- Cidade;
- Data;
- Preço;
- Status.

#### CRUD de Ingressos

Permite:

- Cadastrar ingressos;
- Listar ingressos cadastrados;
- Filtrar ingressos por texto;
- Editar ingressos em uma janela modal;
- Remover ingressos.

Cada ingresso possui:

- Comprador;
- E-mail;
- Evento vinculado;
- Setor;
- Quantidade;
- Total;
- Status.

---

### Página Sobre

A página Sobre apresenta a proposta acadêmica do projeto, explicando a ideia geral da plataforma e sua utilidade.

---

### Página Contato

A página Contato possui um formulário simulado.

O JavaScript valida os campos e exibe uma mensagem de resposta ao usuário sem recarregar a página.

---

### Página 404

A aplicação possui uma página personalizada para rotas inexistentes.

Quando o usuário acessa uma URL inválida, o sistema renderiza uma página amigável informando que a página não foi encontrada.

---

## Estrutura do Projeto

```txt
ticketMaster-app/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── img/
│   │   ├── Aurora fest music.png
│   │   ├── Stand up.png
│   │   ├── rock fest.png
│   │   └── gamer event.png
│   └── js/
│       ├── admin.js
│       ├── contato.js
│       ├── home-carousel.js
│       ├── ingressos.js
│       └── menu.js
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── 404.ejs
│   ├── admin.ejs
│   ├── contato.ejs
│   ├── eventos.ejs
│   ├── index.ejs
│   ├── ingressos.ejs
│   └── sobre.ejs
├── package.json
├── package-lock.json
├── server.js
└── README.md
