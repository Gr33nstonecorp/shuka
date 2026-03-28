import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    const userId = typeof body.userId === "string" ? body.userId : "";

    if (!userId) {
      return jsonResponse({ error: "Missing userId" }, 400);
    }

    const supabase = getSupabaseAdmin();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_subscription_id, stripe_customer_id, plan, subscription_status")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      return jsonResponse({ error: profileError.message }, 500);
    }

    if (!profile?.stripe_subscription_id) {
      return jsonResponse({ error: "No active subscription found" }, 400);
    }

    const subscription = await stripe.subscriptions.retrieve(
      profile.stripe_subscription_id
    );

    const now = Math.floor(Date.now() / 1000);
    const isTrialing =
      subscription.status === "trialing" &&
      !!subscription.trial_end &&
      subscription.trial_end > now;

    if (isTrialing) {
      // During trial: cancel immediately so user is never charged
      const canceled = await stripe.subscriptions.cancel(subscription.id);

      await supabase
        .from("profiles")
        .update({
          plan: "free",
          subscription_status: canceled.status || "canceled",
          current_period_end: null,
          stripe_subscription_id: canceled.id,
        })
        .eq("id", userId);

      return jsonResponse({
        success: true,
        message: "Trial canceled immediately. You will not be charged.",
        mode: "immediate_trial_cancel",
      });
    }

    // Paid subscription: keep access until end of current paid period
    const updated = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    const currentPeriodEnd = updated.current_period_end
      ? new Date(updated.current_period_end * 1000).toISOString()
      : null;

    await supabase
      .from("profiles")
      .update({
        subscription_status: updated.status,
        current_period_end: currentPeriodEnd,
      })
      .eq("id", userId);

    return jsonResponse({
      success: true,
      message: "Subscription will cancel at the end of the current billing period.",
      mode: "cancel_at_period_end",
      current_period_end: currentPeriodEnd,
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return jsonResponse({ error: "Failed to cancel subscription" }, 500);
  }
}
