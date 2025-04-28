import './HistoricoDoacao.css';
import CardHist from './CardHistorico';
import NavBar from '../../Navbar_Footer/NavbarDoador';
import SearchBar from '../../SearchBar/SearchBar';

function HistoricoDoacao() {
  return (
    <>
    <NavBar/>
    <div className="historico">
        <div className="main">
          <h1>Minhas Doações</h1>
            <div className="pesquisa">
              <SearchBar placeholder="Pesquisa por nome ou valor" onChange={() => {}}/>
              <button className="btnFiltro">
                <svg xmlns="http://www.w3.org/2000/svg" width="30px" fill="none" viewBox="0 0 24 24" stroke="#aacbe2" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/>
                </svg>
              </button>
            </div>
            <div className="cardWrapper">
            <div className="cardContainer">
              <CardHist />
              <CardHist />
              <CardHist />
            </div>
          </div> 
        </div>
      </div>
    </>
  );
}

export default HistoricoDoacao