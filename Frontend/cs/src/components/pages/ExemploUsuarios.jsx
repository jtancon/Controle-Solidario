// src/components/pages/useEffect.jsx

import { useEffect, useState } from "react";
import api from "../../services/api";

function ExemploUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    api.get("/usuarios")
      .then((response) => {
        console.log("Tipo de dados:", typeof response.data);
        console.log("Conteúdo da resposta:", response.data);
        const data = response.data;

        // Garante que seja um array
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else if (typeof data === "object") {
          const lista = Object.values(data);
          setUsuarios(lista);
        } else {
          console.warn("Formato de resposta inesperado");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
      });
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Lista de Usuários</h2>
      <p>Total de usuários carregados: {usuarios.length}</p>
      <ul>
        {usuarios.map((user, index) => (
          <li key={user.uid || index}>
            {user.nome || user.nomeCompleto || "Sem nome"} - {user.email || "Sem email"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExemploUsuarios;
