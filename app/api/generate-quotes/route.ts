import { createClient } from "@supabase/supabase-js";

function enhanceSearch(term: string) {
  const t = term.toLowerCase();

  if (t.includes("tape")) return "heavy duty packing tape bulk";
  if (t.includes("gloves")) return "industrial nitrile gloves bulk powder free";
  if (t.includes("box")) return "corrugated shipping boxes bulk";
  if (t.includes("label")) return "thermal shipping labels roll";
  if (t.includes("clean")) return "industrial cleaning supplies bulk";

  return term + " bulk wholesale";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { request_id, product_name, quantity } = body;

    const enhanced = enhanceSearch(product_name || "product");

    const cleanTerm = enhanced
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim();

    const searchTerm = encodeURIComponent(cleanTerm);

    const vendors = [
      {
        vendor_name: "Amazon Business",
        unit_price: 18,
        shipping_cost: 5,
        lead_time_days: 2,
        ai_score: 92,
        product_url: `https://www.amazon.com/s?k=${searchTerm}`,
      },
      {
        vendor_name: "Uline",
        unit_price: 21,
        shipping_cost: 8,
        lead_time_days: 3,
        ai_score: 88,
        product_url: `https://www.uline.com/Search?keywords=${searchTerm}`,
      },
      {
        vendor_name: "Alibaba",
        unit_price: 12,
        shipping_cost: 15,
        lead_time_days: 10,
        ai_score: 75,
        product_url: `https://www.alibaba.com/trade/search?SearchText=${searchTerm}`,
      },
      {
        vendor_name: "Grainger",
        unit_price: 20,
        shipping_cost: 6,
        lead_time_days: 2,
        ai_score: 90,
        product_url: `https://www.grainger.com/search?searchQuery=${searchTerm}`,
      },
    ];

    const quotesToInsert = vendors.map((v) => {
      const total = v.unit_price * Number(quantity) + v.shipping_cost;

      const status =
        total < 500 && v.ai_score >= 85 ? "approved" : "generated";

      return {
        request_id,
        vendor_name: v.vendor_name,
        unit_price: v.unit_price,
        shipping_cost: v.shipping_cost,
        lead_time_days: v.lead_time_days,
        ai_score: v.ai_score,
        recommendation: `AI searched: "${enhanced}"`,
        status,
        product_url: v.product_url,
      };
    });

    const { data: insertedQuotes, error: quoteError } = await supabase
      .from("quote_options")
      .insert(quotesToInsert)
      .select();

    if (quoteError) {
      return new Response(JSON.stringify({ error: quoteError.message }), {
        status: 500,
      });
    }

    const autoApprovedQuotes =
      insertedQuotes?.filter((q) => q.status === "approved") || [];

    if (autoApprovedQuotes.length > 0) {
      const ordersToInsert = autoApprovedQuotes.map((quote) => ({
        request_id: quote.request_id,
        quote_id: quote.id,
        vendor_name: quote.vendor_name,
        total_amount:
          Number(quote.unit_price || 0) * Number(quantity) +
          Number(quote.shipping_cost || 0),
        status: "approved",
        shipment_status: "pending",
      }));

      await supabase.from("purchase_orders").insert(ordersToInsert);
    }

    return new Response(
      JSON.stringify({
        success: true,
        enhanced_search: enhanced,
      }),
      { status: 200 }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }
}
