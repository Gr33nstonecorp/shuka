case "checkout.session.completed": {
  const session = event.data.object as Stripe.Checkout.Session;

  // Arcade one-time payment flow
  if (session.metadata?.type === "arcade") {
    const arcadeSessionId = session.metadata?.arcade_session_id;

    if (arcadeSessionId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      await supabase
        .from("arcade_sessions")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
          amount_paid: session.amount_total ?? null,
        })
        .eq("id", arcadeSessionId);
    }

    break;
  }

  // Existing SaaS subscription flow below this line
  const userId = session.metadata?.userId;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : null;

  if (!userId || !subscriptionId) break;

  await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
    .from("profiles")
    .update({
      stripe_subscription_id: subscriptionId,
      subscription_status: "active",
      plan: session.metadata?.plan || "starter",
      current_period_end: null,
    })
    .eq("id", userId);

  break;
}
