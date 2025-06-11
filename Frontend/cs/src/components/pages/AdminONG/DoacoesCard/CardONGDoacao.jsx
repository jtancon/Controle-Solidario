import "./CardONGDoacao.css";

function CardONGDoacao() {
  return (
    <div className="cardHistorico">
        <div className="textoCard">
          <p className="nomeDoador">Doador</p>
          <p className="dataHora">XX/XX/XXXX</p>
        </div>
        <p className="valor">R$0,00</p>
    </div>
  );
}

export default CardONGDoacao;