import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { plan } = await req.json();

  // ✅ THIS FIXES AUTH
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const priceId =
    plan === "premium"
      ? "price_PREMIUM_ID_HERE"
      : "price_STARTER_ID_HERE";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],

    success_url: "https://www.shukai.co/profile",
    cancel_url: "https://www.shukai.co/profile",

    metadata: {
      userId: user.id,
      plan,
    },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
  });
}
