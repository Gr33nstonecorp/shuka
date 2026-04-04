"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function HomePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    }

    checkSession();

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("checkout") === "success") {
        setShowSuccess(true);
        window.history.replaceState({}, "", "/");
      }
    }
  }, [supabase]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {showSuccess && (
        <div className="bg-green-600 text-white py-4 text-center font-medium">
          🎉 Payment successful! Your subscription is now active.
        </div>
      )}

      {/* Hero */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-5 py-2 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Early Beta • 7-Day Free Trial</span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-8">
            AI that sources,<br />compares, and buys<br />from vendors for you.
          </h1>

          <p className="text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12">
            Describe what you need. ShukAI finds suppliers, compares pricing, and helps you place orders — automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Link
                href="/assistant"
                className="px-10 py-4 bg-zinc-900 hover:bg-black text-white text-lg font-semibold rounded-2xl transition"
              >
                Open AI Assistant
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="px-10 py-4 bg-zinc-900 hover:bg-black text-white text-lg font-semibold rounded-2xl transition"
              >
                Start 7-Day Free Trial
              </Link>
            )}

            <Link
              href="/pricing"
              className="px-10 py-4 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-lg font-semibold rounded-2xl transition"
            >
              See Pricing
            </Link>
          </div>

          <p className="text-sm text-zinc-500 mt-6">
            No charge today • Cancel anytime before billing starts
          </p>
        </div>
      </div>

      {/* How it works - AI Assistant as the star */}
      <div className="py-20 px-6 bg-white dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-semibold mb-6">
              CORE FEATURE
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Your AI Procurement Agent</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              The fastest way to source products
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="text-6xl mb-6">1️⃣</div>
              <h3 className="text-2xl font-semibold mb-3">Tell us what you need</h3>
              <p className="text-zinc-600">Type items like "50 nitrile gloves" or "20 rolls of packing tape"</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">2️⃣</div>
              <h3 className="text-2xl font-semibold mb-3">AI finds the best options</h3>
              <p className="text-zinc-600">ShukAI searches vendors and returns realistic quotes with reasons</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">3️⃣</div>
              <h3 className="text-2xl font-semibold mb-3">Add to requests & order</h3>
              <p className="text-zinc-600">Save the best options and turn them into purchase requests</p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/assistant"
              className="inline-block px-12 py-5 bg-zinc-900 text-white font-semibold rounded-2xl hover:bg-black text-lg transition"
            >
              Try the AI Assistant Now
            </Link>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">Your full procurement workspace</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4">Everything you need in one place</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Requests", href: "/requests", description: "Create and manage purchasing requests." },
              { label: "Quotes", href: "/quotes", description: "Review and compare vendor quotes." },
              { label: "Orders", href: "/orders", description: "Track approved and active orders." },
              { label: "Vendors", href: "/vendors", description: "Browse trusted suppliers." },
              { label: "Saved Items", href: "/saved-items", description: "Your shortlisted products." },
            ].map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:border-blue-500 transition-all hover:shadow-xl"
              >
                <div className="font-semibold text-2xl mb-3 group-hover:text-blue-600 transition">{tab.label}</div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{tab.description}</p>
                <div className="mt-8 text-blue-600 font-medium group-hover:underline">Open →</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 px-6 bg-zinc-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-6">
            Ready to source smarter?
          </h2>
          <p className="text-xl text-zinc-400 mb-10">
            Start your 7-day free trial. No charge today.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-12 py-5 bg-white text-zinc-900 font-semibold rounded-2xl hover:bg-zinc-100 text-lg transition"
          >
            Start 7-Day Free Trial
          </Link>
        </div>
      </div>
    </main>
  );
}
