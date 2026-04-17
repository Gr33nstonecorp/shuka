import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return Response.json({ error: "Please provide items to source" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert procurement AI. Return realistic vendor quotes in this exact JSON format:
{
  "results": [
    {
      "item": "string",
      "quantity": number,
      "best_quote": {
        "vendor_name": "string",
        "total": number,
        "reason": "short reason",
        "product_url": "https://example.com"
      }
    }
  ]
}`,
        },
        { role: "user", content: `Find good vendors for: ${input}` },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return Response.json({ results: parsed.results || [] });

  } catch (err: any) {
    console.error("OpenAI error:", err.message);
    return Response.json({ 
      error: "Failed to generate sourcing results. Please try again." 
    }, { status: 500 });
  }
}
