// src/app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const aiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.AI_KEY!, 
      },
      body: JSON.stringify({
        prompt: {
          messages: [
            { content: prompt }
          ]
        }
      }),
    }
  );

  if (!aiRes.ok) {
    const err = await aiRes.text();
    return NextResponse.json(
      { reply: `Error from AI API: ${err}` },
      { status: 502 }
    );
  }

  const { candidates } = await aiRes.json();
  const reply = candidates?.[0]?.content ?? "🤖 (no response)";

  return NextResponse.json({ reply });
}
