import { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../context/authGoogle";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth, updatePassword } from "firebase/auth";
import NavbarDoador from '../../Navbar_Footer/NavbarDoador';
import './PerfilONG.css';

function PerfilONG() {
  const { user, signOut, deletarConta } = useContext(AuthGoogleContext);
  const [dados, setDados] = useState({});
  const [editando, setEditando] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.classificacao === "doador") navigate("/PerfilDoador");
    if (user) {
      setDados({
        nome: user.nome || "",
        cnpj: user.cnpj || "",
        endereco: user.endereco || "",
        telefone: user.telefone || "",
        representante: user.representante || "",
        cep: user.cep || "",
        email: user.email || "",
        fotoPerfil: user.fotoPerfil || "",
        criadoEm: user.criadoEm || "",
        descricao: user.descricao || ""
      });
    }
  }, [user, navigate]);

  const formatarCampo = (name, value) => {
    let formatted = value;
    if (name === "cnpj") formatted = value.replace(/\D/g, "").slice(0,14)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
    if (name === "cep") formatted = value.replace(/\D/g, "").slice(0,8)
      .replace(/^(\d{5})(\d)/, "$1-$2");
    if (name === "telefone") formatted = value.replace(/\D/g, "").slice(0,11)
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
    return formatted;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const val = formatarCampo(name, value);
    setDados(prev => ({ ...prev, [name]: val }));
  };

  const verificarForcaSenha = (senha) => {
    if (!senha) return "";
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[@$!%*?&]/.test(senha);
    const temSequencia =
      /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(
        senha
      );

    const criterios = [
      temMaiuscula,
      temMinuscula,
      temNumero,
      temEspecial,
    ].filter(Boolean).length;

    if (senha.length < 6 || temSequencia || (!temNumero && !temEspecial)) {
      return "fraca";
    }
    if (senha.length >= 6 && criterios >= 2 && !temSequencia) {
      return criterios === 4 ? "forte" : "media";
    }
    return "fraca";
  };

  const validarCampos = () => {
    const { nome, cnpj, endereco, email, telefone, representante, cep } = dados;
    if (!nome) return toast.error("Preencha o nome.");
    if (!cnpj) return toast.error("Preencha o CNPJ.");
    if (!/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/.test(cnpj)) return toast.error("CNPJ inválido.");
    if (!endereco) return toast.error("Preencha o endereço.");
    if (!email) return toast.error("Preencha o email.");
    if (!representante) return toast.error("Preencha o representante.");
    if (!telefone) return toast.error("Preencha o telefone.");
    if (!/\(\d{2}\) \d{5}-\d{4}/.test(telefone)) return toast.error("Telefone inválido.");
    if (!cep) return toast.error("Preencha o CEP.");
    if (!/\d{5}-\d{3}/.test(cep)) return toast.error("CEP inválido.");
    return true;
  };

  const handleSalvar = () => {
    if (!validarCampos()) return;
    setMostrarConfirmacao(true);
  };

  const confirmarEdicao = async () => {
    setMostrarConfirmacao(false);
    if (senha) {
      if (senha !== confirmarSenha) return toast.error("Senhas não coincidem.");
      if (verificarForcaSenha(senha) === "fraca") return toast.warn("Senha muito fraca.");
      try {
        const auth = getAuth();
        await updatePassword(auth.currentUser, senha);
        toast.success("Senha atualizada!");
      } catch {
        return toast.error("Erro na atualização.");
      }
    }
    try {
      await updateDoc(doc(db, 'usuarios', user.uid), dados);
      toast.success('Atualizado!');
      setEditando(false);
    } catch {
      toast.error('Falha ao atualizar.');
    }
  };

  const handleConfirmarDelete = async () => {
    setMostrarConfirmacao(false);
    setEditando(false);
    await deleteDoc(doc(db, "usuarios", uid));
    toast.error('Conta deletada.');
    signOut();
    sessionStorage.clear();
  };

  return (
    <>
      <NavbarDoador />
      <div className="PerfilONG">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="perfil-left">
          {dados.fotoPerfil && <img src={dados.fotoPerfil} alt="Foto ONG" className="foto-perfil" />}
          <h3>{dados.nome}</h3>
          <label className="botao-foto-perfil">
            <input type="file" accept="image/*" onChange={() => { }} />
            Trocar foto
          </label>
          <p className="data-criacao">Perfil criado em {dados.criadoEm}</p>
        </div>

        <div className="perfil-right">
          <h2>{editando ? 'Editar Perfil' : 'Perfil da ONG'}</h2>
          {!editando ? (
            <div className="perfil-visualizacao">
              {['nome', 'cnpj', 'endereco', 'telefone', 'representante', 'cep', 'email', 'descricao'].map(key => (
                <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {dados[key]}</p>
              ))}
              <div className="botao-atualizar-wrapper">
                <button onClick={() => setEditando(true)} className="botao-atualizar">Editar Perfil</button>
                <button onClick={signOut} className="cancel-button">Logout</button>
              </div>
            </div>
          ) : (
            <form className="perfil-editar-form">
              <div className="coluna-esquerda">
                <label>Nome</label><input name="nome" value={dados.nome} onChange={handleChange} />
                <label>CNPJ</label><input name="cnpj" value={dados.cnpj} onChange={handleChange} />
                <label>Endereço</label><input name="endereco" value={dados.endereco} onChange={handleChange} />
                <label>Nova Senha</label><input type="password" name="senha" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Opcional" />
                <label>Email</label><input type="email" name="email" value={dados.email} disabled />
              </div>
              <div className="coluna-direita">
                <label>Representante</label><input name="representante" value={dados.representante} onChange={handleChange} />
                <label>Telefone</label><input name="telefone" value={dados.telefone} onChange={handleChange} />
                <label>CEP</label><input name="cep" value={dados.cep} onChange={handleChange} />
                <label>Confirme Senha</label><input type="password" name="confirmarSenha" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} placeholder="Confirme a senha" />
                <label>Descrição</label><textarea name="descricao" value={dados.descricao} onChange={handleChange} rows="4" />
              </div>
              <div className="botao-atualizar-wrapper">
                <button type="button" onClick={handleSalvar} className="botao-atualizar">Salvar</button>
                <button type="button" onClick={() => { setEditando(false); toast.warn('Cancelado'); }} className="cancel-button">Cancelar</button>
                <button type="button" onClick={() => setMostrarConfirmacao(true)} className="delete-button">Deletar Conta</button>
              </div>
            </form>
          )}
        </div>

        {mostrarConfirmacao && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirmar alterações?</h2>
              <p>Deseja prosseguir?</p>
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

export default PerfilONG;
