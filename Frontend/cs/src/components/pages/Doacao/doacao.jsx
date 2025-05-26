import './doacao.css';
import NavbarDoador from "../../Navbar_Footer/NavbarDoador";
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import api from "../../../services/api"; // usa a baseURL da API Kotlin

function Doacao() {
  const [etapa, setEtapa] = useState('doacao');
  const [valorOutro, setValorOutro] = useState('R$ 0,00');
  const [valorSelecionado, setValorSelecionado] = useState('R$ 0,00');
  const [mostrarCampoOutro, setMostrarCampoOutro] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState('Cartão');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ongId = searchParams.get("id");
  const [dadosOng, setDadosOng] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const buscarOng = async () => {
      if (ongId) {
        try {
          const res = await api.get(`/usuarios/${ongId}`);
          setDadosOng(res.data);
        } catch (err) {
          console.error("Erro ao buscar ONG:", err);
          setDadosOng(null);
        }
      }
    };
    buscarOng();
  }, [ongId]);

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
    let value = e.target.value.replace(/\D/g, '');
    value = value.padStart(3, '0');
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

  const registrarDoacao = async () => {
  if (!userId || !ongId || !valorSelecionado || valorSelecionado === "R$ 0,00") {
    alert("Usuário, ONG ou valor inválido.");
    return;
  }

  const payload = {
  idDoador: userId,
  idOng: ongId,
  valor: parseFloat(valorSelecionado.replace("R$ ", "").replace(",", ".")),
  descricao: dadosOng?.descricao || "",
  tipo: metodoPagamento
};
  console.log("🟢 Enviando doação:", payload); // deve mostrar tudo correto

  try {
    await api.post("/doacoes", payload);
    navigate("/");
  } catch (error) {
    console.error("❌ Erro ao registrar doação:", error);
    alert("Erro ao concluir a doação.");
  }
};
console.log("userId:", userId);
console.log("ongId:", ongId);
console.log("valor:", valorSelecionado);


  return (
    <>
      <NavbarDoador />
      <div className="doacao">
        {etapa === 'doacao' && (
          <div className="doacao-valor">
            <div className="doacao-valor-dados">
              <div className="dados-ong">
                <img src={dadosOng?.fotoPerfil || "src/assets/ONGS.png"} alt="Logo ONG" className="logo-ong" />
                <p>{dadosOng?.descricao || "Esta organização ainda não possui uma descrição cadastrada."}</p>
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
              disabled={!userId || !ongId || valorSelecionado === "R$ 0,00"}
            >
              Concluir
            </button>

            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Doacao;
