// ✅ CORREÇÃO: Usando caminhos absolutos a partir da pasta 'src' e adicionando extensões
// para garantir que o Vite encontre os ficheiros corretamente.
import "./CadastroONG.css";
import { useState } from "react";
import { db } from "/src/services/firebaseconfig.js";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import errorMessages from "/src/constants/errorMessages.js";
import InputError from "/src/components/Erros/InputError.jsx";
import MensagemErro from "/src/components/Erros/MensagemErro.jsx";
import CS from "/src/assets/CS.jpg";

function CadastroONG() {
  const [form, setForm] = useState({
    nome: "",
    nomeCompleto: "",
    nomeUsuario: "",
    cnpj: "",
    cep: "",
    endereco: "",
    representante: "",
    telefone: "",
    email: "",
    senha: "",
    descricao: "", 
    fotoPerfil: CS,
    classificacao: "ONG",
  });

  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [forcaSenha, setForcaSenha] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const [errors, setErrors] = useState({});

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
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const verificarForcaSenha = (senha) => {
    if (!senha) return "";
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[@$!%*?&#]/.test(senha);
    const temSequencia = /(012|123|234|345|456|567|678|789|890|abc|bcd)/i.test(senha);
    const criterios = [temMaiuscula, temMinuscula, temNumero, temEspecial].filter(Boolean).length;

    if (senha.length < 6 || temSequencia) return "fraca";
    if (criterios >= 2) return criterios === 4 ? "forte" : "media";
    return "fraca";
  };

  const verificarEmailOuCNPJExistente = async () => {
    const emailQuery = query(collection(db, "usuarios"), where("email", "==", form.email));
    const cnpjQuery = query(collection(db, "usuarios"), where("cnpj", "==", form.cnpj));

    const [emailSnap, cnpjSnap] = await Promise.all([
        getDocs(emailQuery),
        getDocs(cnpjQuery),
    ]);

    const errosTemp = {};
    if (!emailSnap.empty) errosTemp.email = errorMessages.emailJaCadastrado;
    if (!cnpjSnap.empty) errosTemp.cnpj = "CNPJ já cadastrado.";
    
    setErrors((prev) => ({...prev, ...errosTemp}));
    return Object.keys(errosTemp).length > 0;
  };

  const validarCampos = async () => {
    const errosTemp = {};
    const { nome, nomeCompleto, nomeUsuario, cnpj, cep, endereco, representante, telefone, email, senha } = form;
    
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    const cepRegex = /^\d{5}-\d{3}$/;
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nome) errosTemp.nome = errorMessages.camposObrigatorios;
    if (!nomeCompleto) errosTemp.nomeCompleto = errorMessages.camposObrigatorios;
    if (!nomeUsuario) errosTemp.nomeUsuario = errorMessages.camposObrigatorios;
    if (!cnpj || !cnpjRegex.test(cnpj)) errosTemp.cnpj = errorMessages.cnpjInvalido;
    if (!cep || !cepRegex.test(cep)) errosTemp.cep = errorMessages.cepInvalido;
    if (!endereco) errosTemp.endereco = errorMessages.camposObrigatorios;
    if (!representante) errosTemp.representante = errorMessages.camposObrigatorios;
    if (!telefone || !telefoneRegex.test(telefone)) errosTemp.telefone = errorMessages.telefoneInvalido;
    if (!email || !emailRegex.test(email)) errosTemp.email = errorMessages.emailInvalido;
    
    if (!senha) {
        errosTemp.senha = errorMessages.camposObrigatorios;
    } else if (verificarForcaSenha(senha) === "fraca") {
        errosTemp.senha = "A senha é muito fraca.";
    }

    if (!confirmarSenha) {
        errosTemp.confirmarSenha = errorMessages.camposObrigatorios;
    } else if (senha !== confirmarSenha) {
        errosTemp.confirmarSenha = errorMessages.senhaNaoConfere;
    }

    setErrors(errosTemp);
    if (Object.keys(errosTemp).length > 0) return false;
    
    const existem = await verificarEmailOuCNPJExistente();
    return !existem;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validarCampos())) {
      toast.warn("Por favor, corrija os erros no formulário.");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.senha);
      
      const { senha, ...dadosDoForm } = form;

      const dadosParaSalvar = {
        ...dadosDoForm,
        uid: user.uid,
        usuario: form.email,
        criadoEm: serverTimestamp()
      };

      await setDoc(doc(db, "usuarios", user.uid), dadosParaSalvar);
      
      toast.success("ONG cadastrada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar ONG:", error);
      toast.error(errorMessages.erroCadastro);
    }
  };

  return (
    <div className="CadastroONG">
      <ToastContainer autoClose={3000} hideProgressBar={false} />
      <h1>Cadastro de ONG</h1>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome Fantasia da ONG</label>
        <input type="text" id="nome" name="nome" placeholder="Ex: Instituto Esperança" value={form.nome} onChange={handleChange}/>
        {errors.nome && <InputError message={errors.nome} />}

        <label htmlFor="nomeCompleto">Razão Social (Nome Completo)</label>
        <input type="text" id="nomeCompleto" name="nomeCompleto" placeholder="Ex: Instituto Esperança de Apoio Social" value={form.nomeCompleto} onChange={handleChange}/>
        {errors.nomeCompleto && <InputError message={errors.nomeCompleto} />}
        
        <label htmlFor="nomeUsuario">Nome de Usuário</label>
        <input type="text" id="nomeUsuario" name="nomeUsuario" placeholder="Ex: inst_esperanca" value={form.nomeUsuario} onChange={handleChange}/>
        {errors.nomeUsuario && <InputError message={errors.nomeUsuario} />}
        
        <label htmlFor="descricao">Descrição da ONG</label>
        <textarea
          id="descricao"
          name="descricao"
          placeholder="Conte-nos sobre a missão e as atividades da sua ONG."
          value={form.descricao}
          onChange={handleChange}
          rows="4"
        />
        {errors.descricao && <InputError message={errors.descricao} />}

        <label htmlFor="email">E-mail de Contato</label>
        <input type="email" id="email" name="email" placeholder="contato@ong.org" value={form.email} onChange={handleChange}/>
        {errors.email && <InputError message={errors.email} />}

        <label htmlFor="cnpj">CNPJ</label>
        <input type="text" id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" value={form.cnpj} onChange={handleChange}/>
        {errors.cnpj && <InputError message={errors.cnpj} />}

        <label htmlFor="cep">CEP</label>
        <input type="text" id="cep" name="cep" placeholder="00000-000" value={form.cep} onChange={handleChange}/>
        {errors.cep && <InputError message={errors.cep} />}

        <label htmlFor="endereco">Endereço Completo</label>
        <input type="text" id="endereco" name="endereco" placeholder="Rua das Flores, 123, Centro, Cidade - UF" value={form.endereco} onChange={handleChange}/>
        {errors.endereco && <InputError message={errors.endereco} />}

        <label htmlFor="representante">Nome do Representante Legal</label>
        <input type="text" id="representante" name="representante" placeholder="Maria da Silva" value={form.representante} onChange={handleChange}/>
        {errors.representante && <InputError message={errors.representante} />}

        <label htmlFor="telefone">Telefone de Contato</label>
        <input type="text" id="telefone" name="telefone" placeholder="(11) 91234-5678" value={form.telefone} onChange={handleChange}/>
        {errors.telefone && <InputError message={errors.telefone} />}

        <label htmlFor="senha">Senha</label>
        <input type="password" id="senha" name="senha" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={(e) => {
          handleChange(e);
          setForcaSenha(verificarForcaSenha(e.target.value));
        }}/>
        {errors.senha && <InputError message={errors.senha} />}
        {form.senha && (<p className={`forca-senha forca-${forcaSenha}`}> Força da senha: {forcaSenha} </p>)}

        <label htmlFor="confirmarSenha">Confirmar Senha</label>
        <input type="password" id="confirmarSenha" name="confirmarSenha" placeholder="Confirme sua senha" value={confirmarSenha} onChange={(e) => {
          setConfirmarSenha(e.target.value);
          setErrors((prev) => ({...prev, confirmarSenha: undefined}));
        }}/>
        {errors.confirmarSenha && <InputError message={errors.confirmarSenha} />}

        <br />
        <button type="submit">Cadastrar</button>
      </form>
      <p> Já tem uma conta? <a href="/Login">Faça login</a> </p>
    </div>
  );
}

export default CadastroONG;
