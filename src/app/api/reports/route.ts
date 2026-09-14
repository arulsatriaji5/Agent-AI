import { NextResponse } from "next/server";
import { getTursoClient, type MarketReport } from "@/lib/turso";

// ---------------------------------------------------------------------------
// GET /api/reports — Fetch all market reports, newest first
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const db = getTursoClient();

    const result = await db.execute(
      "SELECT * FROM market_reports ORDER BY created_at DESC LIMIT 50"
    );

    const reports: MarketReport[] = result.rows.map((row) => ({
      id: Number(row.id),
      asset: String(row.asset),
      price: Number(row.price),
      change_24h: Number(row.change_24h),
      sentiment: String(row.sentiment) as MarketReport["sentiment"],
      summary: String(row.summary),
      image_url: String(row.image_url),
      created_at: String(row.created_at),
    }));

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    console.error("❌ Failed to fetch reports:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
