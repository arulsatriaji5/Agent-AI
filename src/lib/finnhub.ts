export interface FinnhubQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

export interface FinnhubNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export async function getQuote(symbol: string): Promise<FinnhubQuote | null> {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    console.warn("FINNHUB_API_KEY is not set");
    return null;
  }
  
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${token}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Finnhub quote fetch error:", err);
    return null;
  }
}

export async function getMarketNews(category: "general" | "crypto" | "forex" | "merger" = "general"): Promise<FinnhubNews[]> {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) return [];

  try {
    const res = await fetch(`https://finnhub.io/api/v1/news?category=${category}&token=${token}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 5); // Return top 5 news
  } catch (err) {
    console.error("Finnhub news fetch error:", err);
    return [];
  }
}
