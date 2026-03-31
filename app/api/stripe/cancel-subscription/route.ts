import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
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
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseUserClient.auth.getUser(accessToken);

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, stripe_subscription_id, stripe_customer_id, plan, subscription_status")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      return Response.json(
        { error: "Could not load subscription profile." },
        { status: 500 }
      );
    }

    if (!profile) {
      return Response.json(
        { error: "No profile row found for this account." },
        { status: 404 }
      );
    }

    if (!profile.stripe_subscription_id) {
      return Response.json(
        { error: "No Stripe subscription is attached to this account." },
        { status: 400 }
      );
    }

    const subscriptionId = profile.stripe_subscription_id as string;

    await stripe.subscriptions.cancel(subscriptionId);

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        subscription_status: "canceled",
        plan: "free",
        current_period_end: null,
        stripe_subscription_id: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error after cancel:", updateError);
      return Response.json(
        {
          error:
            "Stripe canceled the subscription, but profile update failed. Check the profile row.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Subscription canceled immediately.",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return Response.json(
      { error: "Server error while canceling subscription." },
      { status: 500 }
    );
  }
}
