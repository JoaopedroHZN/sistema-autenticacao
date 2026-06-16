# 📝 Sistema de Autenticação com Listagem Paginada

Este é um projeto completo de Engenharia de Software focado em um sistema robusto de cadastro de usuários com validações rigorosas em ambos os lados (Frontend e Backend) e um sistema eficiente de listagem de dados com paginação dinâmica limitando 5 registros por página.

O projeto foi inteiramente arquitetado para ser resiliente a falhas, utilizando tratamento de exceções global e comunicação assíncrona via APIs REST.

## 🚀 Links do Projeto em Produção
* **Frontend (Vercel):** [https://sistema-autenticacao-khaki.vercel.app](https://sistema-autenticacao-khaki.vercel.app)
* **Backend (Render):** [https://sistema-autenticacao-f56l.onrender.com](https://sistema-autenticacao-f56l.onrender.com)

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React.js** com **Vite** para um ambiente de desenvolvimento rápido e otimizado.
* **React Hook Form** para gerenciamento de estados e validações de formulário síncronas.
* **Axios** para consumo de APIs assíncronas e tratamento estruturado de erros de rede.
* **React Context API** para gerenciar de forma global o estado de autenticação, usuários e paginação.

### Backend
* **Node.js** com o framework **Express** para roteamento de endpoints da API REST.
* **CORS** ativado de forma abrangente para permitir conexões seguras entre o ecossistema da Vercel e do Render.
* **SQLite** como banco de dados relacional e persistente, embarcado de forma leve.

### DevOps & Infraestrutura
* **Git & GitHub** para controle de versionamento.
* **Vercel** para hospedagem contínua do Frontend.
* **Render** para infraestrutura de Cloud do servidor Backend.

---

## 📦 Arquitetura de Endpoints da API

O servidor Express disponibiliza os seguintes endpoints estruturados:

| Método | Endpoint | Descrição | Parâmetros (Query/Body) |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/cadastro` | Cadastra um novo usuário no banco SQLite com validações estritas. | `body: { nome, email, senha, confirmarSenha }` |
| `GET` | `/api/usuarios` | Retorna a lista de usuários paginada (Offset-based pagination). | `query: ?pagina=1&limite=5` |

---

## 💻 Como Executar o Projeto Localmente

Se quiser rodar o ambiente de desenvolvimento na sua máquina:

### 1. Clonar o Repositório
```bash
git clone [https://github.com/JoaopedroHZN/sistema-autenticacao.git](https://github.com/JoaopedroHZN/sistema-autenticacao.git)
cd sistema-autenticacao

2. Configurar e Iniciar o Backend
O servidor backend gerencia as regras de negócio e cria o banco de dados automaticamente no primeiro início.

Bash
# Entrar no diretório do servidor
cd Backend

# Instalar todas as dependências necessárias (Express, Cors, SQLite3)
npm install

# Iniciar o servidor em ambiente de desenvolvimento
npm start


Assim que o comando npm start rodar com sucesso, o próprio Node criará o arquivo banco.db na raiz da pasta Backend e estruturará a tabela de usuários automaticamente. O servidor estará ouvindo em http://localhost:3000.

3. Configurar e Iniciar o Frontend (React + Vite)
Abra um novo terminal na pasta raiz do projeto (sistema-autenticacao) para levantar a interface do usuário:

Bash
# Entrar no diretório do cliente
cd Frontend

# Instalar as dependências da interface (Axios, React Hook Form)
npm install

# Iniciar o servidor de desenvolvimento do Vite
npm run dev
O cliente React estará rodando e pronto para o acesso em http://localhost:5173.

