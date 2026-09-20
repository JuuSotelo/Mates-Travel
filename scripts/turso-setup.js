// Configura la base en Turso. Uso:
//   node scripts/turso-setup.js <URL> <TOKEN>
// o variables de entorno TURSO_URL / TURSO_TOKEN.
// No se sube ninguna clave: se pasan por terminal.
const { createClient } = require("@libsql/client");

const url = process.env.TURSO_URL || process.argv[2];
const token = process.env.TURSO_TOKEN || process.argv[3];

if (!url || !token) {
  console.error("Falta la URL o el token de Turso.");
  console.error("Uso: node scripts/turso-setup.js <URL> <TOKEN>");
  process.exit(1);
}

const db = createClient({ url, authToken: token });

async function main() {
  await db.execute(
    "CREATE TABLE IF NOT EXISTS data (key TEXT PRIMARY KEY, value TEXT)"
  );
  const result = await db.execute(
    "SELECT value FROM data WHERE key = 'main'"
  );
  const rows = result.rows;
  if (rows.length) {
    console.log("Conexión OK. Ya había datos guardados en Turso.");
  } else {
    console.log("Conexión OK. Base lista, todavía sin datos.");
  }
  process.exit(0);
}

main().catch((error) => {
  console.error("Error conectando a Turso:", error.message || error);
  process.exit(1);
});