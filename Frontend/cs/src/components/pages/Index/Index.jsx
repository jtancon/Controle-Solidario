/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebaseconfig";
import EscolherClassificacao from "../EscolherClassificacao/EscolherClassificacao";
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import Slider from "react-slick";
import Card1 from "../Doacao/CardInst/CardInst";
import "../Doacao/doacao.css"; // estilos da doação
import "../Index/Index.css"; // estilos da index

function Index() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarEscolha, setMostrarEscolha] = useState(false);
  const [ongs, setOngs] = useState([]);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const dados = snapshot.data();
          setUsuario(dados);

          if (dados.classificacao === "Não definido") {
            setMostrarEscolha(true);
          }
        }
      }
    });

    const buscarOngs = async () => {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const lista = [];
      querySnapshot.forEach((doc) => {
        const dados = doc.data();
        if (dados.classificacao === "ONG") {
          lista.push({ id: doc.id, ...dados });
        }
      });
      setOngs(lista);
    };

    buscarOngs();

    return () => unsubscribe();
  }, []);

  const handleClassificacaoEscolhida = (tipo) => {
    setUsuario((prev) => ({ ...prev, classificacao: tipo }));
    setMostrarEscolha(false);
  };

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    adaptiveHeight: false,
    initialSlide: 0,
  };

  return (
    <>
      <NavbarDoador />
      <div>
        {mostrarEscolha ? (
          <EscolherClassificacao
            userId={auth.currentUser.uid}
            onClassificacaoEscolhida={handleClassificacaoEscolhida}
          />
        ) : usuario?.classificacao === "doador" ? (
          <div>
            <div className="doacao">
              <div className="textos">
                <h1 className="frase-impacto">
                  Transforme solidariedade em ação. Doe para quem faz a diferença.
                </h1>
              </div>

              <div className="instituicoes">
                <Slider {...settings}>
                  {ongs.map((ong) => (
                    <Card1 key={ong.uid} ong={ong} />
                  ))}
                </Slider>
              </div>

              <div className="textos">
                <h2 className="texto-proposito">
                  Controle Solidário é uma plataforma dedicada a conectar pessoas dispostas a ajudar com ONGs que realmente fazem a diferença. Nosso propósito é tornar o ato de doar mais acessível, seguro e transparente, permitindo que cada contribuição chegue a quem mais precisa. Ao apoiar uma instituição, você fortalece projetos sociais, amplia o alcance de ações humanitárias e transforma vidas. Pequenos gestos constroem grandes mudanças — e você pode ser parte disso.
                </h2>
              </div>
            </div>
          </div>
        ) : usuario?.classificacao === "ONG" ? (
          <div className="painel-ong" style={{ textAlign: "center", marginTop: "2rem" }}>
            <h1 style={{ marginBottom: "1rem" }}>Bem-vindo, {usuario.nome || "ONG"}!</h1>
            <p style={{ maxWidth: "800px", margin: "0 auto 2rem", fontSize: "1.1rem" }}>
              {usuario.descricao || "Sua ONG ainda não possui uma descrição cadastrada."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <a href="/Dashboard">
                <button className="botao">Dashboard</button>
              </a>
              <a href="/HistoricoDoacao">
                <button className="botao">Histórico de Doações</button>
              </a>
              <a href="/AdminONG">
                <button className="botao">Administrar ONG</button>
              </a>
              <a href="/PerfilONG">
                <button className="botao">Perfil</button>
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Index;
