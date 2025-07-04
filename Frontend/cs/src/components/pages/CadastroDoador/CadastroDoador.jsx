// ✅ CORREÇÃO: Voltando para caminhos relativos com base na estrutura mais provável do seu projeto.
import "./CadastroDoador.css";
import { useState } from "react";
// O ficheiro atual está em: src/components/pages/CadastroDoador/
// Para chegar a 'src/services/', precisamos de subir 3 níveis.
import { db } from "../../../services/firebaseconfig";
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
import errorMessages from "../../../constants/errorMessages";
import InputError from "../../Erros/InputError";
import MensagemErro from "../../Erros/MensagemErro";
import CS from "../../../assets/CS.jpg";

function CadastroDoador() {
  const [form, setForm] = useState({
    // Campos preenchidos pelo usuário no formulário
    nomeCompleto: "",
    nomeUsuario: "",
    email: "",
    cpf: "",
    telefone: "",
    cep: "",
    endereco: "",
    senha: "",
    // Campos com valores padrão ou definidos pelo sistema
    fotoPerfil: CS,
    classificacao: "doador",
  });
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [errors, setErrors] = useState({});
  const [forcaSenha, setForcaSenha] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = value.replace(/\D/g, "").slice(0, 11);
      formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1.$2");
      formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1.$2");
      formattedValue = formattedValue.replace(/(\d{3})(\d{2})$/, "$1-$2");
    }

    if (name === "telefone") {
      formattedValue = value.replace(/\D/g, "").slice(0, 11);
      formattedValue = formattedValue.replace(/^(\d{2})(\d)/, "($1) $2");
      formattedValue = formattedValue.replace(/(\d{5})(\d)/, "$1-$2");
    }

    if (name === "cep") {
        formattedValue = value.replace(/\D/g, "").slice(0, 8);
        formattedValue = formattedValue.replace(/(\d{5})(\d)/, '$1-$2');
    }

    setForm({ ...form, [name]: formattedValue });
    setErrors({ ...errors, [name]: "" });
  };

  const verificarForcaSenha = (senha) => {
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

  const verificarEmailOuCPFExistente = async () => {
    const emailQuery = query(collection(db, "usuarios"), where("email", "==", form.email));
    const cpfQuery = query(collection(db, "usuarios"), where("cpf", "==", form.cpf));

    const [emailSnap, cpfSnap] = await Promise.all([
      getDocs(emailQuery),
      getDocs(cpfQuery),
    ]);

    const errosTemp = {};

    if (!emailSnap.empty) {
      errosTemp.email = errorMessages.emailJaCadastrado;
    }
    if (!cpfSnap.empty) {
      errosTemp.cpf = "CPF já cadastrado.";
    }

    setErrors((prev) => ({ ...prev, ...errosTemp }));

    return Object.keys(errosTemp).length > 0;
  };

  const validarCampos = async () => {
    const { nomeCompleto, nomeUsuario, email, cpf, telefone, cep, endereco, senha } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const cepRegex = /^\d{5}-\d{3}$/;

    const errosTemp = {};

    if (!nomeCompleto) errosTemp.nomeCompleto = errorMessages.camposObrigatorios;
    if (!nomeUsuario) errosTemp.nomeUsuario = errorMessages.camposObrigatorios;
    if (!email) {
      errosTemp.email = errorMessages.camposObrigatorios;
    } else if (!emailRegex.test(email)) {
      errosTemp.email = errorMessages.emailInvalido;
    }

    if (!cpf) {
      errosTemp.cpf = errorMessages.camposObrigatorios;
    } else if (!cpfRegex.test(cpf)) {
      errosTemp.cpf = "CPF inválido.";
    }
    
    if (!cep) {
        errosTemp.cep = errorMessages.camposObrigatorios;
    } else if (!cepRegex.test(cep)) {
        errosTemp.cep = "CEP inválido.";
    }
    
    if (!endereco) errosTemp.endereco = errorMessages.camposObrigatorios;

    if (!telefone) {
      errosTemp.telefone = errorMessages.camposObrigatorios;
    } else if (!telefoneRegex.test(telefone)) {
      errosTemp.telefone = errorMessages.telefoneInvalido;
    }

    if (!senha) {
      errosTemp.senha = errorMessages.camposObrigatorios;
    } else if (verificarForcaSenha(senha) === "fraca") {
      errosTemp.senha = errorMessages.erroCadastro;
    }

    if (!confirmarSenha) {
      errosTemp.confirmarSenha = errorMessages.camposObrigatorios;
    } else if (senha !== confirmarSenha) {
      errosTemp.confirmarSenha = errorMessages.senhaNaoConfere;
    }

    setErrors(errosTemp);

    if (Object.keys(errosTemp).length > 0) {
      return false;
    }

    const existem = await verificarEmailOuCPFExistente();
    return !existem;
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

      const { senha, ...dadosDoForm } = form;
      
      const dadosParaSalvar = {
        ...dadosDoForm,
        uid: user.uid,
        nome: form.nomeCompleto,
        usuario: form.email,
        criadoEm: serverTimestamp()
      };

      await setDoc(doc(db, "usuarios", user.uid), dadosParaSalvar);

      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar doador:", error);
      setErrors({ general: errorMessages.erroCadastro });
    }
  };

  return (
    <div className="CadastroDoador">
      <h1>Cadastro de Doador</h1>
      {errors.general && <MensagemErro message={errors.general} />}
      <form onSubmit={handleSubmit}>
        <label>Nome Completo</label>
        <input type="text" name="nomeCompleto" placeholder="Ex: Maria Joaquina de Amaral Pereira" value={form.nomeCompleto} onChange={handleChange}/>
        {errors.nomeCompleto && <InputError message={errors.nomeCompleto} />}

        <label>Nome de Usuário</label>
        <input type="text" name="nomeUsuario" placeholder="Ex: maria.joaquina" value={form.nomeUsuario} onChange={handleChange}/>
        {errors.nomeUsuario && <InputError message={errors.nomeUsuario} />}

        <label>E-mail</label>
        <input type="email" name="email" placeholder="nome@email.com" value={form.email} onChange={handleChange}/>
        {errors.email && <InputError message={errors.email} />}

        <label>CPF</label>
        <input type="text" name="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange}/>
        {errors.cpf && <InputError message={errors.cpf} />}
        
        <label>CEP</label>
        <input type="text" name="cep" placeholder="00000-000" value={form.cep} onChange={handleChange}/>
        {errors.cep && <InputError message={errors.cep} />}

        <label>Endereço</label>
        <input type="text" name="endereco" placeholder="Rua, Número, Bairro, Cidade - Estado" value={form.endereco} onChange={handleChange}/>
        {errors.endereco && <InputError message={errors.endereco} />}

        <label>Telefone</label>
        <input type="text" name="telefone" placeholder="(11) 91234-5678" value={form.telefone} onChange={handleChange}/>
        {errors.telefone && <InputError message={errors.telefone} />}

        <label>Senha</label>
        <input type="password" name="senha" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={(e) => {
            handleChange(e);
            setForcaSenha(verificarForcaSenha(e.target.value));
          }}/>
        {form.senha && (<p className={`forca-senha forca-${forcaSenha}`}> Força da senha: {forcaSenha} </p>)}
        {errors.senha && <InputError message={errors.senha} />}

        <label>Confirmar Senha</label>
        <input type="password" name="confirmarSenha" placeholder="Confirme sua senha" value={confirmarSenha} onChange={(e) => {
            setConfirmarSenha(e.target.value);
            setErrors({ ...errors, confirmarSenha: "" });
          }}/>
        {errors.confirmarSenha && (<InputError message={errors.confirmarSenha} />)}

        <button type="submit">Cadastrar</button>
      </form>
      <p> Já tem uma conta? <a href="/Login">Faça login</a> </p>
    </div>
  );
}

export default CadastroDoador;
