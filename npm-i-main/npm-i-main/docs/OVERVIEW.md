# Overview

## Objetivo do projeto

Aplicacao fullstack para operacao de seller em marketplace (foco em Mercado Livre).

- Backend (`backend`): API Express para auth, catalogo, pedidos, visitas, perguntas, logistica, estoque, custos e dashboard.
- Frontend (`frontend`): painel React que consome a API e exibe visoes operacionais.

## Como rodar localmente

Pre requisitos:

- Node.js
- npm

Backend:

```powershell
cd backend
npm install
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Endpoints locais esperados:

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Entrypoints

- Backend: `backend/src/server.js`
- Frontend: `frontend/src/main.jsx`
- Router frontend: `frontend/src/router.jsx`

## Referencias

- Arquitetura detalhada: `docs/ARCHITECTURE.md`
- Backlog de melhorias: `docs/IMPROVEMENTS.md`