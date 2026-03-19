import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return new Response(
        JSON.stringify({ error: "Missing STRIPE_SECRET_KEY in environment variables." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const stripe = new Stripe(secretKey);

    const priceId =
      plan === "premium"
        ? process.env.STRIPE_PREMIUM_PRICE_ID
        : process.env.STRIPE_STARTER_PRICE_ID;

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: `Missing price ID for plan: ${plan}` }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shukai.co";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: `${siteUrl}/pricing?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Stripe checkout creation failed." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
