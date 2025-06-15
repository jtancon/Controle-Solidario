import './doacao.css';
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import api from "../../../services/api";

function Doacao() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Estados do formulário
    const [etapa, setEtapa] = useState('doacao');
    const [valorOutro, setValorOutro] = useState('R$ 0,00');
    const [valorSelecionado, setValorSelecionado] = useState('R$ 0,00');
    const [mostrarCampoOutro, setMostrarCampoOutro] = useState(false);
    const [metodoPagamento, setMetodoPagamento] = useState('Cartão');
    const inputRef = useRef(null);
    
    // Estados de dados e UX
    const [dadosOng, setDadosOng] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        // ✅ ALTERAÇÃO: Busca o 'name' da URL em vez do 'email'.
        const ongName = searchParams.get("name");

        if (!ongName) {
            setError("Nenhuma ONG foi especificada na URL.");
            setLoading(false);
            return;
        }

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setError("Você precisa estar logado para realizar uma doação.");
                setLoading(false);
                return;
            }
            
            setUserEmail(user.email);

            // Função para buscar os dados da ONG pelo nome
            const fetchOngData = async () => {
                try {
                    // ✅ ALTERAÇÃO: Chama o endpoint /by-name/{nome}
                    const res = await api.get(`/usuarios/by-name/${ongName}`);
                    setDadosOng(res.data);
                } catch (err) {
                    console.error("Erro ao buscar dados da ONG pelo nome:", err);
                    if (err.response && err.response.status === 404) {
                       // Decodifica o nome para exibi-lo corretamente na mensagem de erro
                       setError(`Não foi possível encontrar uma ONG com o nome "${decodeURIComponent(ongName)}".`);
                    } else {
                       setError("Não foi possível carregar os dados da ONG. Tente novamente mais tarde.");
                    }
                } finally {
                    setLoading(false);
                }
            };
            
            fetchOngData();
        });

        return () => unsubscribe();
    }, [searchParams]);

    // Funções de manipulação do formulário
    const handleValorClick = (valor) => { setMostrarCampoOutro(false); setValorSelecionado(valor); };
    const handleOutroClick = () => { setMostrarCampoOutro(true); setValorSelecionado(valorOutro); setTimeout(() => inputRef.current?.focus(), 0); };
    const handleOutroChange = (e) => { let value = e.target.value.replace(/\D/g, '').padStart(3, '0'); const reais = value.slice(0, -2); const centavos = value.slice(-2); const formatado = `R$ ${parseInt(reais, 10)},${centavos}`; setValorOutro(formatado); setValorSelecionado(formatado); };
    const handleIrParaPagamento = () => { if (valorSelecionado === 'R$ 0,00') { alert("Por favor, selecione um valor para doar."); return; } setEtapa('pagamento'); };
    const selecionarMetodo = (metodo) => setMetodoPagamento(metodo);
    
    // Função para registrar a doação
    const registrarDoacao = async () => { if (!userEmail || !dadosOng?.email || valorSelecionado === "R$ 0,00") { alert("Um erro ocorreu. Verifique se o valor da doação é válido."); 
        return; } const payload = { idDoador: userEmail, idOng: dadosOng.email, valor: parseFloat(valorSelecionado.replace("R$ ", "").replace(",", ".")), descricao: `Doação para ${dadosOng.nome}`, tipo: metodoPagamento }; 
        try { await api.post("/doacoes", payload); setMostrarModal(true); } 
        catch (error) { console.error("❌ Erro ao registrar doação:", error); alert("Erro ao concluir a doação."); } };

    if (loading) {
        return (
            <>
                <NavbarDoador />
                <div style={{ textAlign: 'center', marginTop: '50px' }}><h1>Carregando...</h1></div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavbarDoador />
                <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
                    <h1>Erro!</h1>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')}>Voltar para a página inicial</button>
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarDoador />
            <div className="doacao">
                {etapa === 'doacao' && dadosOng && (
                    <div className="doacao-valor">
                        <div className="doacao-valor-dados">
                            <div className="dados-ong">
                                <img src={dadosOng.fotoPerfil || "src/assets/ONGS.png"} alt="Logo ONG" className="logo-ong" />
                                <h3>{dadosOng.nome}</h3>
                                <p>{dadosOng.descricao || "Esta ONG não possui uma descrição."}</p>
                            </div>
                            <div className="dados-valores">
                                <h3>Selecione o valor da Doação</h3>
                                <div className="botoes-valores">
                                    {["R$ 1,00", "R$ 5,00", "R$ 10,00", "R$ 50,00", "R$ 100,00"].map(v => (
                                        <button key={v} onClick={() => handleValorClick(v)}>{v}</button>
                                    ))}
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
                              {metodoPagamento === 'Cartão' && (
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
                                              <label>Validade</label>
                                              <input type="text" placeholder="MM/AA" maxLength={5} />
                                          </div>
                                          <div className="grupo-item">
                                              <label>CVV</label>
                                              <input type="text" placeholder="123" maxLength={4} />
                                          </div>
                                      </div>
                                      <button className="botao-adicionar">Adicionar</button>
                                  </div>
                              )}
                          </div>
                          <div className={`opcao-pagamento ${metodoPagamento === 'Boleto' ? 'ativo' : ''}`} onClick={() => selecionarMetodo('Boleto')}>
                              <h3>Boleto</h3>
                              <p>Vencimento em 1 dia útil.</p>
                          </div>
                          <div className={`opcao-pagamento ${metodoPagamento === 'Pix' ? 'ativo' : ''}`} onClick={() => selecionarMetodo('Pix')}>
                              <h3>Pix</h3>
                              <p>O código Pix gerado é válido por 30 minutos após a finalização.</p>
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
                         <button
                             className="botao-concluir"
                             onClick={registrarDoacao}
                         >
                             Concluir Doação de {valorSelecionado}
                         </button>
                       </div>
                    </div>
                )}

                {mostrarModal && (
                    <div className="overlay">
                        <div className="modal">
                            <h2>Doação realizada com sucesso!</h2>
                            <p>Obrigado pela sua contribuição.</p>
                            <button onClick={() => {
                                setMostrarModal(false);
                                navigate("/");
                            }}>
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
export default Doacao;
