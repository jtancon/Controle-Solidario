import "./CadastroONG.css";
import { useState } from "react";

function CadastroONG() {
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    cep: "",
    endereco: "",
    representante: "",
    telefone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/ongs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("ONG cadastrada com sucesso!");
        setForm({
          nome: "",
          cnpj: "",
          cep: "",
          endereco: "",
          representante: "",
          telefone: "",
        });
      } else {
        alert("Erro ao cadastrar ONG");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="CadastroONG">
      <h1>Cadastro de ONG</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome da ONG</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
        />

        <label htmlFor="cnpj">CNPJ</label>
        <input
          type="text"
          id="cnpj"
          name="cnpj"
          value={form.cnpj}
          onChange={handleChange}
        />

        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          name="cep"
          value={form.cep}
          onChange={handleChange}
        />

        <label htmlFor="endereco">Endereço</label>
        <input
          type="text"
          id="endereco"
          name="endereco"
          value={form.endereco}
          onChange={handleChange}
        />

        <label htmlFor="representante">Representante</label>
        <input
          type="text"
          id="representante"
          name="representante"
          value={form.representante}
          onChange={handleChange}
        />

        <label htmlFor="telefone">Telefone</label>
        <input
          type="text"
          id="telefone"
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
        />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroONG;
