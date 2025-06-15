/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import EscolherClassificacao from "../EscolherClassificacao/EscolherClassificacao";
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import NavbarONG from "../../Navbar_Footer/NavbarONG";
import Slider from "react-slick";
import Card1 from "../Doacao/CardInst/CardInst";
import "../Doacao/doacao.css";
import "../Index/Index.css";
import { Link } from "react-router-dom";

function Index() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarEscolha, setMostrarEscolha] = useState(false);
  const [ongs, setOngs] = useState([]);

  const auth = getAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
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
        }
      } else {
        navigate("/Login");
      }
    });

    const buscarOngs = async () => {
      try {
        const res = await api.get("/usuarios");
        const lista = res.data.filter((u) => u.classificacao === "ONG");
        setOngs(lista);
      } catch (error) {
        console.error("Erro ao buscar ONGs:", error);
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
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: false,
    initialSlide: 0,
    dots: true,
    customPaging: (i) => (
      <div
        style={{
          fontSize: "clamp(14px, 1.2vw, 24px)",
          color: "#1A4D80",
          opacity: 0.5,
        }}
      >
        •
      </div>
    ),
    dotsClass: "slick-dots slick-thumb",
    responsive: [
      {
        breakpoint: 2560,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };


  return (
    <>
      <div>
        {mostrarEscolha ? (
          <EscolherClassificacao
            userId={auth.currentUser.uid}
            onClassificacaoEscolhida={handleClassificacaoEscolhida}
          />
        ) : usuario?.classificacao === "doador" ? (
          <><NavbarDoador />
        <div>
            <div className="doadorHome">
              <div className="tituloDoadorbg">
                <div className="transparencia">
                  <h1 className="tituloDoador">Conheça as nossas instituições parceiras!</h1>
                </div>
              </div>
              <div className="divisor"></div>
              <h1 className="fraseImpacto">
                Doe para quem faz a diferença.
              </h1>
              <div className="instituicoesIndex">
                <Slider {...settings}>
                  {ongs.map((ong) => (
                    <Card1 key={ong.uid} ong={ong} />
                  ))}
                </Slider>
              </div>
              <div className="botoesDoadorContainer">
                <Link to="/HistoricoDoacao" className="botoesDoadorMenu">
                  <img className='imgBotao' src={"src/assets/svghist-com.svg"}></img>
                  <span className="txtBotao">Doações</span>
                </Link>

                <Link to="/PerfilDoador" className="botoesDoadorMenu">
                  <img className='imgBotao' src={"src/assets/profile.svg"}></img>
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
          </div></>
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
