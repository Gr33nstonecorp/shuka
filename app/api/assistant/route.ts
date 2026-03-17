import { createClient } from "@supabase/supabase-js";

function parseItems(input: string) {
  return String(input || "")
    .split(/[\n,]+/)
    .map((line) => {
      const cleaned = line.trim();
      const match = cleaned.match(/(.+?)(?:\s*[-x]\s*|\s+)(\d+)$/i);

      if (match) {
        return {
          product: match[1].trim(),
          quantity: parseInt(match[2], 10),
        };
      }

      return {
        product: cleaned,
        quantity: 1,
      };
    })
    .filter((x) => x.product.length > 0);
}

function enhanceSearch(term: string) {
  const t = term.toLowerCase();

  if (t.includes("tape")) return "heavy duty packing tape bulk";
  if (t.includes("gloves")) return "industrial nitrile gloves bulk powder free";
  if (t.includes("box")) return "corrugated shipping boxes bulk";
  if (t.includes("label")) return "thermal shipping labels roll";
  if (t.includes("scanner")) return "barcode scanner handheld commercial";
  if (t.includes("clean")) return "industrial cleaning supplies bulk";
  if (t.includes("paper towel")) return "paper towels bulk commercial";
  if (t.includes("toilet paper")) return "toilet paper bulk commercial";
  if (t.includes("trash bag")) return "heavy duty trash bags bulk";

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
    const { input } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const parsedItems = parseItems(input);

    if (parsedItems.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    const results: any[] = [];

    for (const entry of parsedItems) {
      const item = entry.product;
      const quantity = entry.quantity;

      const { data: newRequest, error: requestError } = await supabase
        .from("purchase_requests")
        .insert({
          product: item,
          quantity,
          category: "general",
          urgency: "normal",
          budget_cap: 0,
          status: "submitted",
        })
        .select()
        .single();

      if (requestError) {
        results.push({
          item,
          quantity,
          error: "Request error: " + requestError.message,
        });
        continue;
      }

      const enhanced = enhanceSearch(item);
      const cleanTerm = enhanced
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim();

      const searchTerm = encodeURIComponent(cleanTerm);

      const quotesToInsert = (vendors || []).map((vendor: any) => {
        const pricing = estimateVendorPricing(
          vendor.vendor_type,
          vendor.category,
          vendor.name,
          quantity
        );

        const total = pricing.unit_price * quantity + pricing.shipping_cost;
        const status =
          total < 500 && Number(vendor.default_ai_score || 0) >= 85
            ? "approved"
            : "generated";

        return {
          request_id: newRequest.id,
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
        results.push({
          item,
          quantity,
          error: "Quote error: " + quoteError.message,
        });
        continue;
      }

      const evaluated = (insertedQuotes || []).map((q: any) => {
        const total =
          Number(q.unit_price || 0) * quantity + Number(q.shipping_cost || 0);

        const score =
          (100 - total) +
          (100 - Number(q.lead_time_days || 0) * 5) +
          Number(q.ai_score || 0);

        return { ...q, total, score };
      });

      evaluated.sort((a, b) => b.score - a.score);
      const best = evaluated[0];

      results.push({
        item,
        quantity,
        request_id: newRequest.id,
        best_quote: {
          vendor_name: best.vendor_name,
          total: best.total,
          lead_time_days: best.lead_time_days,
          ai_score: best.ai_score,
          product_url: best.product_url,
          status: best.status,
        },
      });
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
