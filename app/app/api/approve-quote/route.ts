import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { quote_id } = await req.json();

    if (!quote_id) {
      return new Response(JSON.stringify({ error: "Missing quote_id" }), {
        status: 400,
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: quote, error } = await supabase
      .from("quote_options")
      .select("*")
      .eq("id", quote_id)
      .single();

    if (error || !quote) {
      return new Response(JSON.stringify({ error: "Quote not found" }), {
        status: 404,
      });
    }

    const total =
      Number(quote.unit_price || 0) +
      Number(quote.shipping_cost || 0);

    const { error: orderError } = await supabase
      .from("purchase_orders")
      .insert({
        request_id: quote.request_id,
        quote_id: quote.id,
        vendor_name: quote.vendor_name,
        total_amount: total,
        status: "approved",
        shipment_status: "pending",
      });

    if (orderError) {
      return new Response(JSON.stringify({ error: orderError.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
