import { createClient } from "@supabase/supabase-js";

function enhanceSearch(term: string) {
  const t = term.toLowerCase();

  if (t.includes("tape")) return "heavy duty packing tape bulk";
  if (t.includes("gloves")) return "industrial nitrile gloves bulk powder free";
  if (t.includes("box")) return "corrugated shipping boxes bulk";
  if (t.includes("label")) return "thermal shipping labels roll";
  if (t.includes("clean")) return "industrial cleaning supplies bulk";
  if (t.includes("paper towel")) return "paper towels bulk commercial";
  if (t.includes("toilet paper")) return "toilet paper bulk commercial";
  if (t.includes("trash bag")) return "heavy duty trash bags bulk";
  if (t.includes("scanner")) return "barcode scanner handheld commercial";

  return term + " bulk wholesale";
}

function estimateVendorPricing(name: string) {
  const key = name.toLowerCase();

  if (key.includes("amazon")) return { unit_price: 18, shipping_cost: 5, lead_time_days: 2 };
  if (key.includes("uline")) return { unit_price: 21, shipping_cost: 8, lead_time_days: 3 };
  if (key.includes("grainger")) return { unit_price: 20, shipping_cost: 6, lead_time_days: 2 };
  if (key.includes("alibaba")) return { unit_price: 12, shipping_cost: 15, lead_time_days: 10 };
  if (key.includes("global")) return { unit_price: 19, shipping_cost: 7, lead_time_days: 4 };
  if (key.includes("staples")) return { unit_price: 22, shipping_cost: 4, lead_time_days: 2 };
  if (key.includes("office depot")) return { unit_price: 23, shipping_cost: 5, lead_time_days: 3 };
  if (key.includes("fastenal")) return { unit_price: 24, shipping_cost: 6, lead_time_days: 2 };
  if (key.includes("msc")) return { unit_price: 25, shipping_cost: 7, lead_time_days: 3 };
  if (key.includes("walmart")) return { unit_price: 17, shipping_cost: 6, lead_time_days: 3 };

  return { unit_price: 20, shipping_cost: 6, lead_time_days: 3 };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { request_id, product_name, quantity } = body;
    const qty = Number(quantity) || 1;

    const enhanced = enhanceSearch(product_name || "product");
    const cleanTerm = enhanced.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    const searchTerm = encodeURIComponent(cleanTerm);

    const { data: vendors, error: vendorError } = await supabase
      .from("vendor_sources")
      .select("*")
      .eq("active", true);

    if (vendorError) {
      return new Response(JSON.stringify({ error: vendorError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const quotesToInsert = (vendors || []).map((vendor: any) => {
      const pricing = estimateVendorPricing(vendor.name);
      const total = pricing.unit_price * qty + pricing.shipping_cost;
      const status = total < 500 && vendor.default_ai_score >= 85 ? "approved" : "generated";

      return {
        request_id,
        vendor_name: vendor.name,
        unit_price: pricing.unit_price,
        shipping_cost: pricing.shipping_cost,
        lead_time_days: pricing.lead_time_days,
        ai_score: vendor.default_ai_score,
        recommendation: `AI searched: "${enhanced}"`,
        status,
        product_url: vendor.search_url_template.replace("{searchTerm}", searchTerm),
      };
    });

    const { data: insertedQuotes, error: quoteError } = await supabase
      .from("quote_options")
      .insert(quotesToInsert)
      .select();

    if (quoteError) {
      return new Response(JSON.stringify({ error: quoteError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
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
          Number(quote.unit_price || 0) * qty + Number(quote.shipping_cost || 0),
        status: "approved",
        shipment_status: "pending",
      }));

      const { error: orderError } = await supabase
        .from("purchase_orders")
        .insert(ordersToInsert);

      if (orderError) {
        return new Response(JSON.stringify({ error: orderError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        enhanced_search: enhanced,
        autoApprovedCount: autoApprovedQuotes.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
