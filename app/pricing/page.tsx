"use client";

import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "29",
    period: "per month",
    description: "Perfect for small teams and freelancers",
    features: [
      "Up to 15 requests per month",
      "Basic AI sourcing (5 runs/month)",
      "Access to core vendors",
      "Email support",
      "Basic analytics",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "79",
    period: "per month",
    description: "Best for growing procurement teams",
    features: [
      "Unlimited requests",
      "Unlimited AI sourcing",
      "Full vendor network (200+)",
      "Priority email + chat support",
      "Advanced analytics & reports",
      "Team collaboration (up to 5 users)",
      "Export data",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with complex needs",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Dedicated account manager",
      "Custom integrations (ERP, etc.)",
      "SSO & advanced security",
      "SLA & priority support",
      "On-site training",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-semibold mb-6">
            Pricing
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-6">Simple, transparent pricing</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Start for free. Scale as you grow. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-zinc-900 border rounded-3xl p-10 flex flex-col ${
                plan.popular 
                  ? "border-blue-600 shadow-2xl scale-[1.03]" 
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-6 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-10">
                <div className="text-3xl font-semibold mb-1">{plan.name}</div>
                <div className="flex items-baseline">
                  <span className="text-6xl font-black tracking-tighter">${plan.price}</span>
                  {plan.period && <span className="ml-2 text-zinc-500">{plan.period}</span>}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 mt-4">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.popular ? "/login?next=/pricing" : "/login"}
                className={`block text-center py-4 rounded-2xl font-semibold transition text-lg ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-zinc-900 hover:bg-black text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center text-zinc-500">
          All plans include secure payments via Stripe.<br />
          Have questions? <Link href="/contact" className="text-blue-600 hover:underline">Contact sales</Link>
        </div>
      </div>
    </main>
  );
}
