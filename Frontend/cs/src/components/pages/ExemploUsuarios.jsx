// src/components/pages/useEffect.jsx
import { useEffect, useState } from "react";
// ✅ CORREÇÃO: Nova tentativa de ajustar o caminho da API.
// Este caminho assume que a pasta 'services' está dentro de 'src/'.
// Se este caminho ainda der erro, por favor, verifique a localização exata do seu arquivo `api.js` e ajuste o caminho.
// Lembre-se:
//   '../' sobe um nível de diretório.
//   '../../' sobe dois níveis.
// Do arquivo atual (useEffect.jsx), você precisa "subir" até a pasta 'src' e então "descer" para 'services'.
import api from "../../services/api";

function ExemploUsuarios() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para os inputs de busca
  const [nomeBusca, setNomeBusca] = useState("");
  const [emailBusca, setEmailBusca] = useState("");

  // Função para limpar estados e preparar para uma nova chamada
  const prepararChamada = () => {
    setLoading(true);
    setError(null);
    setResultados([]); // Limpa resultados anteriores
  };

  // Função para testar: listarTodosUsuarios()
  const handleListarTodos = async () => {
    prepararChamada();
    try {
      console.log("1. [TESTE] Buscando TODOS os dados em /usuarios...");
      const response = await api.get("/usuarios");
      console.log("2. [TESTE] DADOS BRUTOS RECEBIDOS:", response.data);
      
      if (Array.isArray(response.data)) {
        setResultados(response.data);
      } else {
        // Se não for um array, converte para um para exibição
        setResultados(Object.values(response.data));
      }

    } catch (err) {
      console.error("ERRO [Listar Todos]:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para testar: buscarUsuarioPorNome()
  const handleBuscaPorNome = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página pelo form
    if (!nomeBusca) return; // Não faz a busca se o campo estiver vazio
    prepararChamada();
    try {
      console.log(`1. [TESTE] Buscando por NOME: ${nomeBusca}...`);
      // A URL usa `encodeURIComponent` para garantir que nomes com espaços ou caracteres especiais funcionem.
      const response = await api.get(`/usuarios/by-name/${encodeURIComponent(nomeBusca)}`);
      console.log("2. [TESTE] DADO RECEBIDO:", response.data);
      setResultados([response.data]); // Coloca o resultado único em um array para renderizar
    } catch (err) {
      console.error(`ERRO [Buscar por Nome: ${nomeBusca}]:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Função para testar: buscarUsuarioPorEmail()
  const handleBuscaPorEmail = async (e) => {
    e.preventDefault();
    if (!emailBusca) return;
    prepararChamada();
    try {
      console.log(`1. [TESTE] Buscando por EMAIL: ${emailBusca}...`);
      const response = await api.get(`/usuarios/${emailBusca}`);
      console.log("2. [TESTE] DADO RECEBIDO:", response.data);
      setResultados([response.data]);
    } catch (err) {
      console.error(`ERRO [Buscar por Email: ${emailBusca}]:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Renderização do componente
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: "center", borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        Página de Teste da API de Usuários
      </h1>

      {/* --- Seção de Testes --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        
        {/* Teste Listar Todos */}
        <div>
          <h3>1. Testar `listarTodosUsuarios`</h3>
          <p>Clica no botão para buscar todos os usuários da API.</p>
          <button onClick={handleListarTodos} style={buttonStyle}>
            Listar Todos
          </button>
        </div>

        {/* Teste Buscar por Nome */}
        <div>
          <h3>2. Testar `buscarUsuarioPorNome`</h3>
          <p>Esta busca usa o campo `nome` do seu banco de dados.</p>
          <form onSubmit={handleBuscaPorNome}>
            <input 
              type="text" 
              value={nomeBusca}
              onChange={(e) => setNomeBusca(e.target.value)}
              placeholder="Digite o nome para buscar"
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Buscar por Nome</button>
          </form>
        </div>

        {/* Teste Buscar por Email */}
        <div>
          <h3>3. Testar `buscarUsuarioPorEmail`</h3>
          <form onSubmit={handleBuscaPorEmail}>
            <input 
              type="email" 
              value={emailBusca}
              onChange={(e) => setEmailBusca(e.target.value)}
              placeholder="Digite o email para buscar"
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Buscar por Email</button>
          </form>
        </div>
      </div>

      <hr style={{ margin: '30px 0' }}/>

      {/* --- Seção de Resultados --- */}
      <div>
        <h2 style={{ textAlign: 'center' }}>Resultados</h2>
        {loading && <p style={{ textAlign: 'center' }}>Carregando...</p>}
        {error && (
          <div style={{ color: 'red', textAlign: 'center', border: '1px solid red', padding: '10px' }}>
            <strong>Ocorreu um erro!</strong>
            <p>{error.message}</p>
            <p>Se o erro for 404, significa que o item não foi encontrado.</p>
            <p>Verifique o console (F12) do navegador e do seu backend para mais detalhes.</p>
          </div>
        )}
        {!loading && !error && (
          resultados.length > 0 ? (
            <>
              <p><strong>{resultados.length} resultado(s) encontrado(s):</strong></p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {resultados.map((user, index) => (
                  <li key={user.nome || user.email || index} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '5px', borderRadius: '5px' }}>
                    <strong>Nome:</strong> {user.nome || "Não informado"} <br/>
                    <strong>Email:</strong> {user.email || "Não informado"} <br/>
                    <strong>Classificação:</strong> {user.classificacao || "Não informada"} <br/>
                    <strong>Descrição:</strong> {user.descricao || "Não informada"}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>Nenhum resultado para exibir. Realize uma busca.</p>
          )
        )}
      </div>
    </div>
  );
}

// Estilos para os botões e inputs para melhor aparência
const buttonStyle = {
  padding: '10px 15px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '10px'
};

const inputStyle = {
  padding: '10px',
  width: 'calc(100% - 150px)',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

export default ExemploUsuarios;
