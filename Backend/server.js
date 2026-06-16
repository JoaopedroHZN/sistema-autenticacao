// Importando as ferramentas 
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const path = require('path');

// Iniciando o servidor
const app = express();
const PORTA = 3000;

// (Middlewares)
// Configuração do CORS para aceitar requisições locais e do Frontend na nuvem
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://sistema-autenticacao-eight-phi.vercel.app' // O link da sua Vercel!
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));


app.use(express.json()); // O servidor vai entender dados no formato JSON

// Configuracao do Banco de Dados SQLite
// Cria um arq banco.db na pasta backend para salvar os dados
const db = new sqlite3.Database(path.join(__dirname, './banco.db'), (erro) => {
    if (erro) {
        console.error('Erro ao conectar no banco de dados: ', erro.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite');
    }
});

// Criando a tabela de usuarios se ela nao existir
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
)`);

// Metodo Post para Cadastro
app.post('/api/cadastro', (req, res) => {
    // 1. Pegando os dados que vieram do FrontEnd (React)
    console.log("📥 Dados que acabaram de chegar do React:", req.body);
    const { nome, email, senha, confirmarSenha } = req.body;

    // 2. Validação Rigorosa no Backend
    if (!nome || !email || !senha || !confirmarSenha) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
    }

    if (senha !== confirmarSenha) {
        return res.status(400).json({ erro: "As senhas não coincidem!" });
    }

    if (senha.length < 8) {
        return res.status(400).json({ erro: "A senha deve ter pelo menos 8 caracteres!" });
    }

    // 3. Inserindo os dados no Banco de Dados SQLite
    const query = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
    
    db.run(query, [nome, email, senha], function(erro) {
        if (erro) {
            // Se o e-mail já existir, o SQLite vai rejeitar por causa do UNIQUE
            if (erro.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ erro: "Este e-mail já está cadastrado no sistema!" });
            }
            return res.status(500).json({ erro: "Erro interno ao salvar no banco de dados." });
        }
        
        // Se deu tudo certo, devolvemos o Status 201 (Created) com a mensagem de sucesso
        res.status(201).json({ 
            mensagem: "Usuário cadastrado com sucesso!", 
            id: this.lastID 
        });
    });
});

// ==========================================
// ROTA DE LISTAGEM COM PAGINAÇÃO (MÉTODO GET)
// ==========================================
app.get('/api/usuarios', (req, res) => {
    // 1. Pegamos os parâmetros que vêm na URL (Query Params). 
    // Se o frontend não mandar nada, definimos como padrão: página 1 e limite de 5 usuários por página.
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 5;

    // 2. Calculamos o DESLOCAMENTO (OFFSET).
    // Exemplo: Se estamos na página 2 e o limite é 5, o cálculo será: (2 - 1) * 5 = 5.
    // Isso diz para o banco de dados: "Pule os primeiros 5 usuários e me dê os próximos 5".
    const deslocamento = (pagina - 1) * limite;

    // 3. Primeira Query: Contar o TOTAL de usuários no banco (necessário para o frontend saber onde parar)
    db.get(`SELECT COUNT(*) AS total FROM usuarios`, [], (erro, resultadoCount) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao contar usuários no banco." });
        }

        const totalUsuarios = resultadoCount.total;

        // 4. Segunda Query: Buscar os usuários reais usando LIMIT e OFFSET para fatiar o banco
        const queryListagem = `SELECT id, nome, email FROM usuarios LIMIT ? OFFSET ?`;
        
        db.all(queryListagem, [limite, deslocamento], (erro, linhas) => {
            if (erro) {
                return res.status(500).json({ erro: "Erro ao buscar a lista de usuários." });
            }

            // 5. Devolvemos um objeto completo contendo os dados e os metadados da paginação
            res.json({
                usuarios: linhas,              // Array com os usuários da página atual
                paginaAtual: pagina,           // A página que o usuário está vendo
                totalPaginas: Math.ceil(totalUsuarios / limite), // Cálculo de quantas páginas existem no total
                totalUsuarios: totalUsuarios   // Quantidade de registros totais salvos no SQLite
            });
        });
    });
});


// O código fica travado aqui mantendo o processo do Node ativo e rodando!
app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando com sucesso na porta http://localhost:${PORTA}`);
});