import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

// Custom provider untuk GitHub Models
export const githubModels = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN,
});

// Export instance google juga dari sini agar rapi
export { google };
