import { createClient } from "@supabase/supabase-js";

type VendorSource = {
  id: string;
  name: string | null;
  vendor_type: string | null;
  category: string | null;
  default_ai_score: number | null;
  active: boolean | null;
  search_url_template: string | null;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ... keep all your helper functions (enhanceSearch, estimateVendorPricing, etc.)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    // ... rest of your original code ...

    return jsonResponse({
      success: true,
      message: "Quotes generated successfully",
    });
  } catch (error) {
    console.error("Assistant route error:", error);
    return jsonResponse({ error: "Unexpected server error" }, 500);
  }
}
