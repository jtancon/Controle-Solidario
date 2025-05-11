import "./Login.css";
import { useContext, useState } from "react";
import { AuthGoogleContext } from "../../../context/authGoogle";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseconfig";
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";

const Login = () => {
  const { signInGoogle, signed, signUpOng, signUpDoador } = useContext(AuthGoogleContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const loginGoogle = async () => {
    try {
      await signInGoogle();
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert("Erro ao fazer login com Google.");
    }
  };

  const loginEmailSenha = async (e) => {
    e.preventDefault();
    setErro("");
  
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
  
      setErro("Perfil de ONG ou Doador não encontrado.");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErro("Email ou senha incorretos.");
    }
  };  

  if (signed) {
    return <Navigate to="/" replace />;
  }

  return (
    
    <div className="login-page">
      <NavbarDoador />
        <div className="login-container">
          
          <h1>Login</h1>

          <form onSubmit={loginEmailSenha} className="login-form">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
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

          {erro && <p className="erro">{erro}</p>}

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