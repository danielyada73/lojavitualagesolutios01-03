# Mercado Livre API – Starter

## Setup
1. `cp .env.example .env` e preencha `ML_CLIENT_ID`, `ML_CLIENT_SECRET`, `ML_REDIRECT_URI`.
2. `npm i`
3. `npm run dev`

## Fluxo de testes
- Abra `http://localhost:3000/auth/ml` → faça o login/consent → será redirecionado para `/auth/ml/callback` e verá os tokens.
- Veja tokens (e auto-refresh): `GET /auth/ml/tokens`

## Endpoints úteis

### Concorrentes (público)
- `GET /search-competitors?q=creatina&limit=50&pages=2`
  - Retorna `items[]` + `stats` (média, mediana, etc.) com base em `price`.
- `GET /items/MLB123456789`
  - Detalhes públicos de um item.

### Seus itens (privado)
- `GET /me` → dados do seu usuário autenticado.
- `GET /my-items?limit=20` → lista IDs e puxa detalhes dos seus primeiros N itens.

### “Abertura” (visitas)
- `GET /visits?item_id=MLB123&from=2025-01-01&to=2025-01-31`
  - Visitas do anúncio no período.

### Webhooks (opcional)
- Configure `POST /webhooks/ml` no app do ML e trate eventos (orders/items/shipments).

## Observações
- Dados **de concorrentes**: preços e specs são públicos via `/sites/MLB/search` e `/items/{id}`.
- Métricas **de visitas** e **de Ads**: apenas dos **seus** anúncios/contas.
- Em produção, troque o `tokenStore` por DB/Redis e implemente retries/rate-limits.
