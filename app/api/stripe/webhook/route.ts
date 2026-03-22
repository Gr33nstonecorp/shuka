import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const email =
        session.customer_details?.email || session.metadata?.email || null;
      const plan = session.metadata?.plan || "starter";

      const customerId =
        typeof session.customer === "string" ? session.customer : null;

      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;

      console.log("checkout.session.completed", {
        email,
        plan,
        customerId,
        subscriptionId,
      });

      if (email) {
        const { error } = await supabase
          .from("profiles")
          .update({
            plan,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
          .eq("email", email);

        if (error) {
          console.error("checkout.session.completed update error:", error);
        }
      } else {
        console.error("checkout.session.completed: missing email");
      }
    }

    if (event.type === "customer.subscription.created") {
      const subscription = event.data.object as Stripe.Subscription;

      const email = subscription.metadata?.email || null;
      const plan = subscription.metadata?.plan || "starter";
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : null;

      console.log("customer.subscription.created", {
        email,
        plan,
        customerId,
        subscriptionId: subscription.id,
      });

      if (email) {
        const { error } = await supabase
          .from("profiles")
          .update({
            plan,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
          })
          .eq("email", email);

        if (error) {
          console.error("customer.subscription.created update error:", error);
        }
      } else if (customerId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            plan,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("customer.subscription.created fallback update error:", error);
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      const email = subscription.metadata?.email || null;
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : null;

      console.log("customer.subscription.deleted", {
        email,
        customerId,
        subscriptionId: subscription.id,
      });

      if (email) {
        const { error } = await supabase
          .from("profiles")
          .update({
            plan: "trial",
            stripe_subscription_id: null,
          })
          .eq("email", email);

        if (error) {
          console.error("customer.subscription.deleted update error:", error);
        }
      } else if (customerId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            plan: "trial",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("customer.subscription.deleted fallback update error:", error);
        }
      }
    }

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
