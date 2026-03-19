import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const priceId =
      plan === "premium"
        ? process.env.STRIPE_PREMIUM_PRICE_ID!
        : process.env.STRIPE_STARTER_PRICE_ID!;

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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?checkout=cancel`,
    });

    return Response.json({ url: session.url });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Checkout creation failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
