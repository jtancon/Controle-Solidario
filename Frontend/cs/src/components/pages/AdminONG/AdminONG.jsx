import './AdminONG.css';
import NavbarONG from "../../Navbar_Footer/NavbarONG";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import api from "../../../services/api";
import CardONGDoacao from './DoacoesCard/CardONGDoacao';
import AcoesONG from './AcoesCard/AcoesONG';
import SearchBar from '../../SearchBar/SearchBar';

function AdminONG() {
  const [doacoes, setDoacoes] = useState([]);
  const [acoes, setAcoes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [todosUsuarios, setTodosUsuarios] = useState([]);

  useEffect(() => {
  const auth = getAuth();
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user && user.email) {
      console.log(`4. [ADMONG] Usuário logado encontrado: ${user.email}`);
      await carregarDados(user.email);
    } else {
      console.log("4. [ADMONG] Nenhuma ONG logada, não é possível buscar dados.");
    }
  });

  return () => unsubscribe();
}, []);

const carregarDados = async (emailOng) => {
  try {
    console.log("1. [ADMONG] Buscando todos os usuários...");
    const usuariosRes = await api.get('/usuarios');
    console.log("2. [ADMONG] Usuários recebidos:", usuariosRes.data);
    const listaUsuarios = usuariosRes.data;
    setTodosUsuarios(listaUsuarios);

    console.log(`5. [ADMONG] Buscando doações para: /doacoes/ong/${encodeURIComponent(emailOng)}`);
    const doacoesRes = await api.get(`/doacoes/ong/${encodeURIComponent(emailOng)}`);
    console.log("6. [ADMONG] DADOS BRUTOS de doações recebidos:", doacoesRes.data);

    if (!doacoesRes.data || doacoesRes.data.length === 0) {
      console.log("7. [ADMONG] Nenhuma doação foi retornada pela API para este usuário.");
    }

    const enriquecidas = doacoesRes.data.map((doacao) => {
      const doadorInfo = listaUsuarios.find(u => u.email === doacao.idDoador);
      return {
        ...doacao,
        nomeDoador: doadorInfo?.nome || "Doador Desconhecido",
        imagemDoador: doadorInfo?.fotoPerfil || "src/assets/ONGS.png"
      };
    });

    console.log("8. [ADMONG] Doações enriquecidas:", enriquecidas);
    setDoacoes(enriquecidas);

    console.log(`9. [ADMONG] Buscando ações para: /acoes/ong/${encodeURIComponent(emailOng)}`);
    const acoesRes = await api.get(`/acoes/ong/${encodeURIComponent(emailOng)}`);
    console.log("10. [ADMONG] Ações recebidas:", acoesRes.data);
    setAcoes(acoesRes.data);

  } catch (error) {
    console.error("[ADMONG] Erro ao carregar dados:", error);
  }
};

  const excluirAcao = async (idAcao) => {
    if (window.confirm("Deseja realmente excluir esta ação?")) {
      try {
        await api.delete(`/acoes/${idAcao}`);
        setAcoes(prev => prev.filter(acao => acao.id !== idAcao));
      } catch (error) {
        console.error("Erro ao excluir ação:", error);
      }
    }
  };

  const editarStatus = async (idAcao, novoStatus) => {
    try {
      await api.put(`/acoes/${idAcao}`, { status: novoStatus });
      setAcoes(prev =>
        prev.map((acao) =>
          acao.id === idAcao ? { ...acao, status: novoStatus } : acao
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const formatarData = (data) => {
    if (data?.seconds) {
      return new Date(data.seconds * 1000).toLocaleString("pt-BR");
    }
    return "Data inválida";
  };

  const [abaSelecionada, setAbaSelecionada] = useState("doacoes");
  const [mostrarNovaAcao, setMostrarNovaAcao] = useState(false);

  return (
    <>
      <NavbarONG />
      <div className="AdminONG">
        <div className="menuTopo">
          <h1 className={abaSelecionada === "doacoes" ? "aba ativa" : "aba"}
          onClick={() => setAbaSelecionada("doacoes")}>Doações</h1>

          <h1 className={abaSelecionada === "acoes" ? "aba ativa" : "aba"}
          onClick={() => setAbaSelecionada("acoes")}>Ações</h1>
        </div>

        {abaSelecionada === "doacoes" && (
        <>
        <div className="menuDoacoes">
          <div className="DoacaoOngContainer">
            <h1 className="titulo">Doações para ONG</h1>
            
            {doacoes.length === 0 ? (
              <h2 className="semDadosONG">Sem doações no momento.</h2>
            ) : (
              doacoes.map((doacao) => (
                <CardONGDoacao
                  key={doacao.id}
                  nome={doacao.nomeDoador}
                  data={formatarData(doacao.data)}
                  valor={`R$ ${Number(doacao.valor).toFixed(2)}`}
                />
              ))
            )}
          </div>
        </div>
        </>
        )}
        {abaSelecionada === "acoes" && (
        <>
        <div className="menuAcoes">

          <div className="pesquisaAcoes">
            <SearchBar placeholder="Pesquisa por título ou status" />
            <button className="btnNovaAcao"
            onClick={() => setMostrarNovaAcao(!mostrarNovaAcao)}>
              Nova Ação</button>
          </div>

          <div className={`novaAcaoContainer ${mostrarNovaAcao ? 'aparecer' : 'esconder'}`}>
            <div className="cardNovaAcaoConteudo">
              <h1 className="tituloCardAcao">Crie sua nova ação</h1>
              <div className="inputsAcao">
                {<>
                <div className="linhaTexto">
                  <label>Título: </label>
                  <input type="text" placeholder="Título da ação" />
                </div>
                <div className="linhaTexto">
                  <label>Descrição: </label>
                  <textarea placeholder="Descreva sua ação"></textarea>
                </div>
                <div className="linhaTexto">
                  <label>Data de Início: </label>
                  <input type="date" />
                </div>
                <div className="linhaTexto">
                  <label>Data de Fim: </label>
                  <input type="date" />
                </div>
                <div className="linhaTexto">
                  <label>Status: </label>
                  <select>
                    <option value="Planejada">Planejada</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Ativa">Ativa</option>
                    <option value="Encerrada">Encerrada</option>
                  </select>
                </div></>
                  }
              </div>
            </div>
            <button type="submit" className="btnCriarAcao">Criar Ação</button>
          </div>

          <div className="acoesONGContainer">
            {acoes.length === 0 ? (
              <h2 className="semDadosONG">Sem ações cadastradas.</h2>
            ) : (
              acoes.map(acao => (
                <CardAcao
                  key={acao.id}
                  titulo={acao.titulo}
                  descricao={acao.descricao}
                  data={formatarData(acao.data)}
                  status={acao.status}
                  onEditar={() => editarAcao(acao.id,)}
                  onExcluir={() => excluirAcao(acao.id)}
                />
              ))
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </>
  );
}

export default AdminONG;
