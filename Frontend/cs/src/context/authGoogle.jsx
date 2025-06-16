import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";
import { app, db } from "../services/firebaseconfig";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();
export const AuthGoogleContext = createContext({});

export const AuthGoogleProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("@AuthFirebase:user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await carregarDadosUsuario(currentUser.uid);
        const fullUserData = { ...userData, uid: currentUser.uid };
        setUser(fullUserData);
        sessionStorage.setItem(
          "@AuthFirebase:user",
          JSON.stringify(fullUserData)
        );
        sessionStorage.setItem(
          "@AuthFirebase:token",
          await currentUser.getIdToken()
        );
      } else {
        setUser(null);
        sessionStorage.clear();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const carregarDadosUsuario = async (uid) => {
    try {
      const userRef = doc(db, "usuarios", uid);

      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data();
      } 

    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      return null;
    }
  };

  const signInGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const firebaseUser = result.user;

      const userRef = doc(db, "usuarios", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let userData;

      if (!userSnap.exists()) {
        userData = {
          uid: firebaseUser.uid,
          nome: firebaseUser.displayName || "",
          nomeCompleto: firebaseUser.displayName || "",
          usuario: firebaseUser.displayName || "",
          fotoPerfil: firebaseUser.photoURL || "",
          email: firebaseUser.email,
          cnpj: "",
          cpf: "",
          cep: "",
          endereco: "",
          representante: "",
          telefone: "",
          criadoEm: new Date(),
          classificacao: "doador",
        };
        await setDoc(userRef, userData);
      } else {
        userData = userSnap.data();
      }

      setUser(userData);
      sessionStorage.setItem("@AuthFirebase:token", token);
      sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(userData));
    } catch (error) {
      console.error("Erro no login com Google:", error);
    }
  };

  const signUpOng = async (ongData, uid) => {
    const newUser = { ...ongData, uid, classificacao: "ONG" };
    setUser(newUser);
    sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(newUser));
  };

  const signUpDoador = async (doadorData, uid) => {
    const newUser = { ...doadorData, uid, classificacao: "Doador" };
    setUser(newUser);
    sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(newUser));
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    sessionStorage.clear();
    setUser(null);
  };

  const recuperarSenha = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("E-mail de recuperação enviado!");
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      alert("Erro ao enviar e-mail de recuperação.");
    }
  };

  const deletarConta = async () => {
    try {
        const currentUser = auth.currentUser;
        const userRef = auth.currentUser.classificacao === "ONG" ? "ongs" : "doador";
          if (currentUser) {
            if (userRef === "doador") {
              await deleteDoc(doc(db, "usuarios", currentUser.uid));
            }
            if (userRef === "ongs") {
              await deleteDoc(doc(db, "ongs", currentUser.uid));
            }
            await deleteUser(currentUser);
            sessionStorage.clear();
            setUser(null);
            alert("Conta deletada com sucesso.");
          }
        } catch (error) {
          console.error("Erro ao deletar conta:", error);
          alert("Erro ao deletar a conta. Refaça o login e tente novamente.");
    };
};

  return (
    <AuthGoogleContext.Provider
      value={{
        signInGoogle,
        signUpOng,
        signUpDoador,
        signed: !!user,
        loading,
        user,
        signOut,
        recuperarSenha,
        deletarConta,
      }}
    >
      {children}
    </AuthGoogleContext.Provider>
  );
};
