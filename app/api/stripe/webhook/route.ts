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

async function upsertProfileById(
  userId: string,
  updates: Record<string, unknown>,
  fallbackEmail?: string | null
) {
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!existing) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: userId,
      email: fallbackEmail ?? null,
      plan: "free",
      subscription_status: "inactive",
      current_period_end: null,
      ...updates,
    });

    if (insertError) {
      throw new Error(`Profile insert failed: ${insertError.message}`);
    }

    return;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (updateError) {
    throw new Error(`Profile update failed: ${updateError.message}`);
  }
}

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
    console.error("Webhook signature failed:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const email = session.metadata?.email || session.customer_email || null;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;

        if (!userId) break;

        await upsertProfileById(
          userId,
          {
            stripe_subscription_id: subscriptionId,
            subscription_status: "active",
            plan: session.metadata?.plan || "starter",
            current_period_end: null,
          },
          email
        );

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        await upsertProfileById(userId, {
          subscription_status: subscription.status,
          plan: subscription.metadata?.plan || undefined,
          current_period_end: null,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        await upsertProfileById(userId, {
          subscription_status: "canceled",
          plan: "free",
          stripe_subscription_id: null,
          current_period_end: null,
        });

        break;
      }

      default:
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
