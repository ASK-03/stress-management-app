import { saveChat } from "@/lib/queries";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId, messages } = await req.json();

  const message = messages[messages.length - 1].content;

  if (typeof message === "string") {
    await saveChat(userId, message, "user");
  }

  const result = await streamText({
    model: google("gemini-1.5-flash"),
    system:
      "You are a helpful bot that helps people to cheer up their mind. People will share their problems with you and you have to console them. Your name is SOMU",
    messages: messages,
  });

  let aiResponse = "";

  for await (const textPart of result.textStream) {
    aiResponse += textPart;
  }

  saveChat(userId, aiResponse, "ai");

  return result.toDataStreamResponse();
}
