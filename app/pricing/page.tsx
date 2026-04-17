"use client";

import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: 0,
      period: "",
      description: "Perfect for individuals and small teams getting started",
      features: [
        "Unlimited manual purchase requests",
        "Basic vendor browsing",
        "Saved items",
        "Workspace overview",
        "Email support",
        "Limited AI sourcing (10 requests/day)",
      ],
      cta: "Get Started Free",
      href: "/assistant",
      popular: false,
    },
    {
      name: "Premium",
      price: isYearly ? 89 : 9,
      period: isYearly ? "/year" : "/month",
      description: "Full AI power for serious users",
      features: [
        "Everything in Starter",
        "Unlimited AI Sourcing",
        "Priority AI responses",
        "Export quotes & orders",
        "Advanced vendor matching",
        "Priority support",
      ],
      cta: "Upgrade to Premium",
      href: "#", // Connect Stripe later
      popular: true,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tighter mb-6">Simple Pricing</h1>
          <p className="text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Start completely free. Upgrade only when you need unlimited AI power.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 flex">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${!isYearly ? "bg-white dark:bg-zinc-900 shadow" : ""}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${isYearly ? "bg-white dark:bg-zinc-900 shadow" : ""}`}
            >
              Yearly <span className="text-green-600">(Save ~20%)</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white dark:bg-zinc-900 border rounded-3xl p-10 relative ${
                plan.popular ? "border-blue-600 scale-105" : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-6 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-5xl font-black">${plan.price}</span>
                  <span className="text-xl text-zinc-500 ml-2">{plan.period}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 mt-4">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-4 rounded-2xl font-semibold transition ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-zinc-900 text-white hover:bg-black"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 text-sm text-zinc-500">
          Everything starts free. Upgrade anytime for unlimited AI sourcing.<br />
          No credit card required to start.
        </div>
      </div>
    </main>
  );
}
