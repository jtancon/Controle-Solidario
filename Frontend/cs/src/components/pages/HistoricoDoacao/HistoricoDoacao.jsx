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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await api.get(`/doacoes/doador/${user.uid}`);

          const enriquecidas = await Promise.all(res.data.map(async (d) => {
            try {
              const ongRes = await api.get(`/usuarios/${d.idOng}`);
              const ong = ongRes.data;
              return {
                ...d,
                nome: ong.nome || "ONG",
                imagem: ong.fotoPerfil || "src/assets/ONGS.png"
              };
            } catch {
              return {
                ...d,
                nome: "ONG",
                imagem: "src/assets/ONGS.png"
              };
            }
          }));

          setDoacoes(enriquecidas);
        } catch (error) {
          console.error("Erro ao buscar doações:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const doacoesFiltradas = doacoes.filter(d => {
    const texto = filtro.toLowerCase();
    return (
      d.descricao?.toLowerCase().includes(texto) ||
      d.valor?.toString().includes(texto)
    );
  });

  return (
    <>
      <NavBar />
      <div className="historico">
        <div className="main">
          <h1>Minhas Doações</h1>
          <div className="pesquisa">
            <SearchBar placeholder="Pesquisa por nome ou valor" onChange={(e) => setFiltro(e.target.value)} />
            <button className="btnFiltro">
              <svg xmlns="http://www.w3.org/2000/svg" width="30px" fill="none" viewBox="0 0 24 24" stroke="#aacbe2" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </button>
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
