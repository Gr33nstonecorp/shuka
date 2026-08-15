import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function calculateShukaiFee(
  amountInCents: number,
  plan: string | null
) {
  const isPro = plan === "pro";

  // Pro = 1%
  // Free = 3%
  const percentage = isPro ? 0.01 : 0.03;

  let fee = Math.round(amountInCents * percentage);

  // Minimum $3 on Free plan
  if (!isPro) {
    fee = Math.max(fee, 300);
  }

  // Maximum $30
  fee = Math.min(fee, 3000);

  // Never let the fee exceed the actual charge
  fee = Math.min(fee, amountInCents);

  return fee;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const quoteId =
      typeof body.quoteId === "string"
        ? body.quoteId.trim()
        : "";

    if (!quoteId) {
      return NextResponse.json(
        { error: "Missing quoteId" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    /*
      IMPORTANT:
      The browser only sends quoteId.

      It does NOT send:
      - price
      - provider plan
      - Stripe account ID
      - platform fee

      We read all of those from Supabase.
    */

    const { data: quote, error: quoteError } =
      await supabase
        .from("landscaper_quotes")
        .select(`
          id,
          job_id,
          landscaper_id,
          amount,
          status
        `)
        .eq("id", quoteId)
        .maybeSingle();

    if (quoteError) {
      console.error("Quote lookup error:", quoteError);

      return NextResponse.json(
        { error: quoteError.message },
        { status: 500 }
      );
    }

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    if (
      quote.status !== "accepted" &&
      quote.status !== "pending_payment"
    ) {
      return NextResponse.json(
        { error: "This quote is not ready for payment" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(
      Number(quote.amount) * 100
    );

    if (
      !Number.isFinite(amountInCents) ||
      amountInCents <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid quote amount" },
        { status: 400 }
      );
    }

    /*
      Get landscaper account + subscription status
    */

    const { data: landscaper, error: providerError } =
      await supabase
        .from("profiles")
        .select(`
          id,
          plan,
          subscription_status,
          stripe_connect_account_id
        `)
        .eq("id", quote.landscaper_id)
        .maybeSingle();

    if (providerError) {
      console.error(
        "Landscaper lookup error:",
        providerError
      );

      return NextResponse.json(
        { error: providerError.message },
        { status: 500 }
      );
    }

    if (!landscaper) {
      return NextResponse.json(
        { error: "Landscaper account not found" },
        { status: 404 }
      );
    }

    if (!landscaper.stripe_connect_account_id) {
      return NextResponse.json(
        {
          error:
            "Landscaper has not connected their payout account",
        },
        { status: 400 }
      );
    }

    /*
      Only give the Pro rate to an actually active
      Pro subscription.
    */

    const activePro =
      landscaper.plan === "pro" &&
      (
        landscaper.subscription_status === "active" ||
        landscaper.subscription_status === "trialing"
      );

    const plan = activePro ? "pro" : "free";

    const shukaiFee = calculateShukaiFee(
      amountInCents,
      plan
    );

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.shukai.co";

    /*
      Stripe Connect Destination Charge

      Customer pays full job price.

      Stripe transfers the job money to the
      connected landscaper and ShukAI receives
      application_fee_amount.
    */

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        line_items: [
          {
            price_data: {
              currency: "usd",

              product_data: {
                name: "ShukAI Landscaping Service",

                description: `Job ${quote.job_id}`,
              },

              unit_amount: amountInCents,
            },

            quantity: 1,
          },
        ],

        payment_intent_data: {
          application_fee_amount: shukaiFee,

          transfer_data: {
            destination:
              landscaper.stripe_connect_account_id,
          },

          metadata: {
            type: "landscaping_job",
            quoteId: quote.id,
            jobId: quote.job_id,
            landscaperId: quote.landscaper_id,
            plan,
            shukaiFee: String(shukaiFee),
          },
        },

        metadata: {
          type: "landscaping_job",
          quoteId: quote.id,
          jobId: quote.job_id,
          landscaperId: quote.landscaper_id,
          plan,
          shukaiFee: String(shukaiFee),
        },

        success_url:
          `${siteUrl}/jobs/${quote.job_id}` +
          `?payment=success&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${siteUrl}/jobs/${quote.job_id}` +
          `?payment=canceled`,
      });

    /*
      Mark this quote as waiting for payment.
    */

    const { error: updateError } =
      await supabase
        .from("landscaper_quotes")
        .update({
          status: "pending_payment",
          stripe_checkout_session_id: session.id,
          shukai_fee: shukaiFee / 100,
        })
        .eq("id", quote.id);

    if (updateError) {
      console.error(
        "Quote payment update error:",
        updateError
      );
    }

    return NextResponse.json({
      url: session.url,

      quoteId: quote.id,

      amount: amountInCents / 100,

      fee: shukaiFee / 100,

      plan,
    });
  } catch (error) {
    console.error(
      "ShukAI job checkout error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Could not start job checkout";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
