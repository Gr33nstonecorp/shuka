import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
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

    const systemPrompt = `You are an expert procurement AI assistant.

Task: Given a list of items the user needs to buy, return realistic vendor recommendations with estimated totals.

Rules:
- Be practical and realistic (use known vendors like Amazon, Grainger, Uline, McMaster-Carr, Alibaba, etc. when appropriate)
- Consider bulk discounts, lead time, and quality
- Prioritize lowest total cost with reasonable reliability
- Return ONLY valid JSON in this exact shape:

{
  "results": [
    {
      "item": "string",
      "quantity": number,
      "best_quote": {
        "vendor_name": "string",
        "total": number,
        "reason": "short clear reason why this is the best option",
        "product_url": "https://example.com"
      }
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User needs: ${input}` },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return Response.json({
      results: parsed.results || [],
    });
  } catch (err) {
    console.error("Assistant API error:", err);
    return Response.json({ error: "Failed to generate sourcing results. Please try again." }, { status: 500 });
  }
}
