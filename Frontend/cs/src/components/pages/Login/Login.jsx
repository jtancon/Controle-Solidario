import "./Login.css";
import { useContext, useState } from "react";
import { AuthGoogleContext } from "../../../context/authGoogle";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseconfig";
import MensagemErro from "../../Erros/MensagemErro.jsx";
import ErrorMessages from "../../../constants/errorMessages.js";
import InputError from "../../Erros/InputError.jsx";

const Login = () => {
  const { signInGoogle, signed, signUpOng, signUpDoador } = useContext(AuthGoogleContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [errosCampos, setErrosCampos] = useState({ email: "", senha: "" });
  const navigate = useNavigate();
  const auth = getAuth();

  const loginGoogle = async () => {
    try {
      await signInGoogle();
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert(ErrorMessages.googleLoginError);
    }
  };

  const loginEmailSenha = async (e) => {
  e.preventDefault();
  setErro("");
  setErrosCampos({ email: "", senha: "" });

  let temErro = false;

  if (!email.trim()) {
    setErrosCampos((prev) => ({ ...prev, email: "O campo de email é obrigatório." }));
    temErro = true;
  }

  if (!senha.trim()) {
    setErrosCampos((prev) => ({ ...prev, senha: "O campo de senha é obrigatório." }));
    temErro = true;
  }

  if (temErro) return;
  
    try {
      const result = await signInWithEmailAndPassword(auth, email, senha);
      const uid = result.user.uid;

      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.classificacao === "Doador") {
          signUpDoador(userData, uid);
          navigate("/");
          return;
        } else if (userData.classificacao === "ONG") {
          signUpOng(userData, uid);
          navigate("/");
          return;
        }
      }
  
      setErro(ErrorMessages.userNaoEncontrado);
    } catch (error) {
      console.error(ErrorMessages.userNaoEncontrado);
      setErro(ErrorMessages.loginInvalido);
    }
  };  

  if (signed) {
    return <Navigate to="/" replace />;
  }

  return (
    
    <div className="login-page">
        <div className="login-container">
          
          <h1>Login</h1>

          <form onSubmit={loginEmailSenha} className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errosCampos.email && <InputError message={errosCampos.email} />}
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {errosCampos.senha && <InputError message={errosCampos.senha} />}
            </div>

            <button type="submit">Entrar com E-mail</button>
          </form>

          <p className="ou-texto">ou</p>

          <button className="login-button" onClick={loginGoogle}>
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google logo"
            />
            Login com Google
          </button>

          {erro && <MensagemErro message={erro} />}

          <p>
            Não tem uma conta?
          </p>
          <p>
            <a href="/CadastroONG">Cadastre-se como ONG</a>
          </p>
          <p>
            <a href="/CadastroDoador">Cadastre-se como Doador</a>
          </p>
          <p>
            Esqueceu sua senha? <a href="/RecuperarSenha">Recuperar Senha</a>
          </p>
        </div>
    </div>
  );
};

export default Login;