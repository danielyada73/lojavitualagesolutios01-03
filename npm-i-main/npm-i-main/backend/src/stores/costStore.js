// backend/src/stores/costStore.js
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "costs.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify({ users: {} }, null, 2), "utf-8");
  }
}

async function readAll() {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return { users: {} };
  }
}

async function writeAll(db) {
  await ensureFile();
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf-8");
}

function ensureUser(db, userId) {
  db.users ||= {};
  db.users[userId] ||= { defaultUnitCost: 0, items: {}, fixed: {} };
  db.users[userId].items ||= {};
  db.users[userId].fixed ||= {};
  return db.users[userId];
}

export async function getCostsForUser(userId) {
  const db = await readAll();
  const u = ensureUser(db, String(userId));
  return u;
}

export async function setDefaultUnitCost(userId, unitCost) {
  const db = await readAll();
  const u = ensureUser(db, String(userId));
  u.defaultUnitCost = Number(unitCost) || 0;
  await writeAll(db);
  return u;
}

export async function setItemUnitCost(userId, itemId, unitCost) {
  const db = await readAll();
  const u = ensureUser(db, String(userId));
  u.items[String(itemId)] = Number(unitCost) || 0;
  await writeAll(db);
  return u;
}

export async function setFixedCosts(userId, payload) {
  const db = await readAll();
  const u = ensureUser(db, String(userId));
  u.fixed = { ...u.fixed, ...(payload || {}) };
  await writeAll(db);
  return u;
}