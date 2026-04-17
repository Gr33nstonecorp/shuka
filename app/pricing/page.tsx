"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tighter mb-6">Pricing</h1>
          <p className="text-2xl text-zinc-600 dark:text-zinc-400">
            ShukAI is free to use.<br />Optional donation helps us improve the AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10">
            <h3 className="text-2xl font-semibold mb-2">Free</h3>
            <div className="text-5xl font-black mb-8">$0<span className="text-xl font-normal text-zinc-500">/month</span></div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-10">Full access during early stage</p>

            <ul className="space-y-4 mb-10">
              <li className="flex gap-3"><span className="text-green-600">✓</span> Unlimited manual requests</li>
              <li className="flex gap-3"><span className="text-green-600">✓</span> Basic vendor browsing</li>
              <li className="flex gap-3"><span className="text-green-600">✓</span> Saved items</li>
              <li className="flex gap-3"><span className="text-green-600">✓</span> AI Assistant (limited daily requests)</li>
            </ul>

            <Link href="/assistant" className="block text-center py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-black">
              Get Started Free
            </Link>
          </div>

          {/* Suggested Donation Tier */}
          <div className="bg-white dark:bg-zinc-900 border border-blue-600 rounded-3xl p-10 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-6 py-1 rounded-full">
              SUPPORT DEVELOPMENT
            </div>

            <h3 className="text-2xl font-semibold mb-2">Premium</h3>
            <div className="text-5xl font-black mb-8">$9<span className="text-xl font-normal text-zinc-500">/month</span></div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-10">Optional donation for faster improvements</p>

            <ul className="space-y-4 mb-10">
              <li className="flex gap-3"><span className="text-green-600">✓</span> Everything in Free</li>
              <li className="flex gap-3"><span className="text-green-600">✓</span> Unlimited AI Sourcing</li>
              <li className="flex gap-3"><span className="text-green-600">✓</span> Priority AI responses</li>
              <li className="flex gap-3"><span className="text-green-600">✓</span> Export features</li>
              <li className="flex gap-3"><span className="text-green-600">✓</span> Help support development</li>
            </ul>

            <Link href="#" className="block text-center py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700">
              Make a Donation ($9/mo)
            </Link>
          </div>
        </div>

        <div className="text-center mt-16 text-sm text-zinc-500">
          ShukAI is currently free for everyone.<br />
          Optional $9/month donation helps us improve the AI faster.
        </div>
      </div>
    </main>
  );
}
