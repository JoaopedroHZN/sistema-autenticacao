import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [mensagemGlobal, setMensagemGlobal] = useState('');
  const [erroGlobal, setErroGlobal] = useState('');

  // ESTADOS DA PAGINAÇÃO
  const [listaUsuarios, setListaUsuarios] = useState([]); // Guarda os usuários fatiados da página atual
  const [paginaAtual, setPaginaAtual] = useState(1);       // Controla em qual página o sistema está
  const [totalPaginas, setTotalPaginas] = useState(1);     // Guarda o limite máximo de páginas do banco

  // Função de cadastro (que já estava funcionando perfeitamente)
  async function cadastrarUsuario(dados) {
    try {
      setErroGlobal('');
      setMensagemGlobal('');
      const resposta = await axios.post('http://localhost:3000/api/cadastro', dados);
      setMensagemGlobal(resposta.data.mensagem);
      
      // UPGRADE: Toda vez que um usuário novo for cadastrado com sucesso, 
      // atualizamos a listagem automaticamente para refletir no banco.
      buscarUsuariosPaginados(paginaAtual);
      return true;
    } catch (erro) {
      if (erro.response && erro.response.data && erro.response.data.erro) {
        setErroGlobal(erro.response.data.erro);
      } else {
        setErroGlobal('Falha na comunicação com o servidor. 📡');
      }
      return false;
    }
  }

  /**
   * Função responsável por buscar os dados paginados no Backend usando o método GET do Axios.
   * @param {number} numeroPagina - A página que queremos carregar do banco.
   */
  async function buscarUsuariosPaginados(numeroPagina) {
    try {
      // Fazemos o GET passando os Query Params (?pagina=X&limite=5) para a nossa nova rota do Express
      const resposta = await axios.get(`http://localhost:3000/api/usuarios?pagina=${numeroPagina}&limite=5`);
      
      // Atualizamos os nossos estados com as informações fatiadas vindas do backend
      setListaUsuarios(resposta.data.usuarios);
      setPaginaAtual(resposta.data.paginaAtual);
      setTotalPaginas(resposta.data.totalPaginas);
    } catch (erro) {
      console.error("Erro ao carregar a paginação:", erro);
    }
  }

  // O useEffect roda essa função automaticamente assim que a aplicação abre na tela.
  // Ele inicia carregando a página 1.
  useEffect(() => {
    buscarUsuariosPaginados(1);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      cadastrarUsuario, 
      mensagemGlobal, 
      erroGlobal, 
      setErroGlobal, 
      setMensagemGlobal,
      // Compartilhamos as variáveis e a função da paginação com o app inteiro
      listaUsuarios,
      paginaAtual,
      totalPaginas,
      buscarUsuariosPaginados
    }}>
      {children}
    </AuthContext.Provider>
  );
}