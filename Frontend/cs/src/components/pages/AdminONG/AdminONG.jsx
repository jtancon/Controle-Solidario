import './AdminONG.css';
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import api from "../../../services/api"; // <- Usa axios com baseURL já definida
import CardONGDoacao from './DoacoesCard/CardONGDoacao';
import AcoesONG from './AcoesCard/AcoesONG';
import SearchBar from '../../SearchBar/SearchBar';

function AdminONG() {
  const [doacoes, setDoacoes] = useState([]);
  const [acoes, setAcoes] = useState([]);
  const [uidOng, setUidOng] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const id = user.uid;
        setUidOng(id);
        await carregarDados(id);
      }
    });

    return () => unsubscribe();
  }, []);

  const carregarDados = async (id) => {
    try {
      const doacoesRes = await api.get(`/doacoes/ong/${id}`);
      const acoesRes = await api.get(`/acoes/ong/${id}`);
      setDoacoes(doacoesRes.data);
      setAcoes(acoesRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
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
      <NavbarDoador />
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
          <div className="HistONG">
            <div className="DoacaoOngContainer">
              <h1 className="titulo">Doações para ONG</h1>
              <CardONGDoacao/>
              <CardONGDoacao/>
            </div>
          </div>
          <div className="HistAcoes">
            <div className="DoacaoOngContainer">
              <h1 className="titulo">Doações para Ações</h1>
              <CardONGDoacao/>
              <CardONGDoacao/>
            </div>
          </div>
          {/* <div className="scroll-area">
            {doacoes.map((d) => (
              <div className="items" key={d.id}>
                <div className="info-box">
                  <div className="info"><strong>ID:</strong> {d.id}</div>
                  <div className="info"><strong>Valor:</strong> R$ {d.valor?.toFixed(2)}</div>
                  <div className="info"><strong>Tipo:</strong> {d.tipo}</div>
                  <div className="info"><strong>Data:</strong> {formatarData(d.data)}</div>
                  <div className="info full-width"><strong>Descrição:</strong> {d.descricao}</div>
                </div>
              </div>
            ))}
          </div> */}
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
            <AcoesONG />
            <AcoesONG />
            <AcoesONG />
            <AcoesONG />
          </div>
          {/* <div className="scroll-area">
            {acoes.map((a) => (
              <div className="items" key={a.id}>
                <div className="info-box">
                  <div className="info"><strong>ID:</strong> {a.id}</div>
                  <div className="info"><strong>Título:</strong> {a.titulo}</div>
                  <div className="info">
                    <strong>Status:</strong>
                    <select
                      value={a.status}
                      onChange={(e) => editarStatus(a.id, e.target.value)}
                    >
                      <option value="Planejada">Planejada</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Ativa">Ativa</option>
                      <option value="Encerrada">Encerrada</option>
                    </select>
                  </div>
                  <div className="info"><strong>Início:</strong> {a.dataInicio}</div>
                  <div className="info"><strong>Fim:</strong> {a.dataFim}</div>
                  <div className="info full-width"><strong>Descrição:</strong> {a.descricao}</div>
                  <button className="botao-excluir" onClick={() => excluirAcao(a.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div> */}
        </div>
        </>
        )}
      </div>
    </>
  );
}

export default AdminONG;
