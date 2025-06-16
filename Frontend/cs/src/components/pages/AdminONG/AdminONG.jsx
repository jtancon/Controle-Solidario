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
  const [abaSelecionada, setAbaSelecionada] = useState("doacoes");
  const [mostrarNovaAcao, setMostrarNovaAcao] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [status, setStatus] = useState("Planejada");
  const [emailOng, setEmailOng] = useState("");

  const formatarData = (data) => {
    if (data?.seconds) {
      return new Date(data.seconds * 1000).toLocaleDateString("pt-BR");
    }
    return "Data inválida";
  };

  const validarCamposAcao = ({ titulo, descricao, dataInicio, dataFim, status }) => {
    const erros = [];
    if (!titulo?.trim()) erros.push("Título é obrigatório.");
    if (!descricao?.trim()) erros.push("Descrição é obrigatória.");
    if (!dataInicio) erros.push("Data de início é obrigatória.");
    if (!dataFim) erros.push("Data de fim é obrigatória.");
    if (!status?.trim()) erros.push("Status é obrigatório.");
    return erros;
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        console.log(`1. [ADMONG] Usuário logado encontrado: ${user.email}`);
        setEmailOng(user.email);
        await carregarDados(user.email);
      } else {
        console.log("1. [ADMONG] Nenhuma ONG logada.");
      }
    });
    return () => unsubscribe();
  }, []);

  const carregarDados = async (emailOng) => {
    console.log("2. [ADMONG] Iniciando carregamento de dados...");
    try {
      console.log("3. [ADMONG] Buscando todos os usuários...");
      const usuariosRes = await api.get('/usuarios');
      const listaUsuarios = usuariosRes.data;
      console.log("4. [ADMONG] Usuários recebidos:", listaUsuarios);
      setTodosUsuarios(listaUsuarios);

      console.log(`5. [ADMONG] Buscando doações para ONG: ${emailOng}`);
      const doacoesRes = await api.get(`/doacoes/ong/${encodeURIComponent(emailOng)}`);
      console.log("6. [ADMONG] Doações recebidas (brutas):", doacoesRes.data);

      const doacoesEnriquecidas = doacoesRes.data.map((doacao) => {
        const doadorInfo = listaUsuarios.find(u => u.email === doacao.idDoador);
        return {
          ...doacao,
          nomeDoador: doadorInfo?.nome || "Doador Desconhecido",
          imagemDoador: doadorInfo?.fotoPerfil || "src/assets/ONGS.png"
        };
      });

      console.log("7. [ADMONG] Doações enriquecidas:", doacoesEnriquecidas);
      setDoacoes(doacoesEnriquecidas);

      console.log(`8. [ADMONG] Buscando ações da ONG: ${emailOng}`);
      const acoesRes = await api.get(`/acoes/ong/${encodeURIComponent(emailOng)}`);
      console.log("9. [ADMONG] Ações recebidas:", acoesRes.data);
      setAcoes(acoesRes.data);

      console.log("10. [ADMONG] Dados carregados com sucesso.");

    } catch (error) {
      console.error("[ADMONG] ❌ Erro ao carregar dados:", error);
    }
  };

  const criarAcao = async () => {
    console.log("11. [ADMONG] Iniciando criação de ação...");

    const erros = validarCamposAcao({ titulo, descricao, dataInicio, dataFim, status });
    if (erros.length > 0) {
      console.warn("12. [ADMONG] Erros de validação:", erros);
      alert("Corrija os erros:\n" + erros.join("\n"));
      return;
    }

    const novaAcao = {
      titulo,
      descricao,
      dataInicio,
      dataFim,
      status,
      idOng: emailOng,
    };

    try {
      const res = await api.post("/acoes", novaAcao);
      console.log("13. [ADMONG] ✅ Ação criada:", res.data);
      alert("✅ Ação criada com sucesso!");
      setAcoes(prev => [...prev, res.data]);

      // Resetar formulário
      setTitulo("");
      setDescricao("");
      setDataInicio("");
      setDataFim("");
      setStatus("Planejada");
      setMostrarNovaAcao(false);

    } catch (error) {
      console.error("❌ [ADMONG] Erro ao criar ação:", error);
      alert("Erro ao criar ação.");
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
        )}

        {abaSelecionada === "acoes" && (
        <div className="menuAcoes">
          <div className="pesquisaAcoes">
            <SearchBar
              placeholder="Pesquisa por título ou status"
              onChange={(e) => setFiltro(e.target.value)}
            />
            <button className="btnNovaAcao"
              onClick={() => setMostrarNovaAcao(!mostrarNovaAcao)}>
              Nova Ação
            </button>
          </div>

          <div className={`novaAcaoContainer ${mostrarNovaAcao ? 'aparecer' : 'esconder'}`}>
            <div className="cardNovaAcaoConteudo">
              <h1 className="tituloCardAcao">Crie sua nova ação</h1>
              <div className="inputsAcao">
                <div className="linhaTexto">
                  <label>Título: </label>
                  <input type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título da ação"
                  />
                </div>
                <div className="linhaTexto">
                  <label>Descrição: </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva sua ação"
                  />
                </div>
                <div className="linhaTexto">
                  <label>Data de Início: </label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div className="linhaTexto">
                  <label>Data de Fim: </label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
                <div className="linhaTexto">
                  <label>Status: </label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Planejada">Planejada</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Ativa">Ativa</option>
                    <option value="Encerrada">Encerrada</option>
                  </select>
                </div>
              </div>
              <button onClick={criarAcao} className="btnCriarAcao">Criar Ação</button>
            </div>
          </div>

            <div className="acoesONGContainer">
              {acoes.length === 0 ? (
                <h2 className="semDadosONG">Sem ações cadastradas.</h2>
              ) : (
                acoes
                  .filter(acao =>
                    acao.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
                    acao.status.toLowerCase().includes(filtro.toLowerCase())
                  )
                  .map(acao => (
                    <AcoesONG
                      key={acao.id}
                      titulo={acao.titulo}
                      descricao={acao.descricao}
                      dataInicio={acao.dataInicio}
                      dataFim={acao.dataFim}
                      status={acao.status}
                      onEditarStatus={(novoStatus) => editarStatus(acao.id, novoStatus)}
                      onExcluir={() => excluirAcao(acao.id)}
                    />
                  ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminONG;
