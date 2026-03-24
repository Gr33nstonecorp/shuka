export function hasActivePaidPlan(profile: {
  plan?: string | null;
  subscription_status?: string | null;
  current_period_end?: string | null;
}) {
  const paidPlan = profile.plan === "starter" || profile.plan === "premium";
  const activeStatus =
    profile.subscription_status === "active" ||
    profile.subscription_status === "trialing";

  if (!paidPlan || !activeStatus) return false;

  if (!profile.current_period_end) return activeStatus;

  const end = new Date(profile.current_period_end).getTime();
  return Number.isFinite(end) && end > Date.now();
}
