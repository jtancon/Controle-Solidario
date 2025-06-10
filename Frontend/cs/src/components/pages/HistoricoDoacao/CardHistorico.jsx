import "./HistoricoDoacao.css";

// O componente recebe 'nome' e 'imagem' como propriedades (props)
function CardHistorico({ nome, data, valor, imagem }) {
  return (
    <div className="cardHistorico">
      {/* Aqui, ele usa a 'imagem' recebida. Se a imagem não for fornecida, ele usa uma imagem padrão. */}
      <img className="imgHist" src={imagem || "src/assets/ONGS.jpg"} alt="Icone ong" />
      <div className="containerHist">
        <div className="textoCard">
          {/* Aqui, ele exibe o 'nome' recebido. Se o nome não for fornecido, ele exibe "ONG". */}
          <p className="nomeONG">{nome || "ONG"}</p>
          <p className="dataHora">{data || "XX/XX/XXXX"}</p>
        </div>
        <p className="valor">R${valor?.toFixed(2).replace('.', ',') || "0,00"}</p>
      </div>
    </div>
  );
}

export default CardHistorico;
