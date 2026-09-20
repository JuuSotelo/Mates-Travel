// Función serverless para Vercel: puente seguro a Turso.
// Las claves se leen SOLO de las variables de ambiente del proyecto
// TURSO_URL y TURSO_TOKEN (configurables en la consola de Vercel).
// Así no viajan por git ni por el código del navegador.

const TURSO_URL = process.env.TURSO_URL ? String(process.env.TURSO_URL).replace(/\/+$/, "") : "";
const TURSO_TOKEN = process.env.TURSO_TOKEN || "";

function sqlText(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : "0";
}

async function pipeline(statements) {
  const response = await fetch(`${TURSO_URL}/v2/pipeline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TURSO_TOKEN}`,
    },
    body: JSON.stringify({
      requests: statements.map((sql) => ({ type: "execute", stmt: { sql } })),
    }),
  });
  if (!response.ok) throw new Error(`Turso HTTP ${response.status}`);
  const json = await response.json();
  const results = json && json.results;
  if (!results) throw new Error("Turso sin resultados");
  for (const item of results) {
    if (item && item.response && item.response.error) {
      throw new Error(item.response.error.message || "Error de Turso");
    }
  }
  return results;
}

async function executeOne(sql) {
  const results = await pipeline([sql]);
  return results[0].response;
}

async function ensureSchema() {
  await pipeline([
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      label TEXT,
      price INTEGER NOT NULL DEFAULT 0,
      cost INTEGER NOT NULL DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 0,
      sold INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL DEFAULT '',
      image TEXT,
      tone TEXT NOT NULL DEFAULT '#a15c38'
    )`,
    `CREATE TABLE IF NOT EXISTS category_families (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      family TEXT NOT NULL,
      variants TEXT NOT NULL DEFAULT '[]'
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)`,
  ]);
}

function unwrap(obj) {
  if (obj && typeof obj === "object") {
    if ("value" in obj) return obj.value;
    if (obj.type === "null") return null;
  }
  return obj;
}

async function pull() {
  await ensureSchema();
  const ready = await executeOne("SELECT value FROM meta WHERE key = 'ready'");
  if (!ready.result.rows.length) return null;

  const productsRes = await executeOne("SELECT * FROM products ORDER BY id");
  const familiesRes = await executeOne("SELECT * FROM category_families ORDER BY id");
  const usersRes = await executeOne("SELECT * FROM users ORDER BY id");

  const products = productsRes.result.rows.map((row) => ({
    id: Number(unwrap(row[0])),
    name: String(unwrap(row[1]) ?? ""),
    category: String(unwrap(row[2]) ?? ""),
    label: unwrap(row[3]) === null ? null : String(unwrap(row[3])),
    price: Number(unwrap(row[4]) ?? 0),
    cost: Number(unwrap(row[5]) ?? 0),
    stock: Number(unwrap(row[6]) ?? 0),
    sold: Number(unwrap(row[7]) ?? 0),
    description: String(unwrap(row[8]) ?? ""),
    image: unwrap(row[9]) === null ? null : String(unwrap(row[9])),
    tone: String(unwrap(row[10]) ?? "#a15c38"),
  }));

  const categoryFamilies = familiesRes.result.rows.map((row) => ({
    family: String(unwrap(row[1]) ?? ""),
    variants: JSON.parse(unwrap(row[2]) || "[]"),
  }));

  const users = usersRes.result.rows.map((row) => ({
    username: String(unwrap(row[1]) ?? ""),
    passwordHash: String(unwrap(row[2]) ?? ""),
  }));

  return { products, categoryFamilies, users };
}

async function push(payload) {
  await ensureSchema();
  const statements = [];
  statements.push("DELETE FROM products");
  for (const product of (payload && payload.products) || []) {
    statements.push(
      `INSERT INTO products (id, name, category, label, price, cost, stock, sold, description, image, tone)
       VALUES (${sqlNumber(product.id)}, ${sqlText(product.name)}, ${sqlText(product.category)},
               ${sqlText(product.label)}, ${sqlNumber(product.price)}, ${sqlNumber(product.cost)},
               ${sqlNumber(product.stock)}, ${sqlNumber(product.sold)}, ${sqlText(product.description)},
               ${sqlText(product.image)}, ${sqlText(product.tone || "#a15c38")})`
    );
  }
  statements.push("DELETE FROM category_families");
  for (const family of (payload && payload.categoryFamilies) || []) {
    statements.push(
      `INSERT INTO category_families (family, variants) VALUES (${sqlText(family.family)}, ${sqlText(JSON.stringify(family.variants || []))})`
    );
  }
  statements.push("DELETE FROM users");
  for (const user of (payload && payload.users) || []) {
    statements.push(
      `INSERT INTO users (username, password_hash) VALUES (${sqlText(user.username)}, ${sqlText(user.passwordHash)})`
    );
  }
  statements.push(
    "INSERT INTO meta (key, value) VALUES ('ready', '1') ON CONFLICT (key) DO UPDATE SET value = excluded.value"
  );
  await pipeline(statements);
}

module.exports = async function handler(req, res) {
  try {
    if (!TURSO_URL || !TURSO_TOKEN) {
      return res.status(500).json({ error: "Turso no configurado en Vercel (faltan TURSO_URL y TURSO_TOKEN)." });
    }
    let body = req.body || {};
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: "JSON inválido" });
      }
    }
    const action = body.action;
    if (action === "pull") {
      return res.status(200).json({ data: await pull() });
    }
    if (action === "push") {
      await push(body.payload);
      return res.status(200).json({ data: true });
    }
    return res.status(400).json({ error: "Acción inválida" });
  } catch (error) {
    return res.status(500).json({ error: error && error.message ? error.message : "Error" });
  }
};