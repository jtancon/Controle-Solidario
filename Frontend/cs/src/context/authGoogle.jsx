/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../services/firebaseconfig";
import { Navigate } from "react-router-dom";
const provider = new GoogleAuthProvider();

export const AuthGoogleContext = createContext({});

export const AuthGoogleProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadStorageAuth = () => {
    const token = sessionStorage.getItem("@AuthFirebase:token");
    const userSession = sessionStorage.getItem("@AuthFirebase:user");

    if (token && userSession) {
      setUser(JSON.parse(userSession));
    }
    setLoading(false);
  };
  loadStorageAuth();
}, []);

  const signInGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        setUser(user);
        sessionStorage.setItem("@AuthFirebase:token", token);
        sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(user));
      })
      .catch((error) => {
        console.error("Erro no login com Google:", error);
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  function signOut() {
    sessionStorage.clear();
    setUser(null);
    
    return <Navigate to="/Login" replace />;
  }

  return (
    <AuthGoogleContext.Provider value={{ signInGoogle, signed: !!user, loading, user, signOut }}>
      {children}
    </AuthGoogleContext.Provider>
  );
};
