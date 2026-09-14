import { createClient, type Client } from "@libsql/client";

// ---------------------------------------------------------------------------
// Turso / LibSQL — Singleton Connection Helper
// ---------------------------------------------------------------------------
// Uses environment variables:
//   TURSO_DATABASE_URL  — your Turso database libsql:// URL
//   TURSO_AUTH_TOKEN    — authentication token from Turso dashboard
// ---------------------------------------------------------------------------

let client: Client | null = null;

/**
 * Returns a singleton libsql client connected to the configured Turso DB.
 * Safe to call from both API routes and server components.
 */
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

// ---------------------------------------------------------------------------
// Type for rows coming out of the `market_reports` table
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
