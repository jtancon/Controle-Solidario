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
  // ✅ 1. Novo estado para guardar a lista de todos os utilizadores (ONGs)
  const [todosUsuarios, setTodosUsuarios] = useState([]);

  // ✅ 2. Primeiro, buscamos todos os utilizadores de uma só vez
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await api.get('/usuarios');
        setTodosUsuarios(res.data);
      } catch (error) {
        console.error("Erro ao buscar todos os usuários:", error);
      }
    };
    fetchAllUsers();
  }, []); // Executa apenas uma vez, quando o componente é montado

  // ✅ 3. Depois de ter os utilizadores, buscamos as doações e as enriquecemos localmente
  useEffect(() => {
    // Só executa se a lista de utilizadores já tiver sido carregada
    if (todosUsuarios.length === 0) return;

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          const doadorEmailCodificado = encodeURIComponent(user.email);
          const res = await api.get(`/doacoes/doador/${doadorEmailCodificado}`);

          // ✅ 4. Lógica de enriquecimento local, sem novas chamadas à API por item
          const enriquecidas = res.data.map((doacao) => {
            // Encontra a ONG correspondente na lista que já temos
            const ongInfo = todosUsuarios.find(u => u.email === doacao.idOng);
            
            return {
              ...doacao,
              nome: ongInfo?.nome || "ONG Desconhecida",
              imagem: ongInfo?.fotoPerfil || "src/assets/ONGS.png"
            };
          });

          setDoacoes(enriquecidas);
        } catch (error) {
          console.error("Erro ao buscar doações:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [todosUsuarios]); // Este useEffect depende da lista de utilizadores

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
              {doacoesFiltradas.map((d) => (
                <CardHist
                  key={d.id}
                  valor={d.valor}
                  descricao={d.descricao}
                  data={d.data?.seconds ? new Date(d.data.seconds * 1000).toLocaleDateString() : "Data inválida"}
                  tipo={d.tipo}
                  nome={d.nome}
                  imagem={d.imagem}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HistoricoDoacao;
