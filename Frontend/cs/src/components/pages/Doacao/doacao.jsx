import './doacao.css';
import Card1 from './CardInst/CardInst.jsx';
import Slider from 'react-slick';
import { useState, useRef } from 'react';
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";

function Doacao() {
    const [etapa, setEtapa] = useState('instituicoes');
    const [valorOutro, setValorOutro] = useState('R$ 0,00');
    const [valorSelecionado, setValorSelecionado] = useState('R$ 0,00');
    const [mostrarCampoOutro, setMostrarCampoOutro] = useState(false);
    const [metodoPagamento, setMetodoPagamento] = useState('Cartão');
    const inputRef = useRef(null);

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

    const handleSelecionarOng = () => {
        setEtapa('doacao');
    };

    const handleValorClick = (valor) => {
        setMostrarCampoOutro(false);
        setValorSelecionado(valor);
    };

    const handleOutroClick = () => {
        setMostrarCampoOutro(true);
        setValorSelecionado(valorOutro);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    const handleOutroChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length === 0) {
            value = '0';
        }

        while (value.length < 3) {
            value = '0' + value;
        }

        const reais = value.slice(0, -2);
        const centavos = value.slice(-2);

        const formatado = `R$ ${parseInt(reais, 10)},${centavos}`;
        setValorOutro(formatado);
        setValorSelecionado(formatado);
    };

    const handleIrParaPagamento = () => {
        setEtapa('pagamento');
    };

    const selecionarMetodo = (metodo) => {
        setMetodoPagamento(metodo);
    };

    return (
        <>
            <NavbarDoador/>
        <div className="doacao">
            {etapa === 'instituicoes' && (
                <div className="instituicoes">
                    <Slider {...settings}>
                        <Card1 aoSelecionar={handleSelecionarOng} />
                        <Card1 aoSelecionar={handleSelecionarOng} />
                        <Card1 aoSelecionar={handleSelecionarOng} />
                        <Card1 aoSelecionar={handleSelecionarOng} />
                        <Card1 aoSelecionar={handleSelecionarOng} />
                    </Slider>
                </div>
            )}

            {etapa === 'doacao' && (
                <div className="doacao-valor">
                    <div className="doacao-valor-dados">
                        <div className="dados-ong">
                            <img src={"src/assets/ONGS.png"} alt="Logo ONG" className="logo-ong" />
                            <p>
                                A WWF (World Wide Fund for Nature) é uma organização global dedicada à conservação da natureza e à proteção do meio ambiente, trabalhando para preservar espécies, habitats e combater as mudanças climáticas.
                            </p>
                        </div>
                        <div className="dados-valores">
                            <h3>Selecione o valor da Doação</h3>
                            <div className="botoes-valores">
                                <button onClick={() => handleValorClick('R$ 1,00')}>R$ 1,00</button>
                                <button onClick={() => handleValorClick('R$ 5,00')}>R$ 5,00</button>
                                <button onClick={() => handleValorClick('R$ 10,00')}>R$ 10,00</button>
                                <button onClick={() => handleValorClick('R$ 50,00')}>R$ 50,00</button>
                                <button onClick={() => handleValorClick('R$ 100,00')}>R$ 100,00</button>
                                <button onClick={handleOutroClick}>OUTRO</button>
                            </div>
                            {mostrarCampoOutro && (
                                <input
                                    className="campo-outro"
                                    value={valorOutro}
                                    onChange={handleOutroChange}
                                    ref={inputRef}
                                />
                            )}
                        </div>
                    </div>

                    <div className="doacao-valor-resumo">
                        <h2>Resumo</h2>
                        <div className="resumo-linha"></div>
                        <div className="resumo-valor">
                            <span>Valor Doado:</span> <span>{valorSelecionado}</span>
                        </div>
                        <button className="botao-pagamento" onClick={handleIrParaPagamento}>
                            Ir para Pagamento
                        </button>
                    </div>
                </div>
            )}
            {etapa === 'pagamento' && (
                <div className={`pagamento ${metodoPagamento === 'Cartão' ? 'pagamento-expandido' : ''}`}>
                    <div className={`pagamento-opcoes ${metodoPagamento === 'Cartão' ? 'pagamento-expandido' : ''}`}>
                    <div className={`opcao-pagamento ${metodoPagamento === 'Cartão' ? 'ativo' : ''}`} onClick={() => selecionarMetodo('Cartão')}>
                        <h3>Cartões de crédito</h3>

                        {metodoPagamento === 'Cartão' ? (
                            <div className="form-cartao">
                            <div className="linha-input">
                                <label>Número do cartão</label>
                                <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} />
                            </div>

                            <div className="linha-input">
                                <label>Nome no cartão</label>
                                <input type="text" placeholder="Seu Nome" />
                            </div>

                            <div className="linha-grupo">
                                <div className="grupo-item">
                                <label>Número do cartão</label>
                                <input type="text" placeholder="0000" maxLength={4} />
                                </div>

                                <div className="grupo-item">
                                <label>Número do cartão</label>
                                <input type="text" placeholder="0000" maxLength={4} />
                                </div>

                                <div className="grupo-item">
                                <label>Código de segurança (CVV)</label>
                                <input type="text" placeholder="123" maxLength={4} />
                                </div>
                            </div>

                            <button className="botao-adicionar">Adicionar</button>
                            </div>
                        ) : (
                            <p className="mensagem-pagamento">Pagamento com cartão de crédito</p>
                        )}
                        </div>
                        <div className={`opcao-pagamento ${metodoPagamento === 'Boleto' ? 'ativo' : ''}`} onClick={() => selecionarMetodo('Boleto')}>
                            <h3>Boleto</h3>
                            <p>Vencimento em 1 dia útil. A data de entrega será alterada devido ao tempo de processamento do Boleto.</p>
                        </div>

                        <div className={`opcao-pagamento ${metodoPagamento === 'Pix' ? 'ativo' : ''}`} onClick={() => selecionarMetodo('Pix')}>
                            <h3>Pix</h3>
                            <p>O código Pix gerado para o pagamento é válido por 30 minutos após a finalização do pedido.</p>
                        </div>
                    </div>

                    <div className="pagamento-resumo">
                        <h2>Resumo</h2>
                        <div className="resumo-linha"></div>
                        <div className="resumo-valor">
                            <span>Valor Doado:</span> <span>{valorSelecionado}</span>
                        </div>
                        <div className="resumo-valor">
                            <span>Método:</span> <span><strong>{metodoPagamento}</strong></span>
                        </div>
                        <button className="botao-concluir">Concluir</button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default Doacao;
