import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { plan, userId, email } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const selectedPlan = plan === "premium" ? "premium" : "starter";

    const priceId =
      selectedPlan === "premium"
        ? process.env.STRIPE_PREMIUM_PRICE_ID
        : process.env.STRIPE_STARTER_PRICE_ID;

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: `Missing price ID for ${selectedPlan}` }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shukai.co";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      success_url: `${siteUrl}/profile`,
      cancel_url: `${siteUrl}/pricing?checkout=cancel`,
      metadata: {
        userId,
        email: email || "",
        plan: selectedPlan,
      },
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId,
          email: email || "",
          plan: selectedPlan,
        },
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || "Could not start checkout.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
