import './HistoricoDoacao.css';
import CardHist from './CardHistorico';
import NavBar from '../../Navbar_Footer/NavbarDoador';
import SearchBar from '../../SearchBar/SearchBar';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebaseconfig';

function HistoricoDoacao() {
  const [doacoes, setDoacoes] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "doacao"), where("IdDoador", "==", user.uid));
        const snapshot = await getDocs(q);
        const lista = await Promise.all(snapshot.docs.map(async docSnap => {
          const data = docSnap.data();
          const ongRef = doc(db, "usuarios", data.IdOng);
          const ongSnap = await getDoc(ongRef);
          const ongData = ongSnap.exists() ? ongSnap.data() : {};
          return {
            id: docSnap.id,
            ...data,
            nomeONG: ongData.nome || "ONG desconhecida",
            fotoONG: ongData.fotoPerfil || "src/assets/ONGS.png"
          };
        }));
        setDoacoes(lista);
      }
    });
    return () => unsubscribe();
  }, []);

  const doacoesFiltradas = doacoes.filter(d => {
    const texto = filtro.toLowerCase();
    return (
      d.descricao?.toLowerCase().includes(texto) ||
      d.Valor?.toString().includes(texto)
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
                  valor={d.Valor}
                  descricao={d.descricao}
                  data={d.Data?.toDate().toLocaleDateString()}
                  tipo={d.tipo}
                  nome={d.nomeONG}
                  imagem={d.fotoONG}
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