import './HistoricoDoacao.css';
import CardHist from './CardHistorico';
import NavBar from '../../Navbar_Footer/NavbarDoador';
import SearchBar from '../../SearchBar/SearchBar';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import api from "../../../services/api"; // axios com baseURL

function HistoricoDoacao() {
  const [doacoes, setDoacoes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [todosUsuarios, setTodosUsuarios] = useState([]);

  // 1. Primeiro, buscamos todos os utilizadores de uma só vez
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        console.log("1. [HISTÓRICO] Buscando todos os usuários...");
        const res = await api.get('/usuarios');
        console.log("2. [HISTÓRICO] Usuários recebidos:", res.data);
        setTodosUsuarios(res.data);
      } catch (error) {
        console.error("Erro ao buscar todos os usuários:", error);
      }
    };
    fetchAllUsers();
  }, []);

  // 2. Depois, buscamos as doações e as enriquecemos
  useEffect(() => {
    // Só executa se a lista de utilizadores já tiver sido carregada
    if (todosUsuarios.length === 0) {
      console.log("3. [HISTÓRICO] Aguardando a lista de usuários ser carregada...");
      return;
    }

    console.log("3. [HISTÓRICO] Lista de usuários carregada. Buscando doações...");
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        console.log(`4. [HISTÓRICO] Usuário logado encontrado: ${user.email}`);
        try {
          const doadorEmailCodificado = encodeURIComponent(user.email);
          console.log(`5. [HISTÓRICO] Buscando doações para: /doacoes/doador/${doadorEmailCodificado}`);
          
          const res = await api.get(`/doacoes/doador/${doadorEmailCodificado}`);

          console.log("6. [HISTÓRICO] DADOS BRUTOS de doações recebidos:", res.data);

          if (!res.data || res.data.length === 0) {
              console.log("7. [HISTÓRICO] Nenhuma doação foi retornada pela API para este usuário.");
              return;
          }

          const enriquecidas = res.data.map((doacao) => {
            const ongInfo = todosUsuarios.find(u => u.email === doacao.idOng);
            
            // Log para cada tentativa de enriquecimento
            if (ongInfo) {
              // console.log(`Encontrada ONG '${ongInfo.nome}' para a doação com idOng '${doacao.idOng}'`);
            } else {
              // console.warn(`NÃO foi encontrada ONG para a doação com idOng '${doacao.idOng}'`);
            }

            return {
              ...doacao,
              nome: ongInfo?.nome || "ONG Desconhecida",
              imagem: ongInfo?.fotoPerfil || "src/assets/ONGS.png"
            };
          });

          console.log("7. [HISTÓRICO] Doações ENRIQUECIDAS prontas para exibição:", enriquecidas);
          setDoacoes(enriquecidas);
        } catch (error) {
          console.error("Erro ao buscar doações:", error);
        }
      } else {
          console.log("4. [HISTÓRICO] Nenhum usuário logado, não é possível buscar doações.");
      }
    });

    return () => unsubscribe();
  }, [todosUsuarios]); // Depende da lista de utilizadores

  const doacoesFiltradas = doacoes.filter(d => {
    const texto = filtro.toLowerCase();
    return (
      d.nome?.toLowerCase().includes(texto) ||
      d.descricao?.toLowerCase().includes(texto) ||
      d.valor?.toString().includes(texto)
    );
  });

  return (
    <>
      <NavBar />
      <div className="historico">
        <div className="mainHist">
          <h1>Minhas Doações</h1>
          <div className="pesquisa">
            <SearchBar placeholder="Pesquisa por nome, descrição ou valor" onChange={(e) => setFiltro(e.target.value)} />
          </div>
          <div className="cardWrapper">
            <div className="cardContainer">
              {/* ✅ Adicionada uma verificação para exibir mensagem se não houver doações */}
              {doacoesFiltradas.length > 0 ? (
                  doacoesFiltradas.map((d) => (
                    <CardHist
                      key={d.id}
                      valor={d.valor}
                      descricao={d.descricao}
                      data={d.data?.seconds ? new Date(d.data.seconds * 1000).toLocaleDateString() : "Data inválida"}
                      tipo={d.tipo}
                      nome={d.nome}
                      imagem={d.imagem}
                    />
                  ))
              ) : (
                  <p>Nenhuma doação encontrada para exibir.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HistoricoDoacao;
