import './AdminONG.css';
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../../services/firebaseconfig";

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
    const doacoesRef = query(collection(db, "doacao"), where("IdOng", "==", id));
    const acoesRef = query(collection(db, "acoes"), where("IdOng", "==", id));

    const doacoesSnap = await getDocs(doacoesRef);
    const acoesSnap = await getDocs(acoesRef);

    setDoacoes(doacoesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setAcoes(acoesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const excluirAcao = async (idAcao) => {
    if (window.confirm("Deseja realmente excluir esta ação?")) {
      await deleteDoc(doc(db, "acoes", idAcao));
      setAcoes(prev => prev.filter(acao => acao.id !== idAcao));
    }
  };

  const editarStatus = async (idAcao, novoStatus) => {
    const acaoRef = doc(db, "acoes", idAcao);
    await updateDoc(acaoRef, { Status: novoStatus });
    setAcoes(prev =>
      prev.map((acao) =>
        acao.id === idAcao ? { ...acao, Status: novoStatus } : acao
      )
    );
  };

  return (
    <>
      <NavbarDoador />
      <div className="AdminONG">
        <div className="tabela">
          <h1 className="titulo">Doações</h1>
          <div className="scroll-area">
            {doacoes.map((d) => (
              <div className="items" key={d.id}>
                <div className="info-box">
                  <div className="info"><strong>ID:</strong> {d.id}</div>
                  <div className="info"><strong>Valor:</strong> R$ {d.Valor?.toFixed(2)}</div>
                  <div className="info"><strong>Tipo:</strong> {d.tipo}</div>
                  <div className="info"><strong>Data:</strong> {d.Data?.toDate().toLocaleString()}</div>
                  <div className="info full-width"><strong>Descrição:</strong> {d.descricao}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tabela">
          <h1 className="titulo">Ações da ONG</h1>
          <div className="scroll-area">
            {acoes.map((a) => (
              <div className="items" key={a.id}>
                <div className="info-box">
                  <div className="info"><strong>ID:</strong> {a.id}</div>
                  <div className="info"><strong>Título:</strong> {a.Titulo}</div>
                  <div className="info">
                    <strong>Status:</strong> 
                    <select
                      value={a.Status}
                      onChange={(e) => editarStatus(a.id, e.target.value)}
                    >
                      <option value="Planejada">Planejada</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Ativa">Ativa</option>
                      <option value="Encerrada">Encerrada</option>
                    </select>
                  </div>
                  <div className="info"><strong>Início:</strong> {a.DataInicio?.toDate().toLocaleDateString()}</div>
                  <div className="info"><strong>Fim:</strong> {a.DataFim?.toDate().toLocaleDateString()}</div>
                  <div className="info full-width"><strong>Descrição:</strong> {a.Descricao}</div>
                  <button className="botao-excluir" onClick={() => excluirAcao(a.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminONG;
