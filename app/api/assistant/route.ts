import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ProfileRow = {
  id: string;
  plan: string | null;
  subscription_status: string | null;
  current_period_end: string | null;
};

function hasActivePaidPlan(profile: ProfileRow | null) {
  if (!profile) return false;

  const paidPlan =
    profile.plan === "starter" || profile.plan === "premium";

  const activeStatus =
    profile.subscription_status === "active" ||
    profile.subscription_status === "trialing";

  if (!paidPlan || !activeStatus) return false;

  if (!profile.current_period_end) return activeStatus;

  const end = new Date(profile.current_period_end).getTime();
  return Number.isFinite(end) && end > Date.now();
}

function parseInput(input: string) {
  return input
    .split("\n")
    .map((line) => {
      const [name, qty] = line.split("-");
      return {
        item: name?.trim(),
        quantity: Number(qty?.trim()) || 1,
      };
    })
    .filter((x) => x.item);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 🔐 Get user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔐 Get profile from DB
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, plan, subscription_status, current_period_end")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return Response.json(
        { error: "Profile lookup failed" },
        { status: 500 }
      );
    }

    // 🔐 HARD PAYWALL CHECK
    if (!hasActivePaidPlan(profile)) {
      return Response.json(
        { error: "Active paid subscription required" },
        { status: 403 }
      );
    }

    // 📥 Parse input
    const body = await req.json();
    const items = parseInput(body.input || "");

    if (!items.length) {
      return Response.json(
        { error: "No valid items provided" },
        { status: 400 }
      );
    }

    // 🤖 MOCK AI (replace later with real sourcing logic)
    const results = items.map((item) => ({
      item: item.item,
      quantity: item.quantity,
      best_quote: {
        vendor_name: "Sample Vendor",
        total: (item.quantity || 1) * 10,
        reason: "Lowest estimated cost with fastest delivery",
        product_url: "https://example.com/product",
      },
    }));

    return Response.json({ results });

  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
