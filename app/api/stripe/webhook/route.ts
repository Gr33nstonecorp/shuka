import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Arcade one-time payment flow
        if (session.metadata?.type === "arcade") {
          const arcadeSessionId = session.metadata?.arcade_session_id;

          if (arcadeSessionId) {
            const { error } = await supabase
              .from("arcade_sessions")
              .update({
                status: "paid",
                paid_at: new Date().toISOString(),
                stripe_checkout_session_id: session.id,
                stripe_payment_intent_id:
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : null,
                amount_paid: session.amount_total ?? null,
              })
              .eq("id", arcadeSessionId);

            if (error) {
              console.error("Arcade session update error:", error);
              throw new Error("Failed to update arcade session");
            }
          }

          break;
        }

        // SaaS subscription flow
        const userId = session.metadata?.userId;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : null;

        if (!userId || !subscriptionId) {
          break;
        }

        const { error } = await supabase
          .from("profiles")
          .update({
            stripe_subscription_id: subscriptionId,
            subscription_status: "active",
            plan: session.metadata?.plan || "starter",
            current_period_end: null,
          })
          .eq("id", userId);

        if (error) {
          console.error("Profile update error on checkout completion:", error);
          throw new Error("Failed to update profile on checkout completion");
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          break;
        }

        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: subscription.status,
            plan: subscription.metadata?.plan || undefined,
            current_period_end: null,
          })
          .eq("id", userId);

        if (error) {
          console.error("Profile update error on subscription update:", error);
          throw new Error("Failed to update profile on subscription update");
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          break;
        }

        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "canceled",
            plan: "free",
            stripe_subscription_id: null,
            current_period_end: null,
          })
          .eq("id", userId);

        if (error) {
          console.error("Profile update error on subscription delete:", error);
          throw new Error("Failed to update profile on subscription delete");
        }

        break;
      }

      default:
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
