import "./CadastroONG.css";
import { useState, useContext } from "react";
import { AuthGoogleContext } from "../../../context/authGoogle";
import { db } from "../../../services/firebaseconfig";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CS from "../../../assets/CS.jpg";
import errorMessages from "../../../constants/errorMessages.js";
import InputError from "../../Erros/InputError.jsx";
import MensagemErro from "../../Erros/MensagemErro.jsx";

function CadastroONG() {
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    cep: "",
    endereco: "",
    representante: "",
    telefone: "",
    email: "",
    senha: "",
  });

  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [forcaSenha, setForcaSenha] = useState("");

  const { signUpOng } = useContext(AuthGoogleContext);
  const navigate = useNavigate();
  const auth = getAuth();

  const [inputErrors, setInputErrors] = useState({});
  const [mensagemErroGeral, setMensagemErroGeral] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cnpj") {
      formattedValue = value.replace(/\D/g, "").slice(0, 14);
      formattedValue = formattedValue.replace(/^(\d{2})(\d)/, "$1.$2");
      formattedValue = formattedValue.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      formattedValue = formattedValue.replace(/\.(\d{3})(\d)/, ".$1/$2");
      formattedValue = formattedValue.replace(/(\d{4})(\d)/, "$1-$2");
    }

    if (name === "cep") {
      formattedValue = value.replace(/\D/g, "").slice(0, 8);
      formattedValue = formattedValue.replace(/^(\d{5})(\d)/, "$1-$2");
    }

    if (name === "telefone") {
      formattedValue = value.replace(/\D/g, "").slice(0, 11);
      formattedValue = formattedValue.replace(/^(\d{2})(\d)/, "($1) $2");
      formattedValue = formattedValue.replace(/(\d{5})(\d)/, "$1-$2");
    }
    setForm({ ...form, [name]: formattedValue });

    if (inputErrors[name]) {
      setInputErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const verificarForcaSenha = (senha) => {
    if (!senha) return "";
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[@$!%*?&#]/.test(senha);
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

  const verificarEmailExistente = async (email) => {
    const q = query(collection(db, "usuarios"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const validarCampos = async () => {
    const errors = {};
    setMensagemErroGeral(""); // Limpa erro geral anterior

    const { nome, cnpj, cep, endereco, representante, telefone, email, senha } =
      form;

    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    const cepRegex = /^\d{5}-\d{3}$/;
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nome) errors.nome = errorMessages.camposObrigatorios;
    if (!cnpj) errors.cnpj = errorMessages.camposObrigatorios;
    if (!cep) errors.cep = errorMessages.camposObrigatorios;
    if (!endereco) errors.endereco = errorMessages.camposObrigatorios;
    if (!representante) errors.representante = errorMessages.camposObrigatorios;
    if (!telefone) errors.telefone = errorMessages.camposObrigatorios;
    if (!email) errors.email = errorMessages.camposObrigatorios;
    if (!senha) errors.senha = errorMessages.camposObrigatorios;
    if (!confirmarSenha) errors.confirmarSenha = errorMessages.camposObrigatorios;

    if (senha && confirmarSenha && senha !== confirmarSenha) {
      errors.confirmarSenha = errorMessages.senhaNaoConfere;
    }

    if (senha && verificarForcaSenha(senha) === "fraca") {
      errors.senha = "A senha é muito fraca.";
    }

    if (!cnpjRegex.test(cnpj)) errors.cnpj = errorMessages.cnpjInvalido;
    if (!cepRegex.test(cep)) errors.cep = errorMessages.cepInvalido;
    if (!telefoneRegex.test(telefone))
      errors.telefone = errorMessages.telefoneInvalido;
    if (!emailRegex.test(email)) errors.email = errorMessages.emailInvalido;

    if (await verificarEmailExistente(email)) {
      setMensagemErroGeral(errorMessages.emailJaCadastrado);
      setInputErrors(errors);
      return false;
    }

    if (senha.length < 6) {
      toast.error("A senha deve conter no mínimo 6 caracteres.");
      setInputErrors(errors);
      return false;
    }

    if (senha !== confirmarSenha) {
      toast.error(errorMessages.senhaNaoConfere);
      setInputErrors(errors);
      return false;
    }

    if (verificarForcaSenha(senha) === "fraca") {
      toast.error("A senha é muito fraca.");
      setInputErrors(errors);
      return false;
    }

    setInputErrors({});
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validarCampos())) return;

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.senha
      );
      const uid = user.uid;

      const ongData = {
        nome: form.nome,
        cnpj: form.cnpj,
        cep: form.cep,
        endereco: form.endereco,
        representante: form.representante,
        telefone: form.telefone,
        email: form.email,
        fotoPerfil: CS,
        classificacao: "ONG",
        descricao: "" //VERIFICA ISSO SE TA QUEBRANDO OU NÃO JOAOZITO
      };

      await setDoc(doc(db, "usuarios", uid), ongData);
      signUpOng(ongData, uid);
      toast.success("ONG cadastrada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar ONG:", error);
      setMensagemErroGeral(errorMessages.erroCadastro);
    }
  };

  return (
    <div className="CadastroONG">
      <ToastContainer
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
      <h1>Cadastro de ONG</h1>
      {mensagemErroGeral && <MensagemErro message={mensagemErroGeral} />}
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome da ONG</label>
        <input
          type="text"
          id="nome"
          name="nome"
          placeholder="Ex: Instituto Esperança"
          value={form.nome}
          onChange={handleChange}
        />
        {inputErrors.nome && <InputError message={inputErrors.nome} />}

        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="contato@ong.org"
          value={form.email}
          onChange={handleChange}
        />
        {inputErrors.email && <InputError message={inputErrors.email} />}

        <label htmlFor="cnpj">CNPJ</label>
        <input
          type="text"
          id="cnpj"
          name="cnpj"
          placeholder="00.000.000/0000-00"
          value={form.cnpj}
          onChange={handleChange}
        />
        {inputErrors.cnpj && <InputError message={inputErrors.cnpj} />}

        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          name="cep"
          placeholder="00000-000"
          value={form.cep}
          onChange={handleChange}
        />
        {inputErrors.cep && <InputError message={inputErrors.cep} />}

        <label htmlFor="endereco">Endereço</label>
        <input
          type="text"
          id="endereco"
          name="endereco"
          placeholder="Rua das Flores, 123"
          value={form.endereco}
          onChange={handleChange}
        />
        {inputErrors.endereco && <InputError message={inputErrors.endereco} />}

        <label htmlFor="representante">Representante</label>
        <input
          type="text"
          id="representante"
          name="representante"
          placeholder="Maria Silva"
          value={form.representante}
          onChange={handleChange}
        />
        {inputErrors.representante && <InputError message={inputErrors.representante} />}

        <label htmlFor="telefone">Telefone</label>
        <input
          type="text"
          id="telefone"
          name="telefone"
          placeholder="(11) 91234-5678"
          value={form.telefone}
          onChange={handleChange}
        />
        {inputErrors.telefone && <InputError message={inputErrors.telefone} />}

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          name="senha"
          placeholder="Mínimo 6 caracteres"
          value={form.senha}
          onChange={(e) => {
            handleChange(e);
            setForcaSenha(verificarForcaSenha(e.target.value));
          }}
        />
        {inputErrors.senha && <InputError message={inputErrors.senha} />}
        {form.senha && (
          <p className={`forca-senha forca-${forcaSenha}`}>
            Força da senha: {forcaSenha}
          </p>
        )}

        <label htmlFor="confirmarSenha">Confirmar Senha</label>
        <input
          type="password"
          id="confirmarSenha"
          name="confirmarSenha"
          placeholder="Confirme sua senha"
          value={confirmarSenha}
          onChange={(e) => {setConfirmarSenha(e.target.value);
            if (inputErrors.confirmarSenha) {
              setInputErrors((prev) => ({ ...prev, confirmarSenha: undefined }));
            }
          }}
        />
        {inputErrors.confirmarSenha && <InputError message={inputErrors.confirmarSenha} />}

        <br />

        <button type="submit">Cadastrar</button>
      </form>
      <p>
        Já tem uma conta? <a href="/Login">Faça login</a>
      </p>
    </div>
  );
}

export default CadastroONG;
