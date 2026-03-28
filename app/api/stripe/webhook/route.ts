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

  const { error } = await supabase
    .from("profiles")
    .update({
      email,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_status: "active",
      plan: requestedPlan,
      current_period_end: null,
    })
    .eq("id", userId);

  if (error) {
    throw new Error(`Supabase profile update failed: ${error.message}`);
  }
}

async function handleSubscriptionUpsert(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  if (!customerId) {
    throw new Error("Missing customer id on subscription");
  }

  const firstItem = subscription.items.data[0];
  const priceId =
    typeof firstItem?.price === "object" && firstItem?.price?.id
      ? firstItem.price.id
      : null;

  const plan = getPlanFromPriceId(priceId);

  await updateProfileByCustomerId(customerId, {
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    plan,
    current_period_end: null,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  if (!customerId) {
    throw new Error("Missing customer id on subscription");
  }

  await updateProfileByCustomerId(customerId, {
    stripe_subscription_id: subscription.id,
    subscription_status: "canceled",
    plan: "free",
    current_period_end: null,
  });
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return jsonResponse({ error: "Missing Stripe signature" }, 400);
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return jsonResponse({ error: "Missing STRIPE_WEBHOOK_SECRET" }, 500);
    }

    const body = await req.text();

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      default:
        break;
    }

    return jsonResponse({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return jsonResponse({ error: "Webhook handler failed" }, 400);
  }
}
