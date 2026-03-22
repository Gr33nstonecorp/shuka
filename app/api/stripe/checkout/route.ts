import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { plan } = await req.json();

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

  // 🔑 map your Stripe price IDs here
  const priceId =
    plan === "premium"
      ? "price_PREMIUM_ID_HERE"
      : "price_STARTER_ID_HERE";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    success_url: "https://www.shukai.co/profile",
    cancel_url: "https://www.shukai.co/profile",

    // 🔥 THIS IS THE MAGIC
    metadata: {
      userId: user.id,
      plan,
    },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
  });
}
