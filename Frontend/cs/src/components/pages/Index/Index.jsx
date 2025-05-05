/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseconfig";
import EscolherClassificacao from "../EscolherClassificacao/EscolherClassificacao";

function Index() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarEscolha, setMostrarEscolha] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const dados = snapshot.data();
          setUsuario(dados);

          if (dados.classificacao == "Não definido") {
            setMostrarEscolha(true);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClassificacaoEscolhida = (tipo) => {
    setUsuario((prev) => ({ ...prev, classificacao: tipo }));
    setMostrarEscolha(false);
  };

  return (
    <div>
      {mostrarEscolha && (
        <EscolherClassificacao
          userId={auth.currentUser.uid}
          onClassificacaoEscolhida={handleClassificacaoEscolhida}
        />
      )}
    </div>
  );
}

export default Index;
