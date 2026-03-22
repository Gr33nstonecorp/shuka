import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    if (!userId && !email) {
      return new Response(JSON.stringify({ error: "Missing userId/email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let profile: {
      id: string;
      email: string | null;
      stripe_customer_id: string | null;
    } | null = null;

    if (userId) {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, stripe_customer_id")
        .eq("id", userId)
        .maybeSingle();

      profile = data;
    }

    if (!profile && email) {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, stripe_customer_id")
        .eq("email", email)
        .maybeSingle();

      profile = data;
    }

    if (!profile) {
      return new Response(JSON.stringify({ error: "No profile found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!profile.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: "No Stripe customer found for this user yet" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: "https://www.shukai.co/profile",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || "Could not open billing portal",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
