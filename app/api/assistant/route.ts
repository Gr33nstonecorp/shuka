import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    console.log("=== ASSISTANT ROUTE CALLED ===");

    const { input } = await req.json();
    console.log("Input:", input);
    console.log("OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return Response.json({ error: "Please provide items" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing");
      return Response.json({ error: "AI service not configured" }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { 
          role: "system", 
          content: "You are a helpful procurement assistant. Return realistic vendor quotes in JSON format." 
        },
        { 
          role: "user", 
          content: `Find good vendors for: ${input}` 
        },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    console.log("OpenAI raw response:", content);

    const parsed = JSON.parse(content);

    return Response.json({ results: parsed.results || [] });

  } catch (err: any) {
    console.error("=== OPENAI ERROR ===");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);

    return Response.json({ 
      error: "Failed to generate sourcing results. Please try again." 
    }, { status: 500 });
  }
}
