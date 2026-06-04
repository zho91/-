import { createClient } from "@libsql/client";

let client;

export function getTursoClient() {
  if (client) return client;

  client = createClient({
    url: process.env.TURSO_DATABASE_URL || "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return client;
}

export async function initDb() {
  const db = getTursoClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS history_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_text TEXT NOT NULL,
      generated_x_posts TEXT NOT NULL,
      generated_linkedin TEXT NOT NULL,
      processing_time_ms INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}
