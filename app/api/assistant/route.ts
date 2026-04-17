import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input } = body;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return Response.json({ error: "Please provide items to source" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing in environment variables");
      return Response.json({ error: "AI service is not configured properly" }, { status: 500 });
    }

    const systemPrompt = `You are an expert procurement AI assistant.

Task: Given a list of items the user needs to buy, return realistic vendor recommendations with estimated totals.

Rules:
- Use known reliable vendors (Amazon, Grainger, Uline, McMaster-Carr, Alibaba, etc.)
- Consider bulk pricing, lead time, and quality
- Prioritize lowest total cost with reasonable reliability
- Return ONLY valid JSON in this exact format:

{
  "results": [
    {
      "item": "string",
      "quantity": number,
      "best_quote": {
        "vendor_name": "string",
        "total": number,
        "reason": "short clear reason why this is the best option",
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
        { role: "user", content: `User needs: ${input}` },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return Response.json({
      results: parsed.results || [],
    });

  } catch (err: any) {
    console.error("Assistant API full error:", err);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);

    return Response.json({ 
      error: "Failed to generate sourcing results. Please try again." 
    }, { status: 500 });
  }
}
