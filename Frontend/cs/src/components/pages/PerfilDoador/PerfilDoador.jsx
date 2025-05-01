import { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../context/authGoogle";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth, updatePassword } from "firebase/auth";
import "./PerfilDoador.css";

function PerfilDoador() {
  const { user, signOut, deletarConta } = useContext(AuthGoogleContext);
  const [dados, setDados] = useState({});
  const [editando, setEditando] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [forcaSenha, setForcaSenha] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const navigate = useNavigate();

  const handleConfirmarDelete = async () => {
    setMostrarConfirmacao(false);
    setEditando(false);
    await deletarConta();
    toast.error("Conta deletada.");
    signOut();
    sessionStorage.clear();
  };

  useEffect(() => {
    if (user && user.classificacao === "ong") {
      navigate("/PerfilONG");
    }
    if (user) {
      setDados({
        nomeCompleto: user.nomeCompleto || "",
        nomeUsuario: user.nomeUsuario || "",
        email: user.email || "",
        cpf: user.cpf || "",
        telefone: user.telefone || "",
      });
    }
  }, [user, navigate]);

  const formatarCampo = (name, value) => {
    let formatted = value;

    if (name === "cpf") {
      formatted = value.replace(/\D/g, "").slice(0, 11);
      formatted = formatted.replace(/(\d{3})(\d)/, "$1.$2");
      formatted = formatted.replace(/(\d{3})(\d)/, "$1.$2");
      formatted = formatted.replace(/(\d{3})(\d{2})$/, "$1-$2");
    }

    if (name === "telefone") {
      formatted = value.replace(/\D/g, "").slice(0, 11);
      formatted = formatted.replace(/(\d{2})(\d)/, "($1) $2");
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
    const { nomeCompleto, nomeUsuario, telefone, cpf } = dados;
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    if (!nomeCompleto) return toast.error("Preencha o nome completo.");
    if (!nomeUsuario) return toast.error("Preencha o nome de usuário.");
    if (!telefone) return toast.error("Preencha o telefone.");
    if (!telefoneRegex.test(telefone)) return toast.error("Telefone inválido.");
    if (!cpf) return toast.error("Preencha o CPF.");
    if (!cpfRegex.test(cpf)) return toast.error("CPF inválido.");

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
      await updateDoc(doc(db, "usuarios", user.uid), dados);
      setEditando(false);
      toast.success("Informações atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar os dados.");
    }
  };

  return (
    <div className="PerfilONG">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Perfil do Doador</h1>

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
            <label>Nome Completo</label>
            <input
              type="text"
              name="nomeCompleto"
              value={dados.nomeCompleto}
              onChange={handleChange}
            />

            <label>Nome de Usuário</label>
            <input
              type="text"
              name="nomeUsuario"
              value={dados.nomeUsuario}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={dados.email}
              disabled
              style={{ backgroundColor: "#f0f0f0" }}
            />

            <label>CPF:</label>
            <input
              type="text"
              value={dados.cpf}
              onChange={handleChange}
              name="cpf"
              placeholder="000.000.000-00"
              disabled={user?.cpf}
            />

            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              value={dados.telefone}
              onChange={handleChange}
            />

            <label>Nova Senha</label>
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

            <label>Confirmar Senha</label>
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

export default PerfilDoador;
