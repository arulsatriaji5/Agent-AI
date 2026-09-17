import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  try {
    const { text } = await generateText({
      model: google("gemini-3.1-flash"),
      prompt: "Hello",
    });
    console.log("Response from gemini-3.1-flash:", text);
  } catch (e: any) {
    console.error("Error with gemini-3.1-flash:", e.message);
  }

  try {
    const { text } = await generateText({
      model: google("gemini-3.1-pro-preview"),
      prompt: "Hello",
    });
    console.log("Response from gemini-3.1-pro-preview:", text);
  } catch (e: any) {
    console.error("Error with gemini-3.1-pro-preview:", e.message);
  }
}

main();
