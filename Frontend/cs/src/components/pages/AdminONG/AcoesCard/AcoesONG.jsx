import "./AcoesONG.css";

function AcoesONG({titulo, descricao, status, dataInicio, dataFim, }) {
  return (
    <div className="cardAcoes">
        <h1 className="nomeAcao">{titulo || "titulo"}</h1>
        <div className="linhaTexto">
            <strong>Descrição:</strong>
            <p>{descricao || "descrição"}</p>
        </div>

        <div className="linhaTexto">
            <strong>Data de Início:</strong>
            <p>{dataInicio || "XX/XX/XXXX"}</p>
        </div>

        <div className="linhaTexto">
            <strong>Data de Fim:</strong>
            <p>{dataFim || "XX/XX/XXXX"}</p>
        </div>

        <div className="linhaTexto">
            <strong>Status:</strong>
            <select className="statusSelect" value={status} onChange={handleStatusChange}>
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