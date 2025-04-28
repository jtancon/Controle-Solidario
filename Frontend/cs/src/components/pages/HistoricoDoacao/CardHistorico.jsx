import "./HistoricoDoacao.css";

function CardHistorico() {
  return (
    <div className="cardHistorico">
      <img className="imgHist" src={"src/assets/ONGS.jpg"}  alt="Icone ong"/>
      <div className="textoCard">
        <p className="nomeONG">ONG</p>
        <p className="dataHora">XX/XX/XXXX</p>
      </div>
      <p className="valor">R$100,00</p>
    </div>
  );
}

export default CardHistorico;