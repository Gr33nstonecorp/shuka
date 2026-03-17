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

function estimateVendorPricing(
  vendorType: string,
  vendorCategory: string,
  vendorName: string,
  quantity: number
) {
  const type = (vendorType || "").toLowerCase();
  const category = (vendorCategory || "").toLowerCase();
  const name = (vendorName || "").toLowerCase();
  const qty = Number(quantity) || 1;

  let unitPrice = 20;
  let shippingCost = 6;
  let leadTimeDays = 3;

  if (type.includes("marketplace")) {
    unitPrice = 17;
    shippingCost = 7;
    leadTimeDays = 4;
  }

  if (type.includes("supplier")) {
    unitPrice = 21;
    shippingCost = 6;
    leadTimeDays = 3;
  }

  if (category.includes("industrial")) {
    unitPrice += 3;
    leadTimeDays = Math.max(2, leadTimeDays - 1);
  }

  if (category.includes("office")) {
    unitPrice += 1;
    shippingCost -= 1;
  }

  if (category.includes("packaging")) {
    unitPrice -= 1;
  }

  if (category.includes("wholesale")) {
    unitPrice -= 2;
    leadTimeDays += 3;
  }

  if (name.includes("amazon")) {
    unitPrice -= 1;
    shippingCost -= 1;
    leadTimeDays = 2;
  }

  if (name.includes("uline")) {
    unitPrice += 1;
    shippingCost += 1;
    leadTimeDays = 3;
  }

  if (name.includes("grainger")) {
    unitPrice += 2;
    leadTimeDays = 2;
  }

  if (name.includes("alibaba")) {
    unitPrice -= 4;
    shippingCost += 8;
    leadTimeDays = 10;
  }

  if (name.includes("global")) {
    unitPrice += 1;
    shippingCost += 1;
    leadTimeDays = 4;
  }

  if (name.includes("staples")) {
    unitPrice += 1;
    shippingCost -= 1;
    leadTimeDays = 2;
  }

  if (name.includes("office depot")) {
    unitPrice += 2;
    leadTimeDays = 3;
  }

  if (name.includes("fastenal")) {
    unitPrice += 3;
    shippingCost += 1;
    leadTimeDays = 2;
  }

  if (name.includes("msc")) {
    unitPrice += 4;
    shippingCost += 1;
    leadTimeDays = 3;
  }

  if (name.includes("walmart")) {
    unitPrice -= 2;
    leadTimeDays = 3;
  }

  let bulkDiscount = 0;
  if (qty >= 500) bulkDiscount = 0.18;
  else if (qty >= 200) bulkDiscount = 0.12;
  else if (qty >= 100) bulkDiscount = 0.08;
  else if (qty >= 50) bulkDiscount = 0.05;
  else if (qty >= 20) bulkDiscount = 0.03;

  unitPrice = unitPrice * (1 - bulkDiscount);

  if (qty >= 100) shippingCost += 4;
  else if (qty >= 50) shippingCost += 2;

  return {
    unit_price: Number(unitPrice.toFixed(2)),
    shipping_cost: Number(Math.max(0, shippingCost).toFixed(2)),
    lead_time_days: leadTimeDays,
  };
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
      const pricing = estimateVendorPricing(
        vendor.vendor_type,
        vendor.category,
        vendor.name,
        qty
      );

      const total = pricing.unit_price * qty + pricing.shipping_cost;
      const status =
        total < 500 && Number(vendor.default_ai_score || 0) >= 85
          ? "approved"
          : "generated";

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
