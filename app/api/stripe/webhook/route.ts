import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Use service role key (IMPORTANT)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  try {
    switch (event.type) {

      // ✅ PAYMENT SUCCESS (MAIN ONE)
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan || "starter";

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const email = session.customer_details?.email;

        if (!userId && !email) {
          console.error("No userId or email found in session");
          break;
        }

        // 🔥 Update user profile
        await supabase
          .from("profiles")
          .update({
            plan,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
          .eq("id", userId);

        break;
      }

      // ✅ SUBSCRIPTION CREATED (backup safety)
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;

        const customerId = sub.customer as string;
        const subscriptionId = sub.id;

        await supabase
          .from("profiles")
          .update({
            stripe_subscription_id: subscriptionId,
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      // ✅ SUBSCRIPTION CANCELLED (YOU JUST ASKED FOR THIS)
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const customerId = sub.customer as string;

        await supabase
          .from("profiles")
          .update({
            plan: "trial", // downgrade
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      // ✅ OPTIONAL: PAYMENT FAILED
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const customerId = invoice.customer as string;

        await supabase
          .from("profiles")
          .update({
            plan: "trial",
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return new Response("Success", { status: 200 });

  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
