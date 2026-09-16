import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { messages, model: requestedModel } = await req.json();

    // Use available models on the API key: gemini-2.5-flash or gemini-2.5-pro
    let modelName = "gemini-2.5-flash";
    if (requestedModel === "gemini-2.5-pro") {
      modelName = "gemini-2.5-pro";
    }

    const result = await streamText({
      model: google(modelName),
      system: `You are Agent AI, an expert Senior Financial & Market Intelligence Assistant.
You specialize in:
1. Cryptocurrency markets (Bitcoin, Ethereum, Altcoins, on-chain metrics, liquidity cycles).
2. Indonesian stock market (IHSG, big caps like BBCA, BBRI, BMRI, TLKM, ASII, foreign flow analysis).
3. Macroeconomic trends, central bank policies, inflation, and currency movements (USD/IDR).
4. Technical chart analysis, key support/resistance levels, order flow, and risk management.

Operating Rules:
- Mode Chat is strictly conversational: provide sharp, data-driven, and clear answers.
- Do NOT output image carousel slide decks or trigger autonomous research workflows in this mode.
- Use clean Markdown with bullet points, bold key figures, and concise paragraphs.
- Respond in Indonesian by default, in a professional, polite, and confident tone.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to process chat",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
