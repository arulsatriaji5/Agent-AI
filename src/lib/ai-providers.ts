import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

// Groq provider — ultra-fast inference (Llama, Mixtral, etc.)
export const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY || '',
});

// OpenRouter provider — access to hundreds of open-source models
export const openRouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  headers: {
    'HTTP-Referer': 'https://agens-trading.com',
    'X-Title': 'Agens Trading',
  },
});

// Export Google provider
export { google };
