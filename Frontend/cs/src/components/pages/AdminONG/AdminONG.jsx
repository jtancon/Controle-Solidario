import './AdminONG.css';

function AdminONG() {
  const beneficiarios = [
    { ID: 1, OngID: 101, Nome: "Maria Silva", CPF: "123.456.789-00", Telefone: "(11) 99999-0000", Endereco: "Rua das Flores, 123", Observacoes: "Precisa de cesta básica" },
    { ID: 2, OngID: 102, Nome: "João Santos", CPF: "987.654.321-00", Telefone: "(21) 98888-1234", Endereco: "Av. Brasil, 456", Observacoes: "Acompanhamento médico" },
    { ID: 3, OngID: 103, Nome: "Carla Souza", CPF: "654.321.987-00", Telefone: "(31) 98888-5678", Endereco: "Rua Minas, 234", Observacoes: "Cadastro novo" },
    { ID: 4, OngID: 104, Nome: "Pedro Lima", CPF: "321.654.987-00", Telefone: "(41) 97777-9999", Endereco: "Alameda das Rosas, 56", Observacoes: "Visita agendada" },
    { ID: 5, OngID: 105, Nome: "Luciana Rocha", CPF: "159.753.486-22", Telefone: "(51) 96666-8888", Endereco: "Rua Porto Alegre, 78", Observacoes: "Família com 3 filhos" },
    { ID: 6, OngID: 106, Nome: "Felipe Andrade", CPF: "852.741.963-00", Telefone: "(61) 95555-4444", Endereco: "SQN 205, Brasília", Observacoes: "Ajuda com aluguel" },
    { ID: 7, OngID: 107, Nome: "Bruna Carvalho", CPF: "951.357.258-00", Telefone: "(71) 93333-2222", Endereco: "Av. Salvador, 123", Observacoes: "Gestante" },
    { ID: 8, OngID: 108, Nome: "Marcelo Torres", CPF: "456.789.123-00", Telefone: "(85) 94444-1111", Endereco: "Rua Ceará, 99", Observacoes: "Doação de roupa" },
    { ID: 9, OngID: 109, Nome: "Renata Dias", CPF: "741.852.963-00", Telefone: "(95) 92222-3333", Endereco: "Travessa Esperança, 15", Observacoes: "Reabilitação" },
    { ID: 10, OngID: 110, Nome: "Diego Martins", CPF: "963.852.741-00", Telefone: "(81) 91111-0000", Endereco: "Vila Nova, 101", Observacoes: "Cadastro incompleto" }
  ];
  const doacoes = [
    { ID: 1, DoadorID: 11, OngID: "101", Valor: 150.00, Data: "2025-05-04", Descricao: "Ajuda para medicamentos", Tipo: "PIX" },
    { ID: 2, DoadorID: 12, OngID: "102", Valor: 200.00, Data: "2025-05-03", Descricao: "Doação para alimentos", Tipo: "Cartão" },
    { ID: 3, DoadorID: 13, OngID: "103", Valor: 100.00, Data: "2025-05-02", Descricao: "Ajuda emergencial", Tipo: "PIX" },
    { ID: 4, DoadorID: 14, OngID: "104", Valor: 500.00, Data: "2025-05-01", Descricao: "Mensalidade fixa", Tipo: "Transferência" },
    { ID: 5, DoadorID: 15, OngID: "105", Valor: 75.00, Data: "2025-04-30", Descricao: "Ajuda para transporte", Tipo: "PIX" },
    { ID: 6, DoadorID: 16, OngID: "106", Valor: 350.00, Data: "2025-04-29", Descricao: "Campanha de inverno", Tipo: "Boleto" },
    { ID: 7, DoadorID: 17, OngID: "107", Valor: 420.00, Data: "2025-04-28", Descricao: "Investimento em estrutura", Tipo: "PIX" }
  ];
  const acoes = [
    { ID: 1, OngID: 101, Titulo: "Campanha do Agasalho", Descricao: "Arrecadação de roupas de inverno", DataInicio: "2025-05-01", DataFim: "2025-06-01", Status: "Em andamento" },
    { ID: 2, OngID: 102, Titulo: "Cesta Básica Mensal", Descricao: "Distribuição mensal de cestas", DataInicio: "2025-04-10", DataFim: "2025-12-10", Status: "Ativa" },
    { ID: 3, OngID: 103, Titulo: "Consulta Gratuita", Descricao: "Ação médica para a comunidade", DataInicio: "2025-03-01", DataFim: "2025-03-15", Status: "Encerrada" },
    { ID: 4, OngID: 104, Titulo: "Natal Solidário", Descricao: "Doações e ceia para famílias carentes", DataInicio: "2025-12-01", DataFim: "2025-12-25", Status: "Planejada" },
    { ID: 5, OngID: 105, Titulo: "Feira da Saúde", Descricao: "Atendimentos e exames gratuitos", DataInicio: "2025-09-15", DataFim: "2025-09-30", Status: "Ativa" },
    { ID: 6, OngID: 106, Titulo: "Apoio Psicossocial", Descricao: "Acompanhamento psicológico", DataInicio: "2025-02-01", DataFim: "2025-08-01", Status: "Em andamento" },
    { ID: 7, OngID: 107, Titulo: "Educação Financeira", Descricao: "Workshops para jovens", DataInicio: "2025-06-01", DataFim: "2025-07-01", Status: "Planejada" }
  ];
  
    return (
<div className="AdminONG">
  <div className="tabela">
    <h1 className="titulo">Beneficiários</h1>
    <div className="scroll-area">
      {beneficiarios.map((b, index) => (
        <div className="items" key={index}>
          <div className="info-box">
            <div className="info"><strong>ID:</strong> {b.ID}</div>
            <div className="info"><strong>OngID:</strong> {b.OngID}</div>
            <div className="info"><strong>Nome:</strong> {b.Nome}</div>
            <div className="info"><strong>CPF:</strong> {b.CPF}</div>
            <div className="info"><strong>Telefone:</strong> {b.Telefone}</div>
            <div className="info"><strong>Endereço:</strong> {b.Endereco}</div>
            <div className="info full-width"><strong>Observações:</strong> {b.Observacoes}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
  <div className="tabela">
  <h1 className="titulo">Doações</h1>
<div className="scroll-area">
  {doacoes.map((d, index) => (
    <div className="items" key={index}>
      <div className="info-box">
        <div className="info"><strong>ID:</strong> {d.ID}</div>
        <div className="info"><strong>DoadorID:</strong> {d.DoadorID}</div>
        <div className="info"><strong>OngID:</strong> {d.OngID}</div>
        <div className="info"><strong>Valor:</strong> R$ {d.Valor}</div>
        <div className="info"><strong>Data:</strong> {d.Data}</div>
        <div className="info"><strong>Tipo:</strong> {d.Tipo}</div>
        <div className="info full-width"><strong>Descrição:</strong> {d.Descricao}</div>
      </div>
    </div>
  ))}
</div>

  </div>
    <div className="tabela">
      <h1 className="titulo">Ações da ONG</h1>
    <div className="scroll-area">
      {acoes.map((a, index) => (
        <div className="items" key={index}>
          <div className="info-box">
            <div className="info"><strong>ID:</strong> {a.ID}</div>
            <div className="info"><strong>OngID:</strong> {a.OngID}</div>
            <div className="info"><strong>Título:</strong> {a.Titulo}</div>
            <div className="info"><strong>Status:</strong> {a.Status}</div>
            <div className="info"><strong>Início:</strong> {a.DataInicio}</div>
            <div className="info"><strong>Fim:</strong> {a.DataFim}</div>
            <div className="info full-width"><strong>Descrição:</strong> {a.Descricao}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
    );
}

export default AdminONG;
