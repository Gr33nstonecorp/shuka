"use client";

import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: 9,
    yearlyPrice: 99,
    description: "Perfect for individuals and small teams getting started",
    features: [
      "Manual purchase requests",
      "Basic vendor browsing",
      "Saved items",
      "Workspace overview",
      "Email support",
    ],
    cta: "Start with Starter",
    href: "/login",           // Changed to /login or signup flow
    popular: false,
  },
  {
    name: "Premium",
    price: 29,
    yearlyPrice: 290,
    description: "Full AI power for faster sourcing and better decisions",
    features: [
      "Everything in Starter",
      "Unlimited AI Assistant sourcing",
      "Advanced quote comparison",
      "Order tracking",
      "Priority support",
      "Export reports",
    ],
    cta: "Upgrade to Premium",
    href: "/assistant",       // Goes straight to AI for paid users
    popular: true,
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-semibold mb-6">
            Simple Pricing
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-6">
            Choose the plan that fits your team
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Start free. Upgrade anytime. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white dark:bg-zinc-900 rounded-2xl p-1 border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-8 py-3 rounded-xl font-medium transition ${
                !isYearly ? "bg-zinc-900 text-white" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-8 py-3 rounded-xl font-medium transition flex items-center gap-2 ${
                isYearly ? "bg-zinc-900 text-white" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Yearly <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">Save 2 months</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.price;
            const period = isYearly ? "/year" : "/month";

            return (
              <div
                key={plan.name}
                className={`bg-white dark:bg-zinc-900 border rounded-3xl p-10 flex flex-col ${
                  plan.popular ? "border-blue-500 relative" : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-6 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="text-2xl font-bold mb-1">{plan.name}</div>
                  <div className="text-5xl font-black tracking-tighter mb-2">
                    ${price}
                    <span className="text-xl font-normal text-zinc-500"> {period}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-8">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center py-4 rounded-2xl font-semibold transition ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-zinc-900 hover:bg-black text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16 text-zinc-500 text-sm">
          All plans include a free trial. Cancel anytime. Questions?{" "}
          <a href="mailto:hello@shukai.co" className="text-blue-600 hover:underline">
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}
