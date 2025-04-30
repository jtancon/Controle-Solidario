import "./Login.css";
import { useContext } from "react";
import { AuthGoogleContext } from "../../../context/authGoogle";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { signInGoogle, signed } = useContext(AuthGoogleContext);

  async function loginGoogle() {
    try {
      await signInGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }

  if (!signed) {
    return (
        <div className="login-container">
          <h1>Login</h1>
          <p>Login with your Google account</p>
          <button className="login-button" onClick={loginGoogle}>
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google logo"
            />
            Login com Google
          </button>
          <p>
            Não tem uma conta? <a href="/CadastroONG">Cadastre-se</a>
          </p>
          <p>
            Esqueceu sua senha? <a href="/RecuperarSenha">Recuperar Senha</a>
          </p>
        </div>
      );
  }
  else{
    return <Navigate to="/" replace />;
  }
  
};

export default Login;
