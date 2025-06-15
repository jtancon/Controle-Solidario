import "./Dashboard.css";
import NavbarONG from "../../Navbar_Footer/NavbarONG";
import Footer from "../../Navbar_Footer/Footer";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import api from "../../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

const Dashboard = () => {
  const [total, setTotal] = useState(0);
  const [doadores, setDoadores] = useState(0);
  const [qtdProjetos, setQtdProjetos] = useState(0);
  const [graficoBarra, setGraficoBarra] = useState([]);
  const [graficoLinha, setGraficoLinha] = useState([]);
  const [graficoPizza, setGraficoPizza] = useState([]);

  const [anoFiltro, setAnoFiltro] = useState(new Date().getFullYear());
  const [mesFiltro, setMesFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [valorMin, setValorMin] = useState("");
  const [valorMax, setValorMax] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) await carregarDados(user.uid);
    });
    return () => unsubscribe();
  }, [anoFiltro, mesFiltro, tipoFiltro, valorMin, valorMax]);

  const carregarDados = async (uid) => {
    try {
      const doacoesRes = await api.get(`/doacoes/ong/${uid}`);
      const acoesRes = await api.get(`/acoes/ong/${uid}`);

      const doacoes = doacoesRes.data;

      const doacoesFiltradas = doacoes.filter(d => {
        const data = d?.data?.seconds ? new Date(d.data.seconds * 1000) : new Date(d.data);
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const tipo = d.tipo || "";
        const valor = d.valor || 0;

        return (
          ano === parseInt(anoFiltro) &&
          (!mesFiltro || mes === parseInt(mesFiltro)) &&
          (!tipoFiltro || tipo === tipoFiltro) &&
          (!valorMin || valor >= parseFloat(valorMin)) &&
          (!valorMax || valor <= parseFloat(valorMax))
        );
      });

      const totalSoma = doacoesFiltradas.reduce((acc, cur) => acc + (cur.valor || 0), 0);
      const doadoresUnicos = new Set(doacoesFiltradas.map(d => d.idDoador)).size;

      const porMes = Array.from({ length: 12 }, (_, i) => {
        const mes = i + 1;
        const valorMes = doacoesFiltradas
          .filter(d => {
            const data = d?.data?.seconds ? new Date(d.data.seconds * 1000) : new Date(d.data);
            return data.getMonth() + 1 === mes;
          })
          .reduce((acc, cur) => acc + (cur.valor || 0), 0);
        return { mes: mes.toString().padStart(2, "0"), valor: valorMes };
      });

      const tipoContagem = {};
      doacoesFiltradas.forEach(d => {
        const tipo = d.tipo || "Outro";
        tipoContagem[tipo] = (tipoContagem[tipo] || 0) + (d.valor || 0);
      });

      setTotal(totalSoma);
      setDoadores(doadoresUnicos);
      setQtdProjetos(acoesRes.data.length);
      setGraficoBarra(porMes);
      setGraficoLinha(porMes);
      setGraficoPizza(Object.entries(tipoContagem).map(([nome, valor]) => ({ nome, valor })));
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    }
  };

  return (
    <>
      <NavbarONG />
      <div className="pagina-relatorios fade-in">
        <div className="titulo">Painel da ONG</div>

        <div className="filtros-avancados">
          <div>
            <label>Ano:</label>
            <select value={anoFiltro} onChange={(e) => setAnoFiltro(e.target.value)}>
              {[2023, 2024, 2025].map(ano => <option key={ano}>{ano}</option>)}
            </select>
          </div>
          <div>
            <label>Mês:</label>
            <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
              <option value="">Todos</option>
              {[...Array(12)].map((_, i) => {
                const m = (i + 1).toString().padStart(2, "0");
                return <option key={m} value={m}>{m}</option>;
              })}
            </select>
          </div>
          <div>
            <label>Tipo:</label>
            <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
              <option value="">Todos</option>
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
              <option value="Boleto">Boleto</option>
            </select>
          </div>
          <div>
            <label>Valor mín.:</label>
            <input type="number" value={valorMin} onChange={(e) => setValorMin(e.target.value)} />
          </div>
          <div>
            <label>Valor máx.:</label>
            <input type="number" value={valorMax} onChange={(e) => setValorMax(e.target.value)} />
          </div>
        </div>

        <div className="grid-cards fade-in">
          <div className="card-kpi">
            <div className="conteudo-card">
              <div className="icone">💰</div>
              <div>
                <div className="legenda">Total Recebido</div>
                <div className="valor">R$ {total.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="card-kpi">
            <div className="conteudo-card">
              <div className="icone">👥</div>
              <div>
                <div className="legenda">Doadores</div>
                <div className="valor">{doadores}</div>
              </div>
            </div>
          </div>
          <div className="card-kpi">
            <div className="conteudo-card">
              <div className="icone">📌</div>
              <div>
                <div className="legenda">Projetos</div>
                <div className="valor">{qtdProjetos}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="area-grafico fade-in">
          <div className="grafico-placeholder">
            <h4>Doações Mensais</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={graficoBarra}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grafico-placeholder">
            <h4>Evolução Mensal</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={graficoLinha}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grafico-placeholder">
            <h4>Distribuição por Tipo</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={graficoPizza} dataKey="valor" nameKey="nome" outerRadius={80}>
                  {graficoPizza.map((_, index) => (
                    <Cell key={index} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
