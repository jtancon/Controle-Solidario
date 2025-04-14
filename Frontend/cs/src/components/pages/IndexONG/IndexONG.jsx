import './indexONG.css';


const IndexONG = () => {
  return (
    <div className="ong-container">
      <main className="main-content">
        <section className="header-box">
          <h1>Página Central da ONG</h1>
          <p>Bem-vindo! Escolha uma das opções abaixo:</p>
        </section>

        <section className="card-grid">
          <a href="/relatorios" className="card">
            <h2>
              Relatórios
              <br />e<br />
              Gráficos
            </h2>
          </a>
          <a href="/cadastro" className="card">
            <h2>
              Cadastro
              <br />
              Colaboradores
              <br />e<br />
              Beneficiários
            </h2>
          </a>
          <a href="/registros" className="card">
            <h2>
              Registros
              <br />
              Entrada/Saída
            </h2>
          </a>
        </section>
      </main>
    </div>
  );
};

export default IndexONG;
