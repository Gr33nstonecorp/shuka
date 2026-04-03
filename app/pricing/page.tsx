"use client";

import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "29",
    period: "per month",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 10 requests per month",
      "Basic AI sourcing",
      "Email support",
      "Access to 50+ vendors",
      "Basic reporting",
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
      "Full AI sourcing engine",
      "Priority support",
      "Access to 200+ vendors",
      "Advanced analytics",
      "Team collaboration",
      "Export reports",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom needs",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "SSO & advanced security",
      "Unlimited users",
      "SLA guarantees",
      "Onboarding support",
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
            Start free. Scale as you grow. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-zinc-900 border rounded-3xl p-8 flex flex-col ${
                plan.popular ? "border-blue-600 scale-105 shadow-xl" : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {plan.popular && (
                <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full mb-6 w-fit">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <div className="text-2xl font-semibold">{plan.name}</div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                  {plan.period && <span className="text-zinc-500 ml-2">{plan.period}</span>}
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 mt-2">{plan.description}</div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.popular ? "/login?next=/pricing" : "/login"}
                className={`block text-center py-4 rounded-2xl font-semibold transition ${
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

        <div className="text-center mt-16 text-zinc-500">
          All plans include secure payments via Stripe. Questions? 
          <Link href="/contact" className="text-blue-600 hover:underline ml-1">Contact us</Link>
        </div>
      </div>
    </main>
  );
}
