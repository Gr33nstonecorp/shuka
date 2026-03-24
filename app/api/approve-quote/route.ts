import { createClient } from "@supabase/supabase-js";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    const quoteId =
      typeof body.quote_id === "string" ? body.quote_id.trim() : "";

    if (!quoteId) {
      return jsonResponse({ error: "Missing quote_id" }, 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: quote, error: quoteError } = await supabase
      .from("quote_options")
      .select("*")
      .eq("id", quoteId)
      .maybeSingle();

    if (quoteError) {
      return jsonResponse({ error: quoteError.message }, 500);
    }

    if (!quote) {
      return jsonResponse({ error: "Quote not found" }, 404);
    }

    const { data: existingOrder, error: existingOrderError } = await supabase
      .from("purchase_orders")
      .select("id")
      .eq("quote_id", quote.id)
      .maybeSingle();

    if (existingOrderError) {
      return jsonResponse({ error: existingOrderError.message }, 500);
    }

    if (existingOrder) {
      return jsonResponse({
        success: true,
        message: "Order already exists for this quote",
        orderAlreadyExists: true,
      });
    }

    const totalAmount =
      Number(quote.unit_price || 0) + Number(quote.shipping_cost || 0);

    const { error: updateQuoteError } = await supabase
      .from("quote_options")
      .update({ status: "approved" })
      .eq("id", quote.id);

    if (updateQuoteError) {
      return jsonResponse({ error: updateQuoteError.message }, 500);
    }

    const { data: order, error: orderError } = await supabase
      .from("purchase_orders")
      .insert({
        request_id: quote.request_id,
        quote_id: quote.id,
        vendor_name: quote.vendor_name,
        total_amount: totalAmount,
        status: "approved",
        shipment_status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      return jsonResponse({ error: orderError.message }, 500);
    }

    return jsonResponse({
      success: true,
      message: "Quote approved and order created",
      order,
    });
  } catch (error) {
    console.error("approve-quote route error:", error);
    return jsonResponse({ error: "Unexpected server error" }, 500);
  }
}
