import { createClient, type Client } from "@libsql/client";

// ---------------------------------------------------------------------------
// Turso / LibSQL — Singleton Connection Helper
// ---------------------------------------------------------------------------

let client: Client | null = null;
let isInitialized = false;

export function getTursoClient(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      "Missing TURSO_DATABASE_URL — add it to your .env.local file."
    );
  }

  client = createClient({
    url,
    authToken: authToken || undefined,
  });

  return client;
}

/**
 * Automatically creates tables if they do not exist.
 * We can call this once when our app starts or inside API routes.
 */
export async function initDb() {
  if (isInitialized) return;
  
  const db = getTursoClient();
  
  // Create market_reports
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

  // Create carousels
  await db.execute(`
    CREATE TABLE IF NOT EXISTS carousels (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      hook_text       TEXT    NOT NULL,
      cover_image_url TEXT    NOT NULL,
      news_data       TEXT    NOT NULL, -- JSON string
      sentiment       TEXT    NOT NULL,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Create bullish_signals
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bullish_signals (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      asset           TEXT    NOT NULL,
      volume_24h      REAL    NOT NULL,
      price_breakout  INTEGER NOT NULL, -- boolean 1 or 0
      created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  isInitialized = true;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface MarketReport {
  id: number;
  asset: string;
  price: number;
  change_24h: number;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  summary: string;
  image_url: string;
  created_at: string;
}

export interface CarouselReport {
  id: number;
  hook_text: string;
  cover_image_url: string;
  news_data: string; // JSON
  sentiment: string;
  created_at: string;
}

export interface BullishSignal {
  id: number;
  asset: string;
  volume_24h: number;
  price_breakout: number; // 0 or 1
  created_at: string;
}
