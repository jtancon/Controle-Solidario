import "./Dashboard.css";
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import Footer from "../../Navbar_Footer/Footer";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebaseconfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const Dashboard = () => {
  const [total, setTotal] = useState(0);
  const [doadores, setDoadores] = useState(0);
  const [qtdMes, setQtdMes] = useState(0);
  const [qtdProjetos, setQtdProjetos] = useState(0);
  const [graficoDados, setGraficoDados] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await carregarDados(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const carregarDados = async (uid) => {
    const doacoesRef = query(collection(db, "doacao"), where("IdOng", "==", uid));
    const acoesRef = query(collection(db, "acoes"), where("IdOng", "==", uid));

    const doacoesSnap = await getDocs(doacoesRef);
    const acoesSnap = await getDocs(acoesRef);

    const doacoes = doacoesSnap.docs.map(doc => doc.data());
    const acoes = acoesSnap.docs.map(doc => doc.data());

    const totalSoma = doacoes.reduce((acc, cur) => acc + (cur.Valor || 0), 0);
    const doadoresUnicos = new Set(doacoes.map(d => d.IdDoador)).size;

    const mesAtual = new Date().getMonth();
    const doacoesNoMes = doacoes.filter(d => {
      const data = d.Data?.toDate?.();
      return data?.getMonth?.() === mesAtual;
    }).length;

    const projetosAtivos = acoes.filter(
      a => a.Status === "Ativa" || a.Status === "Em andamento"
    ).length;

    const dadosGrafico = doacoes
      .filter(d => d.Data?.toDate)
      .map(d => ({
        data: d.Data.toDate().toLocaleDateString(),
        valor: d.Valor || 0
      }))
      .sort((a, b) => new Date(a.data) - new Date(b.data));

    setTotal(totalSoma);
    setDoadores(doadoresUnicos);
    setQtdMes(doacoesNoMes);
    setQtdProjetos(projetosAtivos);
    setGraficoDados(dadosGrafico);
  };

  return (
    <>
      <NavbarDoador />
      <div className="pagina-relatorios">
        <h1 className="titulo">Painel de Doações</h1>

        <div className="grid-cards">
          <section className="card-kpi">
            <div className="conteudo-card">
              <div className="card-linha">
                <div className="icone-placeholder">💖</div>
                <div>
                  <p className="legenda">Total Arrecadado</p>
                  <p className="valor">R${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="card-kpi">
            <div className="conteudo-card">
              <div className="card-linha">
                <div className="icone-placeholder">💰</div>
                <div>
                  <p className="legenda">Doações no Mês</p>
                  <p className="valor">{qtdMes}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="card-kpi">
            <div className="conteudo-card">
              <div className="card-linha">
                <div className="icone-placeholder">👥</div>
                <div>
                  <p className="legenda">Doadores Ativos</p>
                  <p className="valor">{doadores}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="card-kpi">
            <div className="conteudo-card">
              <div className="card-linha">
                <div className="icone-placeholder">📊</div>
                <div>
                  <p className="legenda">Projetos em Andamento</p>
                  <p className="valor">{qtdProjetos}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="area-grafico">
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Doações por Data</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graficoDados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" fill="#1a4e80" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
