## Overview

This repo contains two separate apps: a backend Node/Express API (`backend/`) and a frontend React/Vite dashboard (`frontend/`). The backend is a starter integration for Mercado Libre's OAuth and API; the frontend consumes those endpoints to show a demo dashboard and mock integrations.

## Quick Start (dev)
- Backend: `cd backend && npm i && cp .env.example .env && npm run dev` (defaults to PORT 3000).
- Frontend: `cd frontend && npm i && npm run dev` (Vite defaults to 5173).
- Health-check: GET [backend/src/server.js](backend/src/server.js#L1) `/health`.

## Architecture (big picture)
- Backend: `backend/src/server.js` wires Express routes in `backend/src/routes/`. Use `backend/src/meliApi.js` to interact with Mercado Libre and `backend/src/tokenStore.js` to persist tokens (currently in-memory).
- Providers: `backend/src/providers` contains provider adapters (entrypoint: [backend/src/providers/index.js](backend/src/providers/index.js#L1)); add new provider adapters here returning `{ items, total }`.
- Frontend: Vite/React app with alias `@` -> `frontend/src` (see [frontend/vite.config.js](frontend/vite.config.js#L1)). Use `frontend/src/lib/api.js` as a centralized axios client.
- Authentication: OAuth PKCE flow implemented in [backend/src/routes/auth.js](backend/src/routes/auth.js#L1). The frontend components open `VITE_API_BASE/auth/ml` to start authorization.

## Core Conventions & Patterns
- Tokens: `saveTokens`, `getTokens`, `isExpired` are in `backend/src/tokenStore.js` and used by `meliApi`. Refresh token handling is critical: Mercado Libre issues a one-time-use refresh token; always call `saveTokens(res.data)` and return the updated tokens (see `refreshIfNeeded`).
- Provider adapters: Accept `params` (limit, offset) and return `{ items, total }`. Example: [backend/src/providers/ml.js](backend/src/providers/ml.js#L1).
- Public vs Authenticated Clients: Use `axiosPublic` (no token) for public ML endpoints and `axiosAuth(access_token)` for authenticated requests.
- Frontend imports: Prefer using the `@` alias to import core libs (e.g., `import { api } from '@/lib/api'`). Some places use relative imports like `../lib/api` — prefer consistent alias usage.

## Dev Flows & Debugging
- OAuth flow: Open the dashboard, click connect (AuthCard), follow Mercado Libre consent. Backend callback at `/auth/ml/callback` swaps `code -> tokens` and stores them in memory. Check tokens: `GET /auth/ml/tokens` (see [backend/src/routes/auth.js](backend/src/routes/auth.js#L1)).
- Useful endpoints for testing: `GET /public/search-competitors?q=...`, `GET /public/items/:id`, `GET /private/me`, `GET /private/my-items`, `GET /visits?item_id=...`.
- If you need a stable test user: set `DEFAULT_USER_ID` in backend `.env` or run OAuth locally and call `GET /auth/ml/tokens` then `GET /private/me`.
- Check console logs in backend for PKCE/STATE messages — the flow uses `pending` map (in-memory) to track PKCE verifiers.

## Environment Variables
- Backend: `ML_CLIENT_ID`, `ML_CLIENT_SECRET`, `ML_REDIRECT_URI`, `PORT`, `DEFAULT_USER_ID`, `DASHBOARD_ORIGIN`
- Frontend: `VITE_API_BASE` used widely across the UI (note: `frontend/src/lib/api.js` references `VITE_API_URL`; stick to `VITE_API_BASE` as `.env.development` uses it).

## Where to Add Features
- Add backend endpoints in `backend/src/routes` and provider logic in `backend/src/providers`. Prefer the adapter pattern used in `listProductsByProvider`.
- Add frontend pages under `frontend/src/pages` and UI components under `frontend/src/components`. Use `@/` imports and add to the route tree `frontend/src/router.jsx`.

## Pitfalls & Checks
- The repo currently uses an in-memory token store — do not rely on it for multi-instance testing; persist to DB/Redis in production.
- Watch for duplicate provider files: `backend/src/providers/ml.js` and `backend/src/providers/ml_listProducts.js` — prefer `ml.js` and consolidate.
- Inconsistent env var names (`VITE_API_BASE` vs `VITE_API_URL`) and relative imports (some components use `../lib/api`) — standardize to `VITE_API_BASE` and `@/lib/api`.
- The `DISABLE_STATE_CHECK` env var exists in `.env` but is not used in code; do not assume it disables state verification.

## Adding a New Provider (cheat sheet)
1. Implement provider logic as `backend/src/providers/<provider>.js` with a function returning `{ items, total }`.
2. Add case to `backend/src/providers/index.js` to dispatch by provider key.
3. Add provider metadata in `frontend/src/lib/providers.js` (key, label, authUrl) and use the new provider key in UI.
4. Ensure token flow uses `refreshIfNeeded(userId)` and `getAnyUserId()` for local testing.

## Security & Operational Notes
- Do not commit secrets; `.env` in this repo contains placeholder values — rotate them if real.
- Mercado Libre refresh tokens are one-time use; always persist new refresh tokens from responses.
- Implement rate-limiting and retry logic for production (not present yet).

If anything above is unclear or you want a guided refactor (e.g., standardize env names or make tokens persistent), say which part to iterate on next.
