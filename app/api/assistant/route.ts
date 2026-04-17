import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("=== AI ASSISTANT ROUTE CALLED ===");

    const { input } = await req.json();
    console.log("User input:", input);
    console.log("OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);

    // Always return a result for now (no OpenAI dependency)
    return Response.json({
      results: [
        {
          item: input || "Test item",
          quantity: 1,
          best_quote: {
            vendor_name: "Demo Vendor",
            total: 99.99,
            reason: "This is a real server response. The route is working correctly.",
            product_url: "https://example.com",
          },
        },
      ],
    });

  } catch (err: any) {
    console.error("=== ROUTE ERROR ===");
    console.error("Message:", err.message);
    return Response.json({ error: "Failed to generate sourcing results. Please try again." }, { status: 500 });
  }
}
