// ---------------------------------------------------------------------------
// Database Initialization Script
// ---------------------------------------------------------------------------
// Run with:  npm run db:init
// ---------------------------------------------------------------------------

import { getTursoClient } from "../src/lib/turso";

async function initDatabase() {
  console.log("🔄 Connecting to Turso database...");

  const db = getTursoClient();

  console.log("📦 Creating table: market_reports");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS market_reports (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      asset       TEXT    NOT NULL DEFAULT 'BTCUSDT',
      price       REAL    NOT NULL,
      change_24h  REAL    NOT NULL,
      sentiment   TEXT    NOT NULL CHECK (sentiment IN ('Bullish', 'Bearish', 'Neutral')),
      summary     TEXT    NOT NULL,
      image_url   TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  console.log("✅ Table market_reports created (or already exists).");

  // Create index on created_at for efficient ordering
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_market_reports_created_at
    ON market_reports (created_at DESC);
  `);

  console.log("✅ Index on created_at created.");
  console.log("🎉 Database initialization complete!");
}

initDatabase().catch((err) => {
  console.error("❌ Database initialization failed:", err);
  process.exit(1);
});
