import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../../lib/supabaseServer";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = getSupabaseServer();

  const { data: quote, error: quoteError } = await supabase
    .from("quote_options")
    .select(`
      id,
      vendor_name,
      unit_price,
      shipping_cost,
      purchase_requests (
        id,
        product,
        quantity
      )
    `)
    .eq("id", id)
    .single();

  if (quoteError || !quote) {
    return NextResponse.json({ error: quoteError?.message || "Quote not found." }, { status: 400 });
  }

  const request = Array.isArray(quote.purchase_requests)
    ? quote.purchase_requests[0]
    : quote.purchase_requests;

  if (!request) {
    return NextResponse.json({ error: "Request not found." }, { status: 400 });
  }

  const total =
    Number(quote.unit_price) * Number(request.quantity) + Number(quote.shipping_cost);

  const { error: poError } = await supabase.from("purchase_orders").insert({
    request_id: request.id,
    quote_id: quote.id,
    vendor_name: quote.vendor_name,
    total_amount: total,
    status: "approved",
    shipment_status: "not_shipped",
  });

  if (poError) {
    return NextResponse.json({ error: poError.message }, { status: 400 });
  }

  await supabase.from("quote_options").update({ status: "approved" }).eq("id", id);

  return NextResponse.redirect(new URL("/orders", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
