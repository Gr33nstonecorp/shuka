import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];

  if (!item?.current_period_end) {
    return null;
  }

  return new Date(item.current_period_end * 1000).toISOString();
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", {
      status: 400,
    });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");

    return new Response("Missing webhook configuration", {
      status: 500,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe webhook signature failed:", error);

    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  const supabase = getSupabaseAdmin();

  try {
    switch (event.type) {
      // ----------------------------------------------------
      // CHECKOUT COMPLETED
      // ----------------------------------------------------
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        // Keep your existing arcade payment system working
        if (session.metadata?.type === "arcade") {
          const arcadeSessionId =
            session.metadata.arcade_session_id;

          if (!arcadeSessionId) {
            break;
          }

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
            .eq("id", arcadeSessionId)
            .eq("status", "pending");

          if (error) {
            console.error(
              "Arcade payment update error:",
              error
            );

            throw new Error(
              "Failed to mark arcade session paid"
            );
          }

          break;
        }

        // ShukAI Pro subscription
        const userId = session.metadata?.userId;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : null;

        if (!userId || !subscriptionId) {
          console.log(
            "Checkout completed without ShukAI subscription metadata"
          );

          break;
        }

        const subscription =
          await stripe.subscriptions.retrieve(
            subscriptionId
          );

        const currentPeriodEnd =
          getCurrentPeriodEnd(subscription);

        const { error } = await supabase
          .from("profiles")
          .update({
            stripe_subscription_id: subscriptionId,

            subscription_status:
              subscription.status,

            plan: "pro",

            current_period_end:
              currentPeriodEnd,
          })
          .eq("id", userId);

        if (error) {
          console.error(
            "Profile subscription activation error:",
            error
          );

          throw new Error(
            "Failed to activate Pro subscription"
          );
        }

        console.log(
          `ShukAI Pro activated for user ${userId}`
        );

        break;
      }

      // ----------------------------------------------------
      // SUBSCRIPTION UPDATED
      // ----------------------------------------------------
      case "customer.subscription.updated": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const userId =
          subscription.metadata?.userId;

        if (!userId) {
          break;
        }

        const currentPeriodEnd =
          getCurrentPeriodEnd(subscription);

        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";

        const { error } = await supabase
          .from("profiles")
          .update({
            stripe_subscription_id:
              subscription.id,

            subscription_status:
              subscription.status,

            plan: isActive
              ? "pro"
              : "free",

            current_period_end:
              currentPeriodEnd,
          })
          .eq("id", userId);

        if (error) {
          console.error(
            "Subscription update error:",
            error
          );

          throw new Error(
            "Failed to update subscription"
          );
        }

        break;
      }

      // ----------------------------------------------------
      // SUBSCRIPTION CANCELED
      // ----------------------------------------------------
      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const userId =
          subscription.metadata?.userId;

        if (!userId) {
          break;
        }

        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status:
              "canceled",

            plan:
              "free",

            stripe_subscription_id:
              null,

            current_period_end:
              null,
          })
          .eq("id", userId);

        if (error) {
          console.error(
            "Subscription cancellation error:",
            error
          );

          throw new Error(
            "Failed to cancel subscription"
          );
        }

        console.log(
          `ShukAI Pro canceled for user ${userId}`
        );

        break;
      }

      // ----------------------------------------------------
      // SUBSCRIPTION PAYMENT FAILED
      // ----------------------------------------------------
      case "invoice.payment_failed": {
        const invoice =
          event.data.object as Stripe.Invoice;

        console.warn(
          "ShukAI Pro invoice payment failed:",
          invoice.id
        );

        break;
      }

      // ----------------------------------------------------
      // JOB PAYMENT FAILED
      // ----------------------------------------------------
      case "payment_intent.payment_failed": {
        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        console.warn(
          "Job payment failed:",
          paymentIntent.id
        );

        break;
      }

      default:
        break;
    }

    return new Response("ok", {
      status: 200,
    });
  } catch (error) {
    console.error(
      "Webhook handler error:",
      error
    );

    return new Response(
      "Webhook handler failed",
      {
        status: 500,
      }
    );
  }
}
