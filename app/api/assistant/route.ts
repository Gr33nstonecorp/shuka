import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { problem, zip } = await req.json();

    if (!problem) {
      return NextResponse.json({ error: "Problem required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a helpful car repair agent. Return ONLY valid JSON with possibleCause and mechanics array.",
        },
        {
          role: "user",
          content: `Problem: "${problem}". Zip code: ${zip || "unknown"}. Suggest 2-3 local mechanics with price, reason, and real shop link.`,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const data = JSON.parse(content);

    return NextResponse.json({
      possibleCause: data.possibleCause || "General diagnostic recommended.",
      mechanics: data.mechanics || [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Agent failed" }, { status: 500 });
  }
}
