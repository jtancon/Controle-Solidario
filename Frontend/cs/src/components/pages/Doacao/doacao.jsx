import './doacao.css';
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import api from "../../../services/api";

function Doacao() {
    // Estados do formulário
    const [etapa, setEtapa] = useState('doacao');
    const [valorOutro, setValorOutro] = useState('R$ 0,00');
    const [valorSelecionado, setValorSelecionado] = useState('R$ 0,00');
    const [mostrarCampoOutro, setMostrarCampoOutro] = useState(false);
    const [metodoPagamento, setMetodoPagamento] = useState('Cartão');
    const inputRef = useRef(null);
    const navigate = useNavigate();
    
    // Estados para controle de dados e UX
    const [searchParams] = useSearchParams();
    const [dadosOng, setDadosOng] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ Estado de carregamento
    const [error, setError] = useState(null);     // ✅ Estado para tratar erros

    // ✅ Lógica de busca de dados centralizada e robusta
    useEffect(() => {
        const ongEmail = searchParams.get("email");

        if (!ongEmail) {
            setError("Nenhuma ONG foi especificada na URL.");
            setLoading(false);
            return;
        }

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserEmail(user.email);
                // Usuário está logado, agora busca os dados da ONG
                try {
                    const res = await api.get(`/usuarios/${ongEmail}`);
                    setDadosOng(res.data);
                } catch (err) {
                    console.error("Erro ao buscar dados da ONG:", err);
                    setError("Não foi possível carregar os dados da ONG. Tente novamente mais tarde.");
                } finally {
                    // Termina o carregamento, com sucesso ou erro
                    setLoading(false);
                }
            } else {
                // Usuário não está logado
                setError("Você precisa estar logado para realizar uma doação.");
                setLoading(false);
            }
        });

        // Limpa o listener ao desmontar o componente
        return () => unsubscribe();
    }, [searchParams]); // Depende de searchParams para reavaliar se a URL mudar

    // Funções de manipulação do formulário (sem alterações)
    const handleValorClick = (valor) => {
        setMostrarCampoOutro(false);
        setValorSelecionado(valor);
    };
    const handleOutroClick = () => {
        setMostrarCampoOutro(true);
        setValorSelecionado(valorOutro);
        setTimeout(() => inputRef.current?.focus(), 0);
    };
    const handleOutroChange = (e) => {
        let value = e.target.value.replace(/\D/g, '').padStart(3, '0');
        const reais = value.slice(0, -2);
        const centavos = value.slice(-2);
        const formatado = `R$ ${parseInt(reais, 10)},${centavos}`;
        setValorOutro(formatado);
        setValorSelecionado(formatado);
    };
    const handleIrParaPagamento = () => {
        if (valorSelecionado === 'R$ 0,00') {
            alert("Por favor, selecione um valor para doar.");
            return;
        }
        setEtapa('pagamento');
    };
    const selecionarMetodo = (metodo) => setMetodoPagamento(metodo);

    // Função de registro da doação (sem alterações)
    const registrarDoacao = async () => {
        if (!userEmail || !dadosOng?.email || valorSelecionado === "R$ 0,00") {
            alert("Um erro ocorreu. Verifique se o valor da doação é válido.");
            return;
        }
        const payload = {
            idDoador: userEmail,
            idOng: dadosOng.email,
            valor: parseFloat(valorSelecionado.replace("R$ ", "").replace(",", ".")),
            descricao: `Doação para ${dadosOng.nome}`,
            tipo: metodoPagamento
        };
        try {
            await api.post("/doacoes", payload);
            alert("Doação realizada com sucesso! Obrigado.");
            navigate("/");
        } catch (error) {
            console.error("❌ Erro ao registrar doação:", error);
            alert("Erro ao concluir a doação.");
        }
    };
    
    // ✅ Bloco de renderização condicional para uma melhor UX
    if (loading) {
        return (
            <>
                <NavbarDoador />
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h1>Carregando...</h1>
                </div>
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
                {/* O restante do seu JSX para as etapas de doação e pagamento permanece aqui */}
                {/* Exemplo da primeira etapa: */}
                {etapa === 'doacao' && (
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
                
                {/* Bloco de pagamento (continua igual) */}
                {etapa === 'pagamento' && (
                  <div className={`pagamento ${metodoPagamento === 'Cartão' ? 'pagamento-expandido' : ''}`}>
                    {/* ... seu código do formulário de pagamento ... */}
                    <div className="pagamento-resumo">
                      {/* ... */}
                      <button
                          className="botao-concluir"
                          onClick={registrarDoacao}
                      >
                          Concluir Doação de {valorSelecionado}
                      </button>
                    </div>
                  </div>
                )}
            </div>
        </>
    );
}

export default Doacao;