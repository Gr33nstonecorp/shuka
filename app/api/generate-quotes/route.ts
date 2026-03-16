import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { request_id, product_name, quantity } = body;

  // Simulated AI vendor sourcing (we'll replace with real APIs later)
  const vendors = [
    {
      vendor_name: "Amazon Business",
      unit_price: 18,
      shipping_cost: 5,
      lead_time_days: 2,
      ai_score: 92,
    },
    {
      vendor_name: "Uline",
      unit_price: 21,
      shipping_cost: 8,
      lead_time_days: 3,
      ai_score: 88,
    },
    {
      vendor_name: "Alibaba",
      unit_price: 12,
      shipping_cost: 15,
      lead_time_days: 10,
      ai_score: 75,
    },
  ];

  const inserts = vendors.map((v) => ({
    request_id,
    ...v,
    status: "generated",
  }));

  const { error } = await supabase
    .from("quote_options")
    .insert(inserts);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }));
}
