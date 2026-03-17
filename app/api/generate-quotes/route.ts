import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { request_id, product_name, quantity } = body;

    const searchTerm = encodeURIComponent(product_name || "product");

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
        product_url: `https://www.uline.com/Cls_04/Boxes-Corrugated?keywords=${searchTerm}`,
      },
      {
        vendor_name: "Alibaba",
        unit_price: 12,
        shipping_cost: 15,
        lead_time_days: 10,
        ai_score: 75,
        product_url: `https://www.alibaba.com/trade/search?SearchText=${searchTerm}`,
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
        recommendation: `AI evaluated ${product_name}`,
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

      const { error: orderError } = await supabase
        .from("purchase_orders")
        .insert(ordersToInsert);

      if (orderError) {
        return new Response(JSON.stringify({ error: orderError.message }), {
          status: 500,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        autoApprovedCount: autoApprovedQuotes.length,
      }),
      { status: 200 }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }
}
