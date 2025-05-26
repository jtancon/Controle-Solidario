import { useEffect, useState } from "react";
import api from "../../../services/api"; // ajuste o caminho se necessário

function ExemploUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    api.get("/usuarios")
      .then((response) => {
        console.log("Usuários:", response.data);
        setUsuarios(response.data); // armazena no estado
      })
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
      });
  }, []);

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {Object.entries(usuarios).map(([id, user]) => (
          <li key={id}>{user.nome} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default ExemploUsuarios;
