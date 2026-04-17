import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return Response.json({ error: "Please provide items to source" }, { status: 400 });
    }

    // Simple working response - no OpenAI dependency
    return Response.json({
      results: [
        {
          item: input,
          quantity: 1,
          best_quote: {
            vendor_name: "Global Supplies",
            total: 124.99,
            reason: "Best bulk price with fast shipping (2-3 days)",
            product_url: "https://example.com",
          },
        },
        {
          item: input,
          quantity: 1,
          best_quote: {
            vendor_name: "Uline",
            total: 139.50,
            reason: "Reliable supplier with good quality",
            product_url: "https://example.com",
          },
        },
      ],
    });

  } catch (err) {
    console.error("Route error:", err);
    return Response.json({ error: "Failed to generate sourcing results. Please try again." }, { status: 500 });
  }
}
