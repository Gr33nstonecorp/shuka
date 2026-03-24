import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getPlanFromPriceId(priceId: string | null | undefined) {
  if (!priceId) return "free";

  if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY) return "starter";
  if (priceId === process.env.STRIPE_PRICE_PREMIUM_MONTHLY) return "premium";

  return "free";
}

async function updateProfileByCustomerId(
  stripeCustomerId: string,
  updates: Record<string, unknown>
) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("stripe_customer_id", stripeCustomerId);

  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
}

async function updateProfileByUserId(
  userId: string,
  updates: Record<string, unknown>
) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdmin();

  const userId = session.metadata?.userId;
  const customerId =
    typeof session.customer === "string" ? session.customer : null;
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : null;
  const email = session.customer_details?.email || session.customer_email || null;
  const requestedPlan = session.metadata?.plan || "starter";

  if (!userId) {
    throw new Error("Missing userId in checkout session metadata");
  }

  let currentPeriodEnd: string | null = null;
  let subscriptionStatus = "active";
  let plan = requestedPlan;

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    subscriptionStatus = subscription.status;

    const firstItem = subscription.items.data[0];
    const priceId = firstItem?.price?.id || null;
    plan = getPlanFromPriceId(priceId) || requestedPlan;

    currentPeriodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      email,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_status: subscriptionStatus,
      plan,
      current_period_end: currentPeriodEnd,
    })
    .eq("id", userId);

  if (error) {
    throw new Error(`Supabase profile update failed: ${error.message}`);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  if (!customerId) {
    throw new Error("Missing customer id on subscription");
  }

  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price?.id || null;

  const plan = getPlanFromPriceId(priceId);
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  await updateProfileByCustomerId(customerId, {
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    plan,
    current_period_end: currentPeriodEnd,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  if (!customerId) {
    throw new Error("Missing customer id on subscription");
  }

  await updateProfileByCustomerId(customerId, {
    subscription_status: "canceled",
    plan: "free",
    current_period_end: null,
    stripe_subscription_id: subscription.id,
  });
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return jsonResponse({ error: "Missing Stripe signature" }, 400);
    }

    const body = await req.text();

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;
      }

      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;
      }

      default:
        break;
    }

    return jsonResponse({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return jsonResponse({ error: "Webhook handler failed" }, 400);
  }
}
