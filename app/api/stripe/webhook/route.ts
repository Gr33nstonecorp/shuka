import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Webhook error", { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const customerId = session.customer;
    const subscriptionId = session.subscription;
    const email = session.customer_details?.email;

    if (email) {
      await supabase
        .from("profiles")
        .update({
          plan: "starter",
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        })
        .eq("email", email);
    }
  }

  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as any;

    await supabase
      .from("profiles")
      .update({
        stripe_subscription_id: subscription.id,
      })
      .eq("stripe_customer_id", subscription.customer);
  }

  return new Response("ok", { status: 200 });
}
