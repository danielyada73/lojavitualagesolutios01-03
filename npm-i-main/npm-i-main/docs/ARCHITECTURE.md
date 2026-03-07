# Architecture

## Componentes principais

## Backend

- Entrypoint: `backend/src/server.js`
- Middleware base: JSON body parser, CORS, request logger, 404 e error handler.
- Rotas por dominio em `backend/src/routes/*`:
  - Auth: `auth.js`, `authLocal.js`, `authOthers.js`
  - Operacao: `catalog.js`, `orders.js`, `questions.js`, `visits.js`
  - Planejamento e financeiro: `dashboard.js`, `costs.js`, `ads.js`
  - Logistica e estoque: `logistics.js`, `stock.js`
  - Suporte: `health.js`, `mlDiag.js`, `accounts.js`, `public.js`, `private.js`
- Integracao externa:
  - `backend/src/meliApi.js` (OAuth token exchange/refresh e axios autenticado)
  - `backend/src/providers/*` (provedor ML)
- Persistencia atual (file based):
  - `backend/data/tokens.json`, `backend/data/costs.json`
  - `backend/src/storage/movements.json`, `backend/src/storage/ads_spend.json`

## Frontend

- Entrypoint: `frontend/src/main.jsx`
- Router: `frontend/src/router.jsx`
- Camadas:
  - Paginas de dominio em `frontend/src/pages/*`
  - Componentes de layout/UI em `frontend/src/components/*`
  - Cliente API e utilitarios em `frontend/src/lib/*`
- Cliente HTTP:
  - `frontend/src/lib/api.js` centraliza `API_BASE`, endpoints e funcoes de fetch/mutate.

## Fluxo principal de dados

1. Usuario interage com pagina React (ex.: Orders, Dashboard, Catalog).
2. Pagina chama funcao em `frontend/src/lib/api.js`.
3. Requisicao HTTP chega na rota correspondente do backend.
4. Rota backend valida params e decide fonte de dados:
   - API Mercado Livre via token OAuth, e/ou
   - arquivos JSON locais.
5. Backend agrega/normaliza resposta e devolve JSON para o frontend.
6. Front renderiza cards, tabelas e graficos.

## Fluxo OAuth Mercado Livre

1. Front abre `GET /auth/ml`.
2. Backend cria `state` + PKCE, redireciona para ML.
3. ML retorna em `/auth/ml/callback?code=...&state=...`.
4. Backend troca `code` por tokens e salva em `tokenStore` (arquivo JSON).
5. Rotas privadas usam `refreshIfNeeded()` para garantir token valido antes de chamar ML.

## Diagrama ASCII

```text
+-------------------+           HTTP            +-----------------------+
|   React Frontend  |  ---------------------->  |   Express Backend     |
| pages/components  |                           | routes + middlewares  |
+---------+---------+                           +-----------+-----------+
          |                                                 |
          | uses                                            | uses
          v                                                 v
+-------------------+                           +-----------------------+
| lib/api.js        |                           | meliApi/providers     |
| axios client      |                           | axios auth + refresh  |
+-------------------+                           +-----------+-----------+
                                                              |
                                                              | HTTPS
                                                              v
                                                   +-----------------------+
                                                   | Mercado Livre API     |
                                                   | auth, orders, items   |
                                                   +-----------------------+

                    +-----------------------------------------------+
                    | Local JSON storage (dev)                      |
                    | data/tokens.json, data/costs.json,            |
                    | storage/movements.json, storage/ads_spend.json|
                    +-----------------------------------------------+
```

## Variaveis de ambiente (mapa rapido)

Backend (`backend/.env`):

- `PORT`, `DASHBOARD_ORIGIN`, `NODE_ENV`, `SERVICE_NAME`, `APP_VERSION`
- `ML_CLIENT_ID`, `ML_CLIENT_SECRET`, `ML_REDIRECT_URI`, `ML_AUTH_HOST`
- `DEFAULT_USER_ID`, `DISABLE_STATE_CHECK`
- `JWT_SECRET`, `JWT_EXPIRES_IN`

Frontend (`frontend/.env.development`):

- `VITE_API_URL`, `VITE_APP_VERSION`

## Build/test/lint (estado atual)

- Backend scripts: apenas `dev`.
- Frontend scripts: `dev`, `build`, `lint`, `preview`.
- Nao ha suite de testes automatizados configurada no repo.
