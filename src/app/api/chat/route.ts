import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `You are a helpful and expert AI assistant acting as a Senior Frontend & AI Engineer. 
You specialize in modern web development, financial technical analysis, crypto asset trends, and general assistance.
Always be concise, informative, and friendly. Provide responses in Indonesian when appropriate.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
