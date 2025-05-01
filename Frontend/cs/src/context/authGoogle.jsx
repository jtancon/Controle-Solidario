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
        const userData = await carregarDadosOng(currentUser.uid);
        const fullUserData = { ...userData, uid: currentUser.uid };
        setUser(fullUserData);
        sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(fullUserData));
        sessionStorage.setItem("@AuthFirebase:token", await currentUser.getIdToken());
      } else {
        setUser(null);
        sessionStorage.clear();
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);  

  const carregarDadosOng = async (uid) => {
    try {
      const docRef = doc(db, "ongs", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao carregar dados da ONG:", error);
      return null;
    }
  };

  const signInGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const firebaseUser = result.user;

      const userRef = doc(db, "ongs", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let userData;

      if (!userSnap.exists()) {
        userData = {
          uid: firebaseUser.uid,
          nome: firebaseUser.displayName || "",
          email: firebaseUser.email,
          cnpj: "",
          cep: "",
          endereco: "",
          representante: "",
          telefone: "",
          criadoEm: new Date(),
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
    const newUser = { ...ongData, uid };
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
      if (currentUser) {
        await deleteDoc(doc(db, "ongs", currentUser.uid));
        await deleteUser(currentUser);
        sessionStorage.clear();
        setUser(null);
        alert("Conta deletada com sucesso.");
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      alert("Erro ao deletar a conta. Refaça o login e tente novamente.");
    }
  };

  return (
    <AuthGoogleContext.Provider
      value={{
        signInGoogle,
        signUpOng,
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
