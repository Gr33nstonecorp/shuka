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

  if (category.includes("industrial")) {
    unitPrice += 3;
    leadTimeDays -= 1;
  }

  if (name.includes("amazon")) {
    unitPrice -= 1;
    shippingCost -= 1;
    leadTimeDays = 2;
  }

  if (name.includes("alibaba")) {
    unitPrice -= 4;
    shippingCost += 8;
    leadTimeDays = 10;
  }

  let bulkDiscount = 0;
  if (qty >= 200) bulkDiscount = 0.12;
  else if (qty >= 100) bulkDiscount = 0.08;
  else if (qty >= 50) bulkDiscount = 0.05;

  unitPrice = unitPrice * (1 - bulkDiscount);

  return {
    unit_price: Number(unitPrice.toFixed(2)),
    shipping_cost: shippingCost,
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
      });
    }

    const { data: vendors } = await supabase
      .from("vendor_sources")
      .select("*")
      .eq("active", true);

    const results: any[] = [];

    for (const entry of parsedItems) {
      const item = entry.product;
      const quantity = entry.quantity;

      const { data: newRequest } = await supabase
        .from("purchase_requests")
        .insert({
          product: item,
          quantity,
          status: "submitted",
        })
        .select()
        .single();

      const enhanced = enhanceSearch(item);
      const searchTerm = encodeURIComponent(enhanced);

      const quotes = (vendors || []).map((vendor: any) => {
        const pricing = estimateVendorPricing(
          vendor.vendor_type,
          vendor.category,
          vendor.name,
          quantity
        );

        return {
          request_id: newRequest.id,
          vendor_name: vendor.name,
          unit_price: pricing.unit_price,
          shipping_cost: pricing.shipping_cost,
          lead_time_days: pricing.lead_time_days,
          ai_score: vendor.default_ai_score,
          product_url: vendor.search_url_template.replace(
            "{searchTerm}",
            searchTerm
          ),
        };
      });

      const { data: insertedQuotes } = await supabase
        .from("quote_options")
        .insert(quotes)
        .select();

      // 🔥 NEW: smarter scoring
      const evaluated = (insertedQuotes || []).map((q: any) => {
        const total =
          Number(q.unit_price || 0) * quantity +
          Number(q.shipping_cost || 0);

        const priceScore = 100 - total;
        const speedScore = 100 - q.lead_time_days * 5;

        const score =
          priceScore * 0.6 +
          speedScore * 0.2 +
          Number(q.ai_score || 0) * 0.2;

        return { ...q, total, score, priceScore, speedScore };
      });

      evaluated.sort((a, b) => b.score - a.score);

      const cheapest = [...evaluated].sort((a, b) => a.total - b.total)[0];
      const fastest = [...evaluated].sort(
        (a, b) => a.lead_time_days - b.lead_time_days
      )[0];

      const best = evaluated[0];

      let reason = "Best overall value";

      if (best.id === cheapest.id) {
        reason = "🏆 Cheapest option";
      } else if (best.id === fastest.id) {
        reason = "⚡ Fastest delivery";
      } else if (best.ai_score >= 90) {
        reason = "⭐ Highest rated supplier";
      }

      results.push({
        item,
        quantity,
        best_quote: {
          vendor_name: best.vendor_name,
          total: best.total,
          lead_time_days: best.lead_time_days,
          ai_score: best.ai_score,
          product_url: best.product_url,
          reason: reason,
        },
      });
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
}
