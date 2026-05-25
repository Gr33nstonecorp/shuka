import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",   // ← Updated to current version
});

export async function POST(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Support ShukAI",
              description: "Thank you for supporting development and faster AI improvements",
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/assistant?donation=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/assistant`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Donation checkout error:", error);
    return NextResponse.json({ error: "Failed to create donation session" }, { status: 500 });
  }
}
