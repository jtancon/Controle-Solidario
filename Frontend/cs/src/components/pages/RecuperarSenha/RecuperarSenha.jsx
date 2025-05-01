import "./RecuperarSenha.css";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem("E-mail de recuperação enviado com sucesso!");
      setErro("");
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      setErro("Erro ao enviar e-mail. Verifique o endereço digitado.");
      setMensagem("");
    }
  };

  return (
    <div className="recuperar-container">
      <h1>Recuperar Senha</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Digite seu e-mail cadastrado"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar link de recuperação</button>
      </form>
      {mensagem && <p className="sucesso">{mensagem}</p>}
      {erro && <p className="erro">{erro}</p>}
      <p>
        Lembrou sua senha? <a href="/Login">Voltar ao login</a>
      </p>
    </div>
  );
}

export default RecuperarSenha;
