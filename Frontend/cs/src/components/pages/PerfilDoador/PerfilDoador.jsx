// PerfilDoador.jsx atualizado com campos redistribuídos igualmente entre colunas
import { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../context/authGoogle";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../services/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth, updatePassword } from "firebase/auth";
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import CS from "../../../assets/CS.jpg";
import "./PerfilDoador.css";

function PerfilDoador() {
  const { user, signOut, deletarConta } = useContext(AuthGoogleContext);
  const [dados, setDados] = useState({});
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [forcaSenha, setForcaSenha] = useState("");
  const [editando, setEditando] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [camposEditaveis, setCamposEditaveis] = useState({ email: false, nomeCompleto: false, cpf: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.classificacao === "ong") navigate("/PerfilONG");
    if (user) {
      const campos = {
        email: !user.email,
        nomeCompleto: !user.nomeCompleto,
        cpf: !user.cpf,
      };
      setCamposEditaveis(campos);
      setDados({
        nomeCompleto: user.nomeCompleto || "",
        nomeUsuario: user.nomeUsuario || "",
        email: user.email || "",
        cpf: user.cpf || "",
        telefone: user.telefone || "",
        fotoPerfil: user.fotoPerfil || CS,
        endereco: user.endereco || "",
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
    const forte = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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

  const handleSalvar = () => {
    if (!validarCampos()) return;
    setMostrarConfirmacao(true);
  };

  const confirmarEdicao = async () => {
    setMostrarConfirmacao(false);
    if (senha.trim() !== "" || confirmarSenha.trim() !== "") {
      if (senha !== confirmarSenha) return toast.error("As senhas não coincidem.");
      if (forcaSenha === "fraca") return toast.warn("A senha é muito fraca.");
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
      toast.success("Informações atualizadas com sucesso!");
      setEditando(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar os dados.");
    }
  };

  return (
    <>
      <NavbarDoador />
      <div className="PerfilDoador">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="perfil-left">
          {dados.fotoPerfil && (
            <div className="foto-perfil-container">
              <img src={dados.fotoPerfil} alt="Foto de Perfil" className="foto-perfil" />
              <label className="file-label botao-foto-perfil">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const storageRef = ref(storage, `fotosPerfil/${user.uid}`);
                      try {
                        await uploadBytes(storageRef, file);
                        const url = await getDownloadURL(storageRef);
                        setDados((prev) => ({ ...prev, fotoPerfil: url }));
                        toast.success("Foto de perfil atualizada!");
                      } catch (error) {
                        console.error("Erro ao enviar imagem:", error);
                        toast.error("Erro ao fazer upload da imagem.");
                      }
                    }
                  }}
                />
                Trocar foto de perfil
              </label>
              <p className="data-criacao">Perfil criado em 27/04/2020</p>
            </div>
          )}
        </div>

        <div className="perfil-right">
          <h2>{editando ? "Editar Perfil" : "Perfil"}</h2>
          {!editando ? (
            <div className="perfil-visualizacao">
              <p><strong>Nome completo:</strong> {dados.nomeCompleto}</p>
              <p><strong>Nome de usuário:</strong> {dados.nomeUsuario}</p>
              <p><strong>Email:</strong> {dados.email}</p>
              <p><strong>Telefone:</strong> {dados.telefone}</p>
              <p><strong>Endereço:</strong> {dados.endereco}</p>
              <p><strong>CPF:</strong> {dados.cpf}</p>
              <div className="botao-atualizar-wrapper">
                <button onClick={() => setEditando(true)} className="botao-atualizar">Editar Perfil</button>
                <button onClick={signOut} className="cancel-button">Logout</button>
              </div>
            </div>
          ) : (
            <form className="perfil-editar-form">
              <div className="coluna-esquerda">
                <label>Nome completo</label>
                <input type="text" name="nomeCompleto" value={dados.nomeCompleto} onChange={handleChange} disabled={!camposEditaveis.nomeCompleto} />
                <label>Email</label>
                <input type="email" name="email" value={dados.email} onChange={handleChange} disabled={!camposEditaveis.email} />
                <label>CPF</label>
                <input type="text" name="cpf" value={dados.cpf} onChange={handleChange} disabled={!camposEditaveis.cpf} />
                <label>Nova senha</label>
                <input type="password" name="senha" value={senha} placeholder="Nova senha (opcional)" onChange={(e) => { const s = e.target.value; setSenha(s); setForcaSenha(verificarForcaSenha(s)); }} />
                {senha && <p style={{ color: forcaSenha === "forte" ? "green" : forcaSenha === "media" ? "orange" : "red", fontWeight: "bold" }}>Força da senha: {forcaSenha}</p>}
              </div>
              <div className="coluna-direita">
                <label>Nome de usuário</label>
                <input type="text" name="nomeUsuario" value={dados.nomeUsuario} onChange={handleChange} />
                <label>Telefone</label>
                <input type="text" name="telefone" value={dados.telefone} onChange={handleChange} />
                <label>Endereço</label>
                <input type="text" name="endereco" value={dados.endereco} onChange={handleChange} />
                <label>Confirmar senha</label>
                <input type="password" name="confirmarSenha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Confirme a nova senha" />
              </div>
              <div className="botao-atualizar-wrapper">
                <button type="button" className="botao-atualizar" onClick={handleSalvar}>Salvar</button>
                <button type="button" className="cancel-button" onClick={() => { setEditando(false); toast.warn("Edição cancelada."); }}>Cancelar</button>
              </div>
            </form>
          )}
        </div>

        {mostrarConfirmacao && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirmar alterações?</h2>
              <p>Deseja realmente salvar as mudanças realizadas no perfil?</p>
              <div className="modal-buttons">
                <button className="confirm" onClick={confirmarEdicao}>Confirmar</button>
                <button className="cancel" onClick={() => setMostrarConfirmacao(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PerfilDoador;
