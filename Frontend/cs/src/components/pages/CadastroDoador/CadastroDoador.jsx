/* eslint-disable no-unused-vars */
import "./CadastroDoador.css";
import { useState } from "react";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CS from "../../../assets/CS.jpg";

function CadastroDoador() {
  const [form, setForm] = useState({
    nomeCompleto: "",
    usuario: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    fotoPerfil: CS,
    classificacao: "doador",
  });
  const [confirmarSenha, setConfirmarSenha] = useState("");
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

    setForm({ ...form, [name]: formattedValue });
  };

  const verificarForcaSenha = (senha) => {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[@$!%*?&]/.test(senha);
    const temSequencia = /(012|123|234|345|456|567|678|789|890|abc|bcd)/i.test(
      senha
    );
    const criterios = [
      temMaiuscula,
      temMinuscula,
      temNumero,
      temEspecial,
    ].filter(Boolean).length;

    if (senha.length < 6 || temSequencia) return "fraca";
    if (criterios >= 2) return criterios === 4 ? "forte" : "media";
    return "fraca";
  };

  const verificarEmailOuCPFExistente = async () => {
    const emailQuery = query(
      collection(db, "usuarios"),
      where("email", "==", form.email)
    );
    const cpfQuery = query(
      collection(db, "usuarios"),
      where("cpf", "==", form.cpf)
    );

    const [emailSnap, cpfSnap] = await Promise.all([
      getDocs(emailQuery),
      getDocs(cpfQuery),
    ]);

    if (!emailSnap.empty) {
      toast.error("Este e-mail já está cadastrado.");
      return true;
    }
    if (!cpfSnap.empty) {
      toast.error("Este CPF já está cadastrado.");
      return true;
    }
    return false;
  };

  const validarCampos = async () => {
    const { nomeCompleto, usuario, email, cpf, telefone, senha } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    if (
      !nomeCompleto ||
      !usuario ||
      !email ||
      !cpf ||
      !telefone ||
      !senha ||
      !confirmarSenha
    ) {
      toast.error("Todos os campos são obrigatórios.");
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error("E-mail inválido.");
      return false;
    }

    if (!cpfRegex.test(cpf)) {
      toast.error("CPF inválido.");
      return false;
    }

    if (!telefoneRegex.test(telefone)) {
      toast.error("Telefone inválido.");
      return false;
    }

    if (await verificarEmailOuCPFExistente()) return false;

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return false;
    }

    if (verificarForcaSenha(senha) === "fraca") {
      toast.error("A senha é muito fraca.");
      return false;
    }

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

      const { senha, ...dadosParaSalvar } = form;

      await setDoc(doc(db, "usuarios", user.uid), dadosParaSalvar);

      toast.success("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar doador:", error);
      toast.error("Erro ao cadastrar. Email já cadastrado.");
    }
  };

  return (
    <div className="CadastroDoador">
      <ToastContainer autoClose={3000} />
      <h1>Cadastro de Doador</h1>
      <form onSubmit={handleSubmit}>
        <label>Nome Completo</label>
        <input
          type="text"
          name="nomeCompleto"
          placeholder="Ex: Maria Joaquina"
          value={form.nomeCompleto}
          onChange={handleChange}
        />

        <label>Nome de Usuário</label>
        <input
          type="text"
          name="usuario"
          placeholder="Maria"
          value={form.usuario}
          onChange={handleChange}
        />

        <label>E-mail</label>
        <input
          type="email"
          name="email"
          placeholder="nome@email.com"
          value={form.email}
          onChange={handleChange}
        />

        <label>CPF</label>
        <input
          type="text"
          name="cpf"
          placeholder="00.000.000-00"
          value={form.cpf}
          onChange={handleChange}
        />

        <label>Telefone</label>
        <input
          type="text"
          name="telefone"
          placeholder="(11) 91234-5678"
          value={form.telefone}
          onChange={handleChange}
        />

        <label>Senha</label>
        <input
          type="password"
          name="senha"
          placeholder="Mínimo 6 caracteres"
          value={form.senha}
          onChange={(e) => {
            handleChange(e);
            setForcaSenha(verificarForcaSenha(e.target.value));
          }}
        />
        {form.senha && (
          <p className={`forca-senha forca-${forcaSenha}`}>
            Força da senha: {forcaSenha}
          </p>
        )}

        <label>Confirmar Senha</label>
        <input
          type="password"
          name="confirmarSenha"
          placeholder="Confirme sua senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />

        <input type="hidden" name="classificacao" value="doador" />

        <button type="submit">Cadastrar</button>
      </form>
      <p>
        Já tem uma conta? <a href="/Login">Faça login</a>
      </p>
    </div>
  );
}

export default CadastroDoador;
