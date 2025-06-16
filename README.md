**📌Controle Solidário (CS)**

Sistema web para conectar doadores e ONGs, facilitando doações, gestão de ações sociais e visualização de dashboards.

---

Sumário

- Descrição
- Funcionalidades
- Tecnologias Utilizadas
- Instalação e Configuração
- Como Rodar
- API Endpoints
- Estrutura do Projeto
- Contribuições
- Licença

---

Descrição

O Controle Solidário é uma plataforma que conecta pessoas dispostas a doar com ONGs que desenvolvem ações sociais reais. O sistema permite:

- Cadastro e autenticação de usuários (doador ou ONG).
- Visualização e administração de ações sociais.
- Realização de doações com diferentes métodos de pagamento.
- Dashboard com gráficos e relatórios para ONGs.
- Histórico de doações para doadores.

---

Funcionalidades

- Autenticação via Firebase Authentication.
- Consulta e cadastro de doações via API REST em Kotlin + Firestore.
- Gestão de ações da ONG com CRUD completo.
- Dashboard gráfico com Recharts para análise mensal e por tipo de doação.
- Pesquisa e filtro avançado em listas.
- Interface responsiva com React.

---

Tecnologias Utilizadas

Frontend

- React 18
- React Router Dom
- Axios (para requisições API)
- Firebase (Auth + Firestore)
- Recharts (Gráficos)
- CSS Modules / CSS Puro

Backend

- Kotlin
- Spring Boot
- Google Cloud Firestore
- Jackson (serialização/deserialização JSON)

---

Instalação e Configuração

Backend

1. Configure seu projeto Kotlin Spring Boot.
2. Adicione credenciais Firebase no arquivo firebase-key.json (não commitado).
3. Ajuste application.properties com URL da API e credenciais.
4. Rode o backend via ./gradlew bootRun ou na IDE.

Frontend

1. Instale dependências:
npm install

2. Configure arquivo src/services/api.js com a baseURL da sua API (ex: http://localhost:8080/api).

3. Configure Firebase no arquivo src/services/firebaseconfig.js.

4. Rode o frontend:
npm run dev

---

API Endpoints principais

Método | Endpoint               | Descrição
--------|------------------------|-------------------------------
GET     | /api/doacoes           | Lista todas doações
POST    | /api/doacoes           | Cria uma nova doação
GET     | /api/doacoes/ong/{id}  | Lista doações filtradas por ONG
GET     | /api/doacoes/doador/{id}| Lista doações filtradas por doador
PUT     | /api/acoes/{id}        | Atualiza ação
DELETE  | /api/acoes/{id}        | Deleta ação
GET     | /api/acoes/ong/{id}    | Lista ações da ONG

---

Estrutura do projeto

/Backend
  /src
    /controller
    /model
    /rest
    /service
    /resources/firebase-key.json (não commitado)
/Frontend
  /src
    /components
      /AdminONG
      /Dashboard
      /Doacao
      /HistoricoDoacao
      /Navbar_Footer
    /services
      api.js
      firebaseconfig.js
    App.jsx

---

FIGMA: https://www.figma.com/design/S5qm9svlHMrn1Ay6sIZb0C/Figma-basics?node-id=2029-70&t=G8b3wEaXIUFkba88-1

Kanban: https://trello.com/invite/6448646d80f76b8474ee9c47/ATTI8016e44e4197b35aa85a8d6eddb30a69D55A13ED
