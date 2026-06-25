import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react'; // 🔥 Adicionado o useState para o tema
import { AuthContext } from './contexts/AuthContext';

function App() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

  // Estado para controlar se o Modo Escuro está ativo
  const [temaEscuro, setTemaEscuro] = useState(true);

  // Consumimos as novas variáveis globais de paginação que criamos no contexto
  const {
    cadastrarUsuario,
    mensagemGlobal,
    erroGlobal,
    listaUsuarios,
    paginaAtual,
    totalPaginas,
    buscarUsuariosPaginados
  } = useContext(AuthContext);

  const senhaAtual = watch("senha");

  const salvarFormulario = async (dados) => {
    const sucesso = await cadastrarUsuario(dados);
    if (sucesso) reset();
  };

  // 🎨 Objeto de Cores Dinâmicas baseado no Tema
  const cores = {
    fundoTela: temaEscuro ? '#121212' : '#f8f9fa',
    textoPrincipal: temaEscuro ? '#ffffff' : '#333333',
    textoSecundario: temaEscuro ? '#aaaaaa' : '#555555',
    fundoCard: temaEscuro ? '#1e1e1e' : '#ffffff',
    borda: temaEscuro ? '#333333' : '#ccc',
    fundoTabelaHeader: temaEscuro ? '#2a2a2a' : '#f2f2f2',
    bordaTabela: temaEscuro ? '#2a2a2a' : '#ddd',
    botaoTemaFundo: temaEscuro ? '#ffffff' : '#222222',
    botaoTemaTexto: temaEscuro ? '#222222' : '#ffffff',
  };

  return (
    <div style={{
      backgroundColor: cores.fundoTela,
      minHeight: '100vh',
      width: '100%',                 // 🔥 Garante largura total
      boxSizing: 'border-box',       // 🔥 Força o cálculo correto incluindo paddings
      transition: 'background-color 0.3s ease',
      padding: '20px 0'
    }}>

      <div style={{
        maxWidth: '600px',
        width: '95%',                  // 🔥 Evita estourar em telas menores
        margin: '10px auto',
        padding: '20px',
        boxSizing: 'border-box',       // 🔥 Adicionado
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* 🔥 BOTÃO DE ALTERNAR TEMA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button
            onClick={() => setTemaEscuro(!temaEscuro)}
            style={{
              padding: '8px 16px',
              background: cores.botaoTemaFundo,
              color: cores.botaoTemaTexto,
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            {temaEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </button>
        </div>

        {/* SEÇÃO DO FORMULÁRIO */}
        <div style={{
          border: `1px solid ${cores.borda}`,
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: cores.fundoCard,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '40px',
          color: cores.textoPrincipal,
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ textAlign: 'center', color: cores.textoPrincipal }}>📝 Cadastro de Sistema</h2>
          {mensagemGlobal && <p style={{ color: 'green', backgroundColor: '#e6ffe6', padding: '8px', borderRadius: '5px', fontWeight: 'bold', textAlign: 'center' }}>{mensagemGlobal}</p>}
          {erroGlobal && <p style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '8px', borderRadius: '5px', fontWeight: 'bold', textAlign: 'center' }}>{erroGlobal}</p>}

          <form onSubmit={handleSubmit(salvarFormulario)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label>Nome Completo:</label>
              <input type="text" {...register("nome", { required: "O nome é obrigatório!" })} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              {errors.nome && <span style={{ color: 'red', fontSize: '12px' }}>{errors.nome.message}</span>}
            </div>

            <div>
              <label>E-mail:</label>
              <input type="text" {...register("email", { required: "O e-mail é obrigatório!", pattern: { value: /^\S+@\S+\.\S+$/, message: "E-mail inválido!" } })} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}
            </div>

            <div>
              <label>Senha:</label>
              <input type="password" {...register("senha", { required: "A senha é obrigatória!", minLength: { value: 8, message: "Mínimo 8 caracteres!" } })} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              {errors.senha && <span style={{ color: 'red', fontSize: '12px' }}>{errors.senha.message}</span>}
            </div>

            <div>
              <label>Confirme a Senha:</label>
              <input type="password" {...register("confirmarSenha", { required: "Confirme a senha!", validate: (valor) => valor === senhaAtual || "As senhas não coincidem!" })} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              {errors.confirmarSenha && <span style={{ color: 'red', fontSize: '12px' }}>{errors.confirmarSenha.message}</span>}
            </div>

            <button type="submit" style={{ width: '100%', padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Finalizar Cadastro
            </button>
          </form>
        </div>

        {/* SEÇÃO DA TABELA COM PAGINAÇÃO */}
        <div style={{
          border: `1px solid ${cores.borda}`,
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: cores.fundoCard,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          color: cores.textoPrincipal,
          transition: 'all 0.3s ease'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: cores.textoPrincipal }}>👥 Usuários Cadastrados (Limitação: 5 por página)</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: cores.fundoTabelaHeader, borderBottom: `2px solid ${cores.bordaTabela}` }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Nome</th>
                <th style={{ padding: '10px' }}>E-mail</th>
              </tr>
            </thead>
            <tbody>
              {listaUsuarios.map((usuario) => (
                <tr key={usuario.id} style={{ borderBottom: `1px solid ${cores.bordaTabela}` }}>
                  <td style={{ padding: '10px' }}>{usuario.id}</td>
                  <td style={{
                    padding: '10px',
                    wordBreak: 'break-all',
                    maxWidth: '220px',
                    whiteSpace: 'normal'
                  }}>
                    {usuario.id === 1 ? 'João Pedro' : usuario.nome}
                  </td>
                  <td style={{ padding: '10px' }}>{usuario.email}</td>
                </tr>
              ))}
              {listaUsuarios.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '10px', textAlign: 'center', color: cores.textoSecundario }}>Nenhum usuário cadastrado ainda.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* CONTROLES DOS BOTÕES DE PÁGINA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
            <button
              disabled={paginaAtual === 1}
              onClick={() => buscarUsuariosPaginados(paginaAtual - 1)}
              style={{ padding: '6px 12px', cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer' }}
            >
              ◀ Anterior
            </button>

            <span style={{ fontWeight: 'bold' }}>Página {paginaAtual} de {totalPaginas}</span>

            <button
              disabled={paginaAtual === totalPaginas}
              onClick={() => buscarUsuariosPaginados(paginaAtual + 1)}
              style={{ padding: '6px 12px', cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer' }}
            >
              Próximo ▶
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;