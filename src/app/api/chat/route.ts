import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY || '',
});

const openRouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  headers: {
    'HTTP-Referer': 'https://agens-trading.com',
    'X-Title': 'Agens Trading',
  },
});

const AGENS_SYSTEM_PROMPT = `Anda adalah Agens, asisten AI cerdas. Tugas Anda hanya menjawab percakapan dasar, memberikan informasi umum, dan merangkum teks. Anda tidak memiliki akses ke data real-time pasar di mode ini.`;

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    const selectedModelString = model || 'gemini-2.5-flash';

    console.log("[AGENS CHAT] Request model:", selectedModelString);

    let activeModel;

    if (selectedModelString === 'llama3-70b-8192' || selectedModelString === 'llama-3.3-70b-versatile') {
      if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY tidak ditemukan");
      activeModel = groq(selectedModelString);
    } else if (selectedModelString.includes(':free') || selectedModelString.includes('openrouter')) {
      if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY tidak ditemukan");
      activeModel = openRouter(selectedModelString);
    } else {
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY tidak ditemukan");
      activeModel = google(selectedModelString);
    }

    const result = await streamText({
      model: activeModel,
      messages,
      system: AGENS_SYSTEM_PROMPT,
    });

    // AI SDK v7: toUIMessageStreamResponse is the correct method
    // toDataStreamResponse was removed in v5+
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error("[AGENS CHAT] Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
