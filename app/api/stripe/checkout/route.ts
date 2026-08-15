import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_PRO_PRICE_ID) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRO_PRICE_ID" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));

    const { email, userId } = body;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.shukai.co";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],

      ...(email
        ? {
            customer_email: email,
          }
        : {}),

      metadata: {
        userId: userId || "",
        plan: "pro",
      },

      subscription_data: {
        metadata: {
          userId: userId || "",
          plan: "pro",
        },
      },

      success_url: `${siteUrl}/provider?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${siteUrl}/pricing?upgrade=canceled`,

      allow_promotion_codes: true,

      billing_address_collection: "auto",
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: unknown) {
    console.error("Stripe Pro checkout error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Could not start checkout";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
