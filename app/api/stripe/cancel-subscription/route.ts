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
      .select("stripe_subscription_id, subscription_status")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return Response.json(
        { error: "Could not load subscription profile." },
        { status: 500 }
      );
    }

    if (!profile?.stripe_subscription_id) {
      return Response.json(
        { error: "No subscription found." },
        { status: 400 }
      );
    }

    const subscriptionId = profile.stripe_subscription_id as string;

    // Immediate cancellation = safest way to stop further charges.
    await stripe.subscriptions.cancel(subscriptionId);

    await supabaseAdmin
      .from("profiles")
      .update({
        subscription_status: "canceled",
        plan: "free",
        current_period_end: null,
      })
      .eq("id", user.id);

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
