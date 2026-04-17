"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Clean Top Navigation - No Menu Button */}
        <nav className="flex justify-between items-center mb-12 border-b pb-6">
          <Link href="/" className="font-bold text-2xl tracking-tighter">ShukAI</Link>
          
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/assistant" className="hover:text-blue-600">AI Assistant</Link>
            <Link href="/requests" className="hover:text-blue-600">Requests</Link>
            <Link href="/quotes" className="hover:text-blue-600">Quotes</Link>
            <Link href="/orders" className="hover:text-blue-600">Orders</Link>
            <Link href="/vendors" className="hover:text-blue-600">Vendors</Link>
            <Link href="/saved-items" className="hover:text-blue-600">Saved Items</Link>
          </div>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tighter mb-4">Support ShukAI</h1>
          <p className="text-2xl text-zinc-600 dark:text-zinc-400">
            ShukAI is completely free to use.<br />
            Optional donation helps us improve faster.
          </p>
        </div>

        {/* Single Donation Card */}
        <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 border border-blue-600 rounded-3xl p-12 text-center">
          <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-6 py-1.5 rounded-full mb-6">
            OPTIONAL DONATION
          </div>

          <div className="mb-8">
            <div className="text-7xl font-black mb-2">$5</div>
            <div className="text-2xl text-zinc-500">/month</div>
          </div>

          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10">
            Suggested monthly donation<br />for faster AI improvements
          </p>

          <ul className="space-y-4 text-left mb-12 max-w-xs mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Unlimited AI Sourcing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Priority AI responses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Export features</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Help support development</span>
            </li>
          </ul>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition text-lg">
            Make a $5 Monthly Donation
          </button>

          <p className="text-xs text-zinc-500 mt-8">
            You can cancel anytime. This is completely optional.
          </p>
        </div>

        <div className="text-center mt-16 text-sm text-zinc-500">
          ShukAI core features remain free for everyone.<br />
          Thank you for supporting the project!
        </div>
      </div>
    </main>
  );
}
