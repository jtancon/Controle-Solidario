import "./CardONGDoacao.css";

function CardONGDoacao({nome, data, valor}) {
  return (
    <div className="cardHistoricoONG">
        <div className="textoCard">
          <p className="nomeDoador">{nome || "Doador"}</p>
          <p className="dataHora">{data || "XX/XX/XXXX"}</p>
        </div>
        <p className="valor">{valor || "R$0,00"}</p>
    </div>
  );
}

export default CardONGDoacao;