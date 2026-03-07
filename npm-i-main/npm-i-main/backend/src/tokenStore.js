// backend/src/tokenStore.js
// TokenStore simples com persistência em arquivo (DEV).
// Motivo:
// - hoje você usa Map em memória -> ao reiniciar, perde token e quebra tudo.
// - com isso você não precisa refazer OAuth toda hora.
// Depois a gente migra pra Postgres/Redis.

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const TOKENS_FILE = path.join(DATA_DIR, "tokens.json");

// user_id -> tokenData
const users = new Map();

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadFromDisk() {
  try {
    if (!fs.existsSync(TOKENS_FILE)) return;
    const raw = fs.readFileSync(TOKENS_FILE, "utf-8");
    if (!raw) return;
    const obj = JSON.parse(raw);

    for (const [userId, data] of Object.entries(obj)) {
      users.set(String(userId), data);
    }
    console.log(`[tokenStore] loaded tokens from ${TOKENS_FILE} (users: ${users.size})`);
  } catch (e) {
    console.warn("[tokenStore] failed to load tokens:", e.message);
  }
}

function saveToDisk() {
  try {
    ensureDataDir();
    const obj = Object.fromEntries(users.entries());
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (e) {
    console.warn("[tokenStore] failed to save tokens:", e.message);
  }
}

// carrega uma vez ao iniciar
loadFromDisk();

/**
 * data: { access_token, refresh_token, user_id, expires_in, scope, token_type }
 */
export function saveTokens(data) {
  if (!data?.user_id) return;

  const expAt = Date.now() + (Number(data.expires_in || 0) - 60) * 1000; // margem -60s
  const stored = {
    ...data,
    expAt,
    updatedAt: Date.now(),
  };

  users.set(String(data.user_id), stored);
  saveToDisk();
}

export function getTokens(userId) {
  return users.get(String(userId));
}

export function getAnyUserId() {
  for (const k of users.keys()) return k;
  return null;
}

export function isExpired(tokens) {
  if (!tokens?.expAt) return true;
  return Date.now() >= tokens.expAt;
}
