export type SubscriptionProfile = {
  plan?: string | null;
  subscription_status?: string | null;
  current_period_end?: string | null;
};

export function hasActivePaidPlan(profile: SubscriptionProfile | null) {
  if (!profile) return false;

  const paidPlan =
    profile.plan === "starter" || profile.plan === "premium";

  const activeStatus =
    profile.subscription_status === "active" ||
    profile.subscription_status === "trialing";

  if (!paidPlan || !activeStatus) return false;

  if (!profile.current_period_end) return true;

  const end = new Date(profile.current_period_end).getTime();

  if (!Number.isFinite(end)) return true;

  return end > Date.now();
}
