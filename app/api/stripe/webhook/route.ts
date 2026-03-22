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
  } catch {
    return new Response("Webhook error", { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // ✅ CHECKOUT COMPLETED
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan || "starter";

    const customerId =
      typeof session.customer === "string" ? session.customer : null;

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : null;

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          plan,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        })
        .eq("id", userId);
    }
  }

  // ✅ SUB CREATED (backup safety)
  if (event.type === "customer.subscription.created") {
    const sub = event.data.object as Stripe.Subscription;

    const userId = sub.metadata?.userId;
    const plan = sub.metadata?.plan || "starter";

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          plan,
          stripe_customer_id: sub.customer as string,
          stripe_subscription_id: sub.id,
        })
        .eq("id", userId);
    }
  }

  // ❌ CANCEL
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.userId;

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          plan: "trial",
          stripe_subscription_id: null,
        })
        .eq("id", userId);
    }
  }

  return new Response("ok", { status: 200 });
}
