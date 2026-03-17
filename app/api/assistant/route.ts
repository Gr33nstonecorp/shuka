import { createClient } from "@supabase/supabase-js";

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

function buildVendors(searchTerm: string) {
  return [
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
      vendor_name: "Grainger",
      unit_price: 20,
      shipping_cost: 6,
      lead_time_days: 2,
      ai_score: 90,
      product_url: `https://www.grainger.com/search?searchQuery=${searchTerm}`,
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
      vendor_name: "Global Industrial",
      unit_price: 19,
      shipping_cost: 7,
      lead_time_days: 4,
      ai_score: 86,
      product_url: `https://www.globalindustrial.com/searchResult?text=${searchTerm}`,
    },
  ];
}

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const rawItems = String(input || "")
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (rawItems.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];

    for (const item of rawItems) {
      const quantity = 1;

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
          error: "Could not create request: " + requestError.message,
        });
        continue;
      }

      const enhanced = enhanceSearch(item);
      const cleanTerm = enhanced
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim();
      const searchTerm = encodeURIComponent(cleanTerm);

      const vendors = buildVendors(searchTerm);

      const quotesToInsert = vendors.map((v) => {
        const total = v.unit_price * quantity + v.shipping_cost;
        const status = total < 500 && v.ai_score >= 85 ? "approved" : "generated";

        return {
          request_id: newRequest.id,
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
        results.push({
          item,
          error: "Could not generate quotes: " + quoteError.message,
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
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
