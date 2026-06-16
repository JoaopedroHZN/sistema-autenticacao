import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

function App() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

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

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>

      {/* SEÇÃO DO FORMULÁRIO (Igualzinha ao que você já validou) */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>📝 Cadastro de Sistema</h2>
        {mensagemGlobal && <p style={{ color: 'green', backgroundColor: '#e6ffe6', padding: '8px', borderRadius: '5px', fontWeight: 'bold', textAlign: 'center' }}>{mensagemGlobal}</p>}
        {erroGlobal && <p style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '8px', borderRadius: '5px', fontWeight: 'bold', textAlign: 'center' }}>{erroGlobal}</p>}

        <form onSubmit={handleSubmit(salvarFormulario)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label>Nome Completo:</label>
            <input type="text" {...register("nome", { required: "O nome é obrigatório!" })} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            {errors.nome && <span style={{ color: 'red', fontSize: '12px' }}>{errors.nome.message}</span>}
          </div>

          <div>
            <label>E-mail:</label>
            <input type="text" {...register("email", { required: "O e-mail é obrigatório!", pattern: { value: /^\S+@\S+\.\S+$/, message: "E-mail inválido!" } })} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}
          </div>

          <div>
            <label>Senha:</label>
            <input type="password" {...register("senha", { required: "A senha é obrigatória!", minLength: { value: 8, message: "Mínimo 8 caracteres!" } })} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            {errors.senha && <span style={{ color: 'red', fontSize: '12px' }}>{errors.senha.message}</span>}
          </div>

          <div>
            <label>Confirme a Senha:</label>
            <input type="password" {...register("confirmarSenha", { required: "Confirme a senha!", validate: (valor) => valor === senhaAtual || "As senhas não coincidem!" })} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            {errors.confirmarSenha && <span style={{ color: 'red', fontSize: '12px' }}>{errors.confirmarSenha.message}</span>}
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Finalizar Cadastro
          </button>
        </form>
      </div>

      {/* ==========================================
          NOVA SEÇÃO: UPGRADE DE PAGINAÇÃO EXIGIDO
         ========================================== */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>👥 Usuários Cadastrados (Limitação: 5 por página)</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Nome</th>
              <th style={{ padding: '10px' }}>E-mail</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapeia o array fatiado vindo do contexto e constrói as linhas da tabela */}
            {listaUsuarios.map((usuario) => (
              <tr key={usuario.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{usuario.id}</td>

                {/* 🔥 LINHA CORRIGIDA COM QUEBRA DE TEXTO AUTOMÁTICA */}
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
          </tbody>
        </table>

        {/* CONTROLES DOS BOTÕES DE PÁGINA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
          {/* Botão Anterior: Desativado se estivermos na página 1 */}
          <button
            disabled={paginaAtual === 1}
            onClick={() => buscarUsuariosPaginados(paginaAtual - 1)}
            style={{ padding: '6px 12px', cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer' }}
          >
            ◀ Anterior
          </button>

          <span style={{ fontWeight: 'bold' }}>Página {paginaAtual} de {totalPaginas}</span>

          {/* Botão Próximo: Desativado se chegarmos na última página calculada pelo backend */}
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
  );
}

export default App;