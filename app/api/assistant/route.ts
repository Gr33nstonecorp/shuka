import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    console.log("=== API ROUTE CALLED ===");
    console.log("Input received:", input);
    console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
    console.log("OPENAI_API_KEY length:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ 
        error: "OpenAI key is missing in Vercel environment variables" 
      }, { status: 500 });
    }

    return Response.json({
      results: [{
        item: input || "Test item",
        quantity: 1,
        best_quote: {
          vendor_name: "Test Vendor",
          total: 99.99,
          reason: "This is a real response from the server. OpenAI key is present.",
          product_url: "https://example.com"
        }
      }]
    });

  } catch (err: any) {
    console.error("CRITICAL ERROR in /api/assistant:", err.message);
    return Response.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}
