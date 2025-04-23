import './doacao.css';
import Card1 from './CardInst/CardInst.jsx';
import Slider from 'react-slick';  // Importando o Slider do react-slick

function Doacao() {
    // Configurações do carrossel
    const settings = {
        infinite: false,   // Permite rotação infinita
        speed: 500,
        slidesToShow: 3,  // Exibe 3 cards de cada vez
        slidesToScroll: 1,  // Avança 1 card por vez
        dots: true,      // Exibe pontos de navegação
        arrows: true,    // Exibe setas para navegação
        adaptiveHeight: true,  // Ajusta a altura automaticamente
        initialSlide: 0,  // Começa do primeiro slide (esquerda)
    };
    

    return (
        <div className="doacao">
            <div className="instituicoes">
                <Slider {...settings}>
                    <Card1>
                        {/* Componente Card */}
                    </Card1>
                    <Card1>
                        {/* Componente Card */}
                    </Card1>
                    <Card1>
                        {/* Componente Card */}
                    </Card1>
                    <Card1>
                        {/* Componente Card */}
                    </Card1>
                    <Card1>
                        {/* Componente Card */}
                    </Card1>
                    {/* Adicione mais Card1 conforme necessário */}
                </Slider>
            </div>
            <div className='valores'>
                <h1>Valores:</h1>
                <button className="botao">R$: 1,00</button>
                <button className="botao">R$: 5,00</button>
                <button className="botao">R$: 10,00</button>
                <button className="botao">R$: 50,00</button>
                <button className="botao">R$: 100,00</button>
            </div>
        </div>
    );
}

export default Doacao;
