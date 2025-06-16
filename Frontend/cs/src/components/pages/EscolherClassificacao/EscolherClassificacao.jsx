import { doc, updateDoc, deleteField } from "firebase/firestore";
// ✅ CORREÇÃO: Usando os caminhos que funcionaram anteriormente no seu projeto.
import { db } from "../../../services/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./EscolherClassificacao.css";

function EscolherClassificacao({ userId, onClassificacaoEscolhida }) {
  const navigate = useNavigate();

  const handleEscolha = async (tipo) => {
    // ✅ VALIDAÇÃO: Verifica se o ID do utilizador foi fornecido e é um UID válido.
    // O UID do Firebase não deve conter '@'.
    if (!userId || typeof userId !== 'string' || userId.includes('@')) {
      console.error(
        "Erro Crítico: O 'userId' fornecido é inválido ou é um email. É esperado o UID do utilizador.",
        `Valor recebido: ${userId}`
      );
      toast.error("Ocorreu um erro de identificação. Por favor, tente novamente.");
      return;
    }

    // Objeto para conter os campos a serem atualizados
    const atualizacao = {
      classificacao: tipo,
    };

    // Lógica para remover campos específicos baseada na escolha do tipo
    if (tipo === "doador") {
      // Se for um doador, removemos os campos específicos de ONG
      Object.assign(atualizacao, {
        cnpj: deleteField(),
        representante: deleteField(),
        // 'nome' (fantasia) é de ONG
        nome: deleteField(),
      });
    } else if (tipo === "ONG") {
      // Se for uma ONG, removemos os campos específicos de doador
      Object.assign(atualizacao, {
        cpf: deleteField(),
        nomeCompleto: deleteField(),
        usuario: deleteField(), // Assumindo 'usuario' é um campo que você quer remover
        nomeUsuario: deleteField(),
      });
    }

    try {
      // Atualiza o documento do utilizador no Firestore usando o UID
      await updateDoc(doc(db, "usuarios", userId), atualizacao);

      // Chama a função do componente pai para atualizar o estado
      onClassificacaoEscolhida(tipo);

      // ✅ MELHORIA: Navega para a página de finalização do cadastro correta.
      // Certifique-se de que as suas rotas correspondem a estes caminhos.
      if (tipo === "doador") {
        toast.info("A redirecionar para o cadastro de doador...");
        navigate("/cadastro-doador");
      } else if (tipo === "ONG") {
        toast.info("A redirecionar para o cadastro de ONG...");
        navigate("/cadastro-ong");
      }
    } catch (error) {
      console.error("Erro ao atualizar a classificação do utilizador:", error);
      toast.error("Não foi possível salvar a sua escolha. Tente novamente.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Para começar, escolha o seu tipo de perfil:</h2>
        <div className="botoes-escolha">
          <button onClick={() => handleEscolha("doador")}>
            Quero ser um Doador
          </button>
          <button onClick={() => handleEscolha("ONG")}>
            Quero cadastrar uma ONG
          </button>
        </div>
      </div>
    </div>
  );
}

export default EscolherClassificacao;