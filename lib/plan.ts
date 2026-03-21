export type AppPlan = "starter" | "premium" | "trial";

export type ProfileRow = {
  id: string;
  email: string | null;
  plan: AppPlan | string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  trial_ends_at?: string | null;
};

export function isPremiumPlan(plan?: string | null) {
  return plan === "premium";
}

export function isStarterPlan(plan?: string | null) {
  return plan === "starter";
}

export function isTrialPlan(plan?: string | null) {
  return plan === "trial";
}

export function canUsePremium(profile?: ProfileRow | null) {
  if (!profile) return false;
  return isPremiumPlan(profile.plan);
}
