import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("purchase_requests")
      .insert({
        product: body.product,
        quantity: body.quantity,
        category: body.category,
        urgency: body.urgency,
        budget_cap: body.budget_cap,
        preferred_vendor: body.preferred_vendor,
        deadline: body.deadline,
        notes: body.notes,
        status: "submitted",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const quoteRows = buildQuotesForRequest(data);

    const { error: quoteError } = await supabase.from("quote_options").insert(quoteRows);

    if (quoteError) {
      return NextResponse.json({ error: quoteError.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, request: data });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

function buildQuotesForRequest(request: {
  id: string;
  product: string;
  quantity: number;
  preferred_vendor: string | null;
  category: string;
}) {
  const product = request.product.toLowerCase();

  const defaults =
    product.includes("label")
      ? [
          { vendor_name: "Amazon Business", unit_price: 8.1, shipping_cost: 12, lead_time_days: 2, ai_score: 95, recommendation: "Best Overall" },
          { vendor_name: "Staples Business", unit_price: 8.8, shipping_cost: 9, lead_time_days: 3, ai_score: 82, recommendation: "Backup Option" },
        ]
      : product.includes("tape")
      ? [
          { vendor_name: "Uline", unit_price: 4.2, shipping_cost: 18, lead_time_days: 2, ai_score: 93, recommendation: "Best Packaging Source" },
          { vendor_name: "Amazon Business", unit_price: 4.6, shipping_cost: 10, lead_time_days: 3, ai_score: 81, recommendation: "Lower Friction Option" },
        ]
      : product.includes("glove")
      ? [
          { vendor_name: "Grainger", unit_price: 12.4, shipping_cost: 20, lead_time_days: 1, ai_score: 94, recommendation: "Fastest Approved Vendor" },
          { vendor_name: "Amazon Business", unit_price: 11.9, shipping_cost: 15, lead_time_days: 2, ai_score: 91, recommendation: "Lower Cost Option" },
        ]
      : [
          { vendor_name: request.preferred_vendor || "Amazon Business", unit_price: 10, shipping_cost: 15, lead_time_days: 2, ai_score: 80, recommendation: "Default Option" },
        ];

  return defaults.map((q) => ({
    request_id: request.id,
    vendor_name: q.vendor_name,
    unit_price: q.unit_price,
    shipping_cost: q.shipping_cost,
    lead_time_days: q.lead_time_days,
    ai_score: q.ai_score,
    recommendation: q.recommendation,
    status: "generated",
  }));
}
