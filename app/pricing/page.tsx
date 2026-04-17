"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - No extra nav here */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tighter mb-4">Support ShukAI</h1>
          <p className="text-2xl text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            ShukAI is completely free to use.<br />
            Optional donation helps us improve faster.
          </p>
        </div>

        {/* Single Clean Donation Card */}
        <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900 rounded-3xl p-12 text-center shadow-sm">
          <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-6 py-1.5 rounded-full mb-8">
            OPTIONAL DONATION
          </div>

          <div className="mb-10">
            <div className="text-7xl font-black tracking-tighter mb-1">$5</div>
            <div className="text-xl text-zinc-500">per month</div>
          </div>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10">
            Suggested monthly donation for faster AI improvements
          </p>

          <ul className="space-y-4 text-left mb-12 max-w-xs mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl leading-none mt-0.5">✓</span>
              <span>Unlimited AI Sourcing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl leading-none mt-0.5">✓</span>
              <span>Priority AI responses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl leading-none mt-0.5">✓</span>
              <span>Export features</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl leading-none mt-0.5">✓</span>
              <span>Help support development</span>
            </li>
          </ul>

          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-4 rounded-2xl text-lg"
          >
            Make a $5 Monthly Donation
          </button>

          <p className="text-xs text-zinc-500 mt-8">
            Completely optional • Cancel anytime
          </p>
        </div>

        <div className="text-center mt-16 text-sm text-zinc-500">
          Thank you for using ShukAI for free.<br />
          Your support helps us build better features faster.
        </div>
      </div>
    </main>
  );
}
