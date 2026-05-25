import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const sessionId = body.sessionId;

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Missing sessionId" }),
        { status: 400 }
      );
    }

    // Retrieve Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Example verification logic
    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ verified: false, status: session.payment_status }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        verified: true,
        customerEmail: session.customer_details?.email ?? null,
        amountTotal: session.amount_total,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "Verification failed",
        details: err?.message ?? "Unknown error",
      }),
      { status: 500 }
    );
  }
}
