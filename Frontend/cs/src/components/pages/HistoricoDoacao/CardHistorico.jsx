import "./HistoricoDoacao.css";

function CardHistorico({ nome, data, valor, imagem }) {
  return (
    <div className="cardHistorico">
      <img className="imgHist" src={imagem || "src/assets/ONGS.jpg"} alt="Icone ong" />
      <div className="textoCard">
        <p className="nomeONG">{nome || "ONG"}</p>
        <p className="dataHora">{data || "XX/XX/XXXX"}</p>
      </div>
      <p className="valor">R${valor?.toFixed(2) || "0,00"}</p>
    </div>
  );
}

export default CardHistorico;
