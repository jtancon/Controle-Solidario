import "./AcoesONG.css";

function AcoesONG() {
  return (
    <div className="cardAcoes">
        <h1 className="nomeAcao">Nome da Ação</h1>
        <div className="linhaTexto">
            <strong>Descrição:</strong>
            <p>Sed sit amet mattis ante, et pharetra augue. Phasellus bibendum ipsum odio, sed fermentum erat hendrerit at...</p>
        </div>

        <div className="linhaTexto">
            <strong>Data de Início:</strong>
            <p>01/01/2023</p>
        </div>

        <div className="linhaTexto">
            <strong>Data de Fim:</strong>
            <p>31/12/2023</p>
        </div>

        <div className="linhaTexto">
            <strong>Status:</strong>
            <select className="statusSelect">
            <option value="Planejada">Planejada</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Ativa">Ativa</option>
            <option value="Encerrada">Encerrada</option>
            </select>
        </div>
        <div className="botoesContainer">
            <button className="btnEditar">Editar</button>
            <button className="btnExcluir">Excluir</button>
        </div>
    </div>
  );
}

export default AcoesONG;