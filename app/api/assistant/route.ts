import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string") {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const systemPrompt = `You are an expert procurement AI. Given a list of items a user needs to purchase, suggest realistic vendors, estimated total costs, and reasons.

Rules:
- Be practical and realistic (use known vendors like Amazon, Grainger, Uline, McMaster-Carr, etc. when appropriate)
- Consider bulk pricing, lead time, and quality
- Prioritize lowest total cost + reliability
- Return ONLY valid JSON in this exact format:

{
  "results": [
    {
      "item": "string",
      "quantity": number,
      "best_quote": {
        "vendor_name": "string",
        "total": number,
        "reason": "short explanation why this is best",
        "product_url": "https://example.com/product"
      }
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return Response.json({
      results: parsed.results || [],
    });
  } catch (err) {
    console.error("Assistant error:", err);
    return Response.json({ error: "Failed to generate sourcing results" }, { status: 500 });
  }
}
