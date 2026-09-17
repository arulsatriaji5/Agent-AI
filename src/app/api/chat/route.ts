import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const githubModels = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN || '',
});

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();
    
    // Fallback ke Gemini Flash jika model kosong/tidak valid
    const selectedModelString = model || 'gemini-2.5-flash';
    
    console.log("Menerima request dengan model:", selectedModelString);
    
    let activeModel;
    
    switch (selectedModelString) {
      case 'gpt-4o-mini':
      case 'Meta-Llama-3.1-70B-Instruct':
        if (!process.env.GITHUB_TOKEN) {
          throw new Error("GITHUB_TOKEN tidak ditemukan di environment variables");
        }
        activeModel = githubModels(selectedModelString);
        break;
      default:
        // Eksekusi default Gemini
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
          throw new Error("GOOGLE_GENERATIVE_AI_API_KEY tidak ditemukan");
        }
        activeModel = google(selectedModelString);
        break;
    }

    const result = await streamText({
      model: activeModel,
      messages,
      system: `Anda adalah Agent AI, Asisten Kecerdasan Buatan yang cerdas dan serba bisa.
Walaupun Anda memiliki pengetahuan mendalam tentang pasar finansial, kripto, dan saham, Anda juga dirancang untuk menjawab SEMUA pertanyaan umum, coding, keseharian, dan topik lainnya yang diajukan oleh pengguna dengan baik dan akurat.
Jika pengguna meminta kode atau bantuan teknis, berikan jawaban yang lengkap.
Gunakan Markdown yang rapi, poin-poin yang jelas, dan bahasa Indonesia yang profesional dan ramah. 
JANGAN PERNAH menolak menjawab pertanyaan hanya karena di luar topik finansial. Pahami dan kerjakan setiap perintah pengguna di mode chat ini dengan baik.`,
    });

    return result.toDataStreamResponse();
    
  } catch (error: any) {
    console.error("API CHAT ERROR:", error.message);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan internal" }, { status: 500 });
  }
}
