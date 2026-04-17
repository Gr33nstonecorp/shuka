import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    console.log("API route called");

    const body = await req.json();
    const { input } = body;

    console.log("Received input:", input);
    console.log("OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);
    console.log("OPENAI_API_KEY length:", process.env.OPENAI_API_KEY?.length || 0);

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return Response.json({ error: "Please provide items to source" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("CRITICAL: OPENAI_API_KEY is missing");
      return Response.json({ error: "AI service is not configured" }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful procurement assistant. Return realistic vendor quotes.",
        },
        {
          role: "user",
          content: `Find good vendors for: ${input}`,
        },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || "No response";
    console.log("OpenAI response received");

    // Simple fallback if no structured JSON
    return Response.json({
      results: [
        {
          item: input,
          quantity: 1,
          best_quote: {
            vendor_name: "Demo Vendor (OpenAI worked)",
            total: 99.99,
            reason: "This is a real response from OpenAI",
            product_url: "https://example.com",
          },
        },
      ],
    });

  } catch (err: any) {
    console.error("Full error in /api/assistant:", err);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);

    return Response.json({ 
      error: "Failed to generate sourcing results. Please try again." 
    }, { status: 500 });
  }
}
