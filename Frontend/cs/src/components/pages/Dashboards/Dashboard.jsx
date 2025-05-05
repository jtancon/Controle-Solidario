import "./Dashboard.css";
import { useContext } from 'react';
import { AuthGoogleContext } from '../../../context/authGoogle';

const Dashboard = () => {

  const { signOut } = useContext(AuthGoogleContext);
  
  return (
    <div className="pagina-relatorios">

    <button className='Deslogar' onClick={() => {signOut()}}>Deslogar</button>
      <h1 className="titulo">Painel de Doações</h1>

      {/* Cards de KPIs */}
      <div className="grid-cards">
        <section className="card-kpi">
          <div className="conteudo-card">
            <div className="card-linha">
              <div className="icone-placeholder">💖</div>
              <div>
                <p className="legenda">Total Arrecadado</p>
                <p className="valor">R$82.340,00</p>
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
                <p className="valor">128</p>
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
                <p className="valor">87</p>
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
                <p className="valor">5</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Espaço reservado para gráficos e tabelas futuros */}
      <div className="area-grafico">
        <section className="grafico-placeholder">
          Gráficos e análises sobre doações virão aqui em breve...
        </section>
      </div>
    </div>
  );
};

export default Dashboard;