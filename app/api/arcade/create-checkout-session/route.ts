import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_ARCADE_PRICE_ID) {
      return Response.json(
        { error: "Missing STRIPE_ARCADE_PRICE_ID" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const playerName =
      typeof body?.playerName === "string" ? body.playerName.trim() : "Player";

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: sessionRow, error: insertError } = await supabase
      .from("arcade_sessions")
      .insert({
        email: email || null,
        player_name: playerName || "Player",
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !sessionRow) {
      return Response.json(
        { error: "Could not create arcade session." },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shukai.co";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPE_ARCADE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      success_url: `${siteUrl}/arcade/play?session_id=${sessionRow.id}`,
      cancel_url: `${siteUrl}/arcade?checkout=cancel`,
      metadata: {
        type: "arcade",
        arcade_session_id: sessionRow.id,
        email: email || "",
        player_name: playerName || "Player",
      },
    });

    const { error: updateError } = await supabase
      .from("arcade_sessions")
      .update({
        stripe_checkout_session_id: checkoutSession.id,
      })
      .eq("id", sessionRow.id);

    if (updateError) {
      return Response.json(
        { error: "Could not update arcade session." },
        { status: 500 }
      );
    }

    return Response.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Arcade checkout error:", error);
    return Response.json(
      { error: error.message || "Could not start arcade checkout." },
      { status: 500 }
    );
  }
}
