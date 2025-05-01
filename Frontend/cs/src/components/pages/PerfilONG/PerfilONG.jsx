import { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../context/authGoogle";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseconfig";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "./PerfilONG.css";
import { getAuth, updatePassword } from "firebase/auth";

function PerfilONG() {
  const { user, signOut, deletarConta } = useContext(AuthGoogleContext);
  const [dados, setDados] = useState({});
  const [editando, setEditando] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [forcaSenha, setForcaSenha] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const handleConfirmarDelete = async () => {
    setMostrarConfirmacao(false);
    setEditando(false);
    await deletarConta();
    toast.error("Conta deletada.");
    signOut();
    sessionStorage.clear();
  };

  useEffect(() => {
    if (user) {
      setDados({
        nome: user.nome || "",
        cnpj: user.cnpj || "",
        cep: user.cep || "",
        endereco: user.endereco || "",
        representante: user.representante || "",
        telefone: user.telefone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const formatarCampo = (name, value) => {
    let formatted = value;

    if (name === "cnpj") {
      formatted = value.replace(/\D/g, "").slice(0, 14);
      formatted = formatted.replace(/^(\d{2})(\d)/, "$1.$2");
      formatted = formatted.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      formatted = formatted.replace(/\.(\d{3})(\d)/, ".$1/$2");
      formatted = formatted.replace(/(\d{4})(\d)/, "$1-$2");
    }

    if (name === "cep") {
      formatted = value.replace(/\D/g, "").slice(0, 8);
      formatted = formatted.replace(/^(\d{5})(\d)/, "$1-$2");
    }

    if (name === "telefone") {
      formatted = value.replace(/\D/g, "").slice(0, 11);
      formatted = formatted.replace(/^(\d{2})(\d)/, "($1) $2");
      formatted = formatted.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatarCampo(name, value);
    setDados((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const verificarForcaSenha = (senha) => {
    if (!senha) return "";
    const forte =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const medio = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (forte.test(senha)) return "forte";
    if (medio.test(senha)) return "media";
    return "fraca";
  };

  const validarCampos = () => {
    const { nome, cnpj, cep, endereco, representante, telefone } = dados;
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    const cepRegex = /^\d{5}-\d{3}$/;
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

    if (!nome) return toast.error("Preencha o nome.");
    if (!cnpj) return toast.error("Preencha o CNPJ.");
    if (!cnpjRegex.test(cnpj)) return toast.error("CNPJ inválido.");
    if (!cep) return toast.error("Preencha o CEP.");
    if (!cepRegex.test(cep)) return toast.error("CEP inválido.");
    if (!endereco) return toast.error("Preencha o endereço.");
    if (!representante) return toast.error("Preencha o representante.");
    if (!telefone) return toast.error("Preencha o telefone.");
    if (!telefoneRegex.test(telefone)) return toast.error("Telefone inválido.");

    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    if (senha || confirmarSenha) {
      if (senha !== confirmarSenha) {
        toast.error("As senhas não coincidem.");
        return;
      }

      if (forcaSenha === "fraca") {
        toast.warn("A senha é muito fraca.");
        return;
      }

      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        await updatePassword(currentUser, senha);
        toast.success("Senha atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar senha:", error);
        toast.error("Erro ao atualizar a senha.");
        return;
      }
    }

    try {
      await updateDoc(doc(db, "ongs", user.uid), dados);
      setEditando(false);
      toast.success("Informações atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar os dados.");
    }
  };

  return (
    <div className="PerfilONG">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h1>Perfil da ONG</h1>

      {!editando ? (
        <>
          {Object.entries(dados).map(([chave, valor]) => (
            <div key={chave}>
              <label>{chave.charAt(0).toUpperCase() + chave.slice(1)}</label>
              <p>{valor}</p>
            </div>
          ))}
          <div className="button-group">
            <button
              onClick={() => {
                setEditando(true);
                toast.info("Modo de edição ativado.");
              }}
            >
              Editar
            </button>

            <button onClick={signOut} className="cancel-button">
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <form>
            <label htmlFor="nome">Nome da ONG</label>
            <input
              type="text"
              name="nome"
              value={dados.nome}
              onChange={handleChange}
              placeholder="Ex: Instituto Esperança"
            />

            <label htmlFor="cnpj">CNPJ</label>
            <input
              type="text"
              name="cnpj"
              value={dados.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
            />

            <label htmlFor="cep">CEP</label>
            <input
              type="text"
              name="cep"
              value={dados.cep}
              onChange={handleChange}
              placeholder="00000-000"
            />

            <label htmlFor="endereco">Endereço</label>
            <input
              type="text"
              name="endereco"
              value={dados.endereco}
              onChange={handleChange}
              placeholder="Rua Exemplo, 123 - Bairro"
            />

            <label htmlFor="representante">Representante</label>
            <input
              type="text"
              name="representante"
              value={dados.representante}
              onChange={handleChange}
              placeholder="Nome do responsável legal"
            />

            <label htmlFor="telefone">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={dados.telefone}
              onChange={handleChange}
              placeholder="(11) 91234-5678"
            />

            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              value={dados.email}
              disabled
              style={{ backgroundColor: "#f0f0f0" }}
            />

            <label htmlFor="senha">Nova Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="Nova senha (opcional)"
              value={senha}
              onChange={(e) => {
                const s = e.target.value;
                setSenha(s);
                setForcaSenha(verificarForcaSenha(s));
              }}
            />
            {senha && (
              <p
                style={{
                  color:
                    forcaSenha === "forte"
                      ? "green"
                      : forcaSenha === "media"
                      ? "orange"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                Força da senha: {forcaSenha}
              </p>
            )}

            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              name="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirme a nova senha"
            />
          </form>

          <div className="button-group">
            <button onClick={handleSalvar}>Concluir</button>
            <button
              onClick={() => {
                setEditando(false);
                toast.warn("Edição cancelada.");
              }}
              className="cancel-button"
            >
              Cancelar
            </button>
            <button
              onClick={() => setMostrarConfirmacao(true)}
              className="delete-button"
            >
              Deletar Conta
            </button>
          </div>
        </>
      )}

      {mostrarConfirmacao && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tem certeza que deseja deletar sua conta?</h2>
            <p>Essa ação é irreversível.</p>
            <div className="modal-buttons">
              <button className="confirm" onClick={handleConfirmarDelete}>
                Sim, deletar
              </button>
              <button
                className="cancel"
                onClick={() => setMostrarConfirmacao(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerfilONG;
