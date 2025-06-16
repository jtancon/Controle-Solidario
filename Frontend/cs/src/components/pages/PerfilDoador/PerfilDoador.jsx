import { useContext, useState, useEffect } from "react";
// ✅ Usando os caminhos de importação que você confirmou que funcionam
import { AuthGoogleContext } from "../../../context/authGoogle";
import { storage } from "../../../services/firebaseconfig";
import api from "../../../services/api";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getAuth, updatePassword, deleteUser } from "firebase/auth";
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import CS from "../../../assets/CS.jpg";
import "./PerfilDoador.css";

function PerfilDoador() {
  // ✅ CORREÇÃO: Removido o 'setUser' do contexto, pois ele não é fornecido.
  const { user, signOut, deletarConta } = useContext(AuthGoogleContext);
  const [dados, setDados] = useState({});
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [forcaSenha, setForcaSenha] = useState("");
  const [editando, setEditando] = useState(false);
  const [mostrarConfirmacaoEdicao, setMostrarConfirmacaoEdicao] = useState(false);
  const [mostrarConfirmacaoDelete, setMostrarConfirmacaoDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setDados({
        nomeCompleto: user.nomeCompleto || "",
        nomeUsuario: user.nomeUsuario || "",
        email: user.email || "",
        cpf: user.cpf || "",
        telefone: user.telefone || "",
        fotoPerfil: user.fotoPerfil || CS,
        endereco: user.endereco || "",
        criadoEm: user.criadoEm?.seconds ? new Date(user.criadoEm.seconds * 1000).toLocaleDateString() : 'Não disponível',
      });
    }
  }, [user]);

  const formatarCampo = (name, value) => {
    let formatted = value;
    if (name === "cpf") {
      formatted = value.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{2})$/, "$1-$2");
    }
    if (name === "telefone") {
      formatted = value.replace(/\D/g, "").slice(0, 11).replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
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
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[@$!%*?&#]/.test(senha);
    if (senha.length < 6) return "fraca";
    const criterios = [temMaiuscula, temMinuscula, temNumero, temEspecial].filter(Boolean).length;
    if (criterios >= 3) return "forte";
    if (criterios >= 2) return "media";
    return "fraca";
  };
  
  const confirmarEdicao = async () => {
    setMostrarConfirmacaoEdicao(false);
    
    if (senha) {
      if (senha !== confirmarSenha) return toast.error("As senhas não coincidem.");
      if (verificarForcaSenha(senha) === "fraca") return toast.warn("A senha é muito fraca.");
      
      try {
        const auth = getAuth();
        await updatePassword(auth.currentUser, senha);
        toast.success("Senha atualizada com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar a senha. Tente fazer logout e login novamente.");
        return;
      }
    }

    try {
      const dadosParaAtualizar = {
          nomeCompleto: dados.nomeCompleto,
          nomeUsuario: dados.nomeUsuario,
          telefone: dados.telefone,
          endereco: dados.endereco,
          fotoPerfil: dados.fotoPerfil,
      };
      
      await api.put(`/usuarios/${user.uid}`, dadosParaAtualizar);
      
      // ✅ CORREÇÃO: A linha que causava o erro foi removida.
      // A atualização do ecrã agora depende apenas do estado local 'dados',
      // que já foi atualizado pela função handleChange.
      
      toast.success("Informações atualizadas com sucesso!");
      setEditando(false); // Volta para o modo de visualização, que irá ler o estado 'dados' atualizado.
    } catch (error) {
      console.error("Erro ao atualizar os dados do perfil:", error.response || error);
      toast.error("Erro ao atualizar os dados do perfil.");
    }
  };

  const handleConfirmarDelete = async () => {
    setMostrarConfirmacaoDelete(false);
    try {
        // Assume que a função deletarConta do contexto já faz todo o processo
        await deletarConta();
        toast.success("Conta apagada com sucesso.");
        navigate("/login");
    } catch(error) {
        console.error("Erro ao apagar a conta:", error);
        toast.error("Ocorreu um erro ao apagar a sua conta.");
    }
  };

  const handleUploadImagem = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      const storageRef = ref(storage, `fotosPerfil/${user.uid}`);
      try {
        toast.info("A fazer upload da imagem...");
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setDados((prev) => ({ ...prev, fotoPerfil: url }));
        toast.success("Foto de perfil carregada! Clique em Salvar para confirmar a alteração.");
      } catch (error) {
        console.error("Erro ao enviar imagem:", error);
        toast.error("Erro ao fazer upload da imagem.");
      }
    }
  };
  
  if (!user) return <div>A carregar...</div>;

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
                <input type="file" accept="image/*" onChange={handleUploadImagem} />
                Trocar foto de perfil
              </label>
              <p className="data-criacao">Perfil criado em: {dados.criadoEm}</p>
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
            <form className="perfil-editar-form" onSubmit={(e) => e.preventDefault()}>
              <div className="coluna-esquerda">
                <label>Nome completo</label>
                <input type="text" name="nomeCompleto" value={dados.nomeCompleto} onChange={handleChange} />
                <label>Email</label>
                <input type="email" name="email" value={dados.email} disabled />
                <label>CPF</label>
                <input type="text" name="cpf" value={dados.cpf} disabled />
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
                <button type="button" className="botao-atualizar" onClick={() => setMostrarConfirmacaoEdicao(true)}>Salvar</button>
                <button type="button" className="cancel-button" onClick={() => { setEditando(false); toast.warn("Edição cancelada."); }}>Cancelar</button>
                <button type="button" onClick={() => setMostrarConfirmacaoDelete(true)} className="delete-button">Deletar Conta</button>
              </div>
            </form>
          )}
        </div>

        {mostrarConfirmacaoEdicao && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirmar alterações?</h2>
              <p>Deseja prosseguir e salvar as informações?</p>
              <div className="modal-buttons">
                <button className="atualizar-confirm" onClick={confirmarEdicao}>Confirmar</button>
                <button className="cancel-confirm" onClick={() => setMostrarConfirmacaoEdicao(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {mostrarConfirmacaoDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Atenção!</h2>
              <p>Você está prestes a <strong>apagar a sua conta</strong>. <br />Essa ação é <strong>irreversível</strong>. <br />Deseja continuar?</p>
              <div className="modal-buttons">
                <button className="delete-confirm" onClick={handleConfirmarDelete}>Apagar Conta</button>
                <button className="cancel-confirm" onClick={() => setMostrarConfirmacaoDelete(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PerfilDoador;
