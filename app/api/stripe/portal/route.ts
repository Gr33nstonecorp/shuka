import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  const session = await stripe.billingPortal.sessions.create({
    customer: profile?.stripe_customer_id,
    return_url: "https://www.shukai.co/profile",
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
  });
}
