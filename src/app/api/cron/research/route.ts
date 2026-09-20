import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getTursoClient, initDb } from "@/lib/turso";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

interface AgensAnalysis {
  sentiment: "Bullish" | "Bearish" | "Neutral";
  summary: string;
  visual_prompt: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BINANCE_API = "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT";

// ---------------------------------------------------------------------------
// Step 1 — Fetch live price data from Binance
// ---------------------------------------------------------------------------
async function fetchBinanceData(): Promise<BinanceTicker> {
  const res = await fetch(BINANCE_API, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Binance API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Step 2 — Analyse with Gemini via Vercel AI SDK
// ---------------------------------------------------------------------------
async function analyseWithAgens(ticker: BinanceTicker): Promise<AgensAnalysis> {
  const prompt = `
You are Agens, a senior crypto-market analyst AI. Analyse the following real-time BTCUSDT market data and return your analysis **strictly** as a JSON object with three keys — no markdown fences, no extra text.

Market Data:
- Current Price : $${ticker.lastPrice}
- 24h Change    : ${ticker.priceChangePercent}%
- 24h High      : $${ticker.highPrice}
- 24h Low       : $${ticker.lowPrice}
- 24h Volume    : ${Number(ticker.volume).toLocaleString()} BTC
- 24h Quote Vol : $${Number(ticker.quoteVolume).toLocaleString()}

Required JSON keys:
1. "sentiment"     — exactly one of: "Bullish", "Bearish", "Neutral"
2. "summary"       — 2 concise sentences explaining the market state and outlook.
3. "visual_prompt" — a vivid English prompt (max 60 words) for a futuristic 3D finance-themed illustration capturing the current market mood. Include glowing neon elements, holographic charts, and a cinematic atmosphere.

Return ONLY the JSON object.
`;

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt,
    temperature: 0.4,
    maxTokens: 300,
  });

  // Parse the JSON from response (strip any accidental fences)
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const parsed: AgensAnalysis = JSON.parse(cleaned);

  // Validate sentiment
  if (!["Bullish", "Bearish", "Neutral"].includes(parsed.sentiment)) {
    parsed.sentiment = "Neutral";
  }

  return parsed;
}

// ---------------------------------------------------------------------------
// Step 3 — Generate image URL via Pollinations.ai
// ---------------------------------------------------------------------------
function buildImageUrl(visualPrompt: string): string {
  const encoded = encodeURIComponent(visualPrompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true`;
}

// ---------------------------------------------------------------------------
// Step 4 — Persist to Turso
// ---------------------------------------------------------------------------
async function saveReport(
  price: number,
  change24h: number,
  analysis: AgensAnalysis,
  imageUrl: string
) {
  const db = getTursoClient();

  await db.execute({
    sql: `INSERT INTO market_reports (asset, price, change_24h, sentiment, summary, image_url, created_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    args: [
      "BTCUSDT",
      price,
      change24h,
      analysis.sentiment,
      analysis.summary,
      imageUrl,
    ],
  });
}

// ---------------------------------------------------------------------------
// GET Handler — Cron endpoint (Vercel Cron / External Trigger)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    // Verify Vercel cron secret in production
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("🚀 [AGENS CRON] Starting autonomous financial research...");

    // 0) Initialize DB
    await initDb();

    // 1) Fetch live data
    const ticker = await fetchBinanceData();
    const price = parseFloat(ticker.lastPrice);
    const change24h = parseFloat(ticker.priceChangePercent);

    console.log(`📊 BTC Price: $${price.toLocaleString()} | 24h: ${change24h}%`);

    // 2) AI analysis
    const analysis = await analyseWithAgens(ticker);
    console.log(`🧠 Sentiment: ${analysis.sentiment}`);
    console.log(`📝 Summary: ${analysis.summary}`);

    // 3) Generate visual
    const imageUrl = buildImageUrl(analysis.visual_prompt);
    console.log(`🎨 Image URL generated`);

    // 4) Persist
    await saveReport(price, change24h, analysis, imageUrl);
    console.log("💾 Report saved to Turso");

    return NextResponse.json({
      success: true,
      message: "Agens autonomous research completed.",
      data: {
        asset: "BTCUSDT",
        price,
        change_24h: change24h,
        sentiment: analysis.sentiment,
        summary: analysis.summary,
        image_url: imageUrl,
      },
    });
  } catch (error) {
    console.error("❌ [AGENS CRON] Research failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Force dynamic — never cache this route
export const dynamic = "force-dynamic";
export const maxDuration = 30;
