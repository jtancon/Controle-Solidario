/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

import api from "../../../services/api";
import EscolherClassificacao from "../EscolherClassificacao/EscolherClassificacao";
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import NavbarONG from "../../Navbar_Footer/NavbarONG";
import Card1 from "../Doacao/CardInst/CardInst";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ESTILOS PRÓPRIOS
import "../Doacao/doacao.css";
import "../Index/Index.css";

function Index() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarEscolha, setMostrarEscolha] = useState(false);
  const [ongs, setOngs] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Listener de autenticação para buscar dados do usuário logado
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await api.get(`/usuarios/${user.email}`);
          const dados = res.data;
          setUsuario(dados);
          if (dados.classificacao === "Não definido") {
            setMostrarEscolha(true);
          }
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          if (error.response && error.response.status === 404) {
            setUsuario({ email: user.email, classificacao: "Não definido" });
            setMostrarEscolha(true);
          }
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/Login");
      }
    });

    // Função para buscar a lista de todas as ONGs
    const buscarOngs = async () => {
      try {
        console.log("1. Buscando dados em /usuarios...");
        const response = await api.get("/usuarios");
        const data = response.data;
        
        console.log("2. DADOS BRUTOS RECEBIDOS:", data);
        
        let usuarios = [];
        // Garante que os dados sejam tratados corretamente, seja um array ou objeto
        if (Array.isArray(data)) {
          usuarios = data;
        } else if (typeof data === "object" && data !== null) {
          // Converte os valores do objeto para um array
          usuarios = Object.values(data);
        } else {
          console.warn("Formato de resposta inesperado:", data);
        }

        const listaFiltrada = usuarios.filter(
          (u) => u && u.classificacao === "ONG"
        );
        console.log("3. ONGs encontradas (APÓS FILTRO):", listaFiltrada);
        setOngs(listaFiltrada);

      } catch (error) {
        console.error("ERRO DETALHADO ao buscar ONGs:", error);
        if (error.response) {
            console.error("Detalhes da resposta do erro:", error.response.data);
        }
      }
    };

    buscarOngs();

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleClassificacaoEscolhida = (tipo) => {
    setUsuario((prev) => ({ ...prev, classificacao: tipo }));
    setMostrarEscolha(false);
  };

  const settings = {
    dots: true,
    infinite: ongs.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: false,
    initialSlide: 0,
    responsive: [
      { breakpoint: 2560, settings: { slidesToShow: 5, infinite: ongs.length > 5 } },
      { breakpoint: 1920, settings: { slidesToShow: 4, infinite: ongs.length > 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, infinite: ongs.length > 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, infinite: ongs.length > 1 } },
    ],
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Carregando...</div>;
  }

  return (
    <>
      <div>
        {mostrarEscolha ? (
          <EscolherClassificacao
            userId={auth.currentUser.email}
            onClassificacaoEscolhida={handleClassificacaoEscolhida}
          />
        ) : usuario?.classificacao === "doador" ? (
          <>
            <NavbarDoador />
            <div>
              <div className="doadorHome">
                <div className="tituloDoadorbg">
                  <div className="transparencia">
                    <h1 className="tituloDoador">
                      Conheça as nossas instituições parceiras!
                    </h1>
                  </div>
                </div>
                <div className="divisor"></div>
                <h1 className="fraseImpacto">
                  Doe para quem faz a diferença.
                </h1>

                <div className="instituicoesIndex">
                  {ongs.length > 0 ? (
                    <Slider {...settings}>
                      {ongs.map((ong) => (
                        <div key={ong.email}>
                          <Card1 ong={ong} />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <p>Nenhuma instituição encontrada no momento.</p>
                  )}
                </div>

                <div className="botoesDoadorContainer">
                  <Link to="/HistoricoDoacao" className="botoesDoadorMenu">
                    <img className="imgBotao" src={"/src/assets/svghist-com.svg"} alt="Histórico de Doações" />
                    <span className="txtBotao">Doações</span>
                  </Link>
                  <Link to="/PerfilDoador" className="botoesDoadorMenu">
                    <img className="imgBotao" src={"/src/assets/profile.svg"} alt="Perfil do Doador" />
                    <span className="txtBotao">Perfil</span>
                  </Link>
                </div>
                <div className="textoBg">
                  <p className="texto">
                    Controle Solidário é uma plataforma dedicada a conectar pessoas dispostas a ajudar com ONGs que realmente fazem a diferença. Nosso propósito é tornar o ato de doar
                    mais acessível, seguro e transparente, permitindo que cada contribuição chegue a quem mais precisa. Ao apoiar uma instituição, você fortalece projetos sociais, amplia
                    o alcance de ações humanitárias e transforma vidas. Pequenos gestos constroem grandes mudanças e você pode ser parte disso.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : usuario?.classificacao === "ONG" ? (
        <><NavbarONG />
        <div>
            <div className="bem-vindoBg">
              <div className="painel-ong-titulo">
                <h1>Bem-vindo, </h1>
                <h1>{usuario.nome || "ONG"}!</h1>
              </div>
            </div>
            <div className="painel">
              <div className="descricao">
                <h1>Descrição</h1>
                <p className="painel-ong-descricao">
                  {usuario.descricao || "Sua ONG ainda não possui uma descrição cadastrada."}
                </p>
              </div>
              <div>
                <div className="logoContainer">
                  <div className="imageLogoContainer">
                    <img
                      className="imgLogo"
                      src={usuario.fotoPerfil || "src/assets/ONGS.png"}
                      alt="Logo da ONG" />
                  </div>
                </div>
                <Link to="/AdminONG" className="admnistrarBtn">Administrar ONG</Link>
                <div className="ongBotoesContainer">
                  <Link to="/PerfilONG" className="ongBotoes">Perfil</Link>
                  <Link to="/Dashboard" className="ongBotoes">Dashboard</Link>
                </div>
              </div>
            </div>
          </div></>
        ) : null}
      </div>
    </>
  );
}

export default Index;
