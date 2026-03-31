import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
  subscription_status: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
};

export async function POST(req: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return Response.json(
        { error: "Missing NEXT_PUBLIC_SUPABASE_URL" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return Response.json(
        { error: "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseUserClient.auth.getUser(accessToken);

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, email, plan, subscription_status, stripe_customer_id, stripe_subscription_id, current_period_end"
      )
      .eq("id", user.id)
      .single<ProfileRow>();

    if (profileError || !profile) {
      console.error("Profile lookup error:", profileError);
      return Response.json(
        { error: "Could not load subscription profile." },
        { status: 500 }
      );
    }

    const alreadyCanceled =
      profile.plan === "free" ||
      profile.subscription_status === "canceled" ||
      !profile.stripe_subscription_id;

    if (alreadyCanceled) {
      const { error: cleanupError } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: "free",
          subscription_status: "canceled",
          current_period_end: null,
          stripe_subscription_id: null,
        })
        .eq("id", user.id);

      if (cleanupError) {
        console.error("Profile cleanup error:", cleanupError);
      }

      return Response.json({
        success: true,
        message: "Subscription is already canceled.",
      });
    }

    const subscriptionId = profile.stripe_subscription_id;

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      if (subscription.status !== "canceled") {
        await stripe.subscriptions.cancel(subscriptionId);
      }
    } catch (stripeError: any) {
      console.error("Stripe cancel error:", stripeError);

      const msg = String(stripeError?.message || "").toLowerCase();

      const safeAlreadyCanceled =
        msg.includes("already canceled") ||
        msg.includes("no such subscription") ||
        msg.includes("canceled subscription") ||
        msg.includes("resource_missing");

      if (!safeAlreadyCanceled) {
        return Response.json(
          { error: "Server error while canceling subscription." },
          { status: 500 }
        );
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        plan: "free",
        subscription_status: "canceled",
        current_period_end: null,
        stripe_subscription_id: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return Response.json(
        { error: "Subscription canceled in Stripe, but profile update failed." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Subscription canceled successfully.",
    });
  } catch (error) {
    console.error("Cancel subscription fatal error:", error);
    return Response.json(
      { error: "Server error while canceling subscription." },
      { status: 500 }
    );
  }
}
