import { doc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../../../services/firebaseconfig";
import "./EscolherClassificacao.css";

function EscolherClassificacao({ userId, onClassificacaoEscolhida }) {
  const handleEscolha = async (tipo) => {
    const atualizacao = {
      classificacao: tipo,
    };

    if (tipo === "doador") {
      atualizacao["cnpj"] = deleteField();
      atualizacao["cep"] = deleteField();
      atualizacao["endereco"] = deleteField();
      atualizacao["representante"] = deleteField();
      atualizacao["nome"] = deleteField();
    } else if (tipo === "ONG") {
      atualizacao["cpf"] = deleteField();
      atualizacao["usuario"] = deleteField();
      atualizacao["NomeCompleto"] = deleteField();
    }

    await updateDoc(doc(db, "usuarios", userId), atualizacao);
    onClassificacaoEscolhida(tipo);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Você deseja...</h2>
        <button onClick={() => handleEscolha("doador")}>Ser um doador</button>
        <button onClick={() => handleEscolha("ONG")}>Cadastrar uma ONG</button>
      </div>
    </div>
  );
}

export default EscolherClassificacao;
