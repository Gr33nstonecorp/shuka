// After successful sign in (in your login handler)
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (!error) {
  // Check if user has access to AI
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status, current_period_end")
    .eq("id", user.id)
    .single();

  const hasAccess = hasActivePaidPlan(profile);

  // Redirect logic
  if (hasAccess) {
    window.location.href = "/assistant";   // Paid users go straight to AI
  } else {
    window.location.href = "/";            // Free/trial users go to homepage
  }
}
