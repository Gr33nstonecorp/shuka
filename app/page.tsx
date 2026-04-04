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

      {/* Why teams use ShukAI */}
      <div className="bg-white dark:bg-zinc-900 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Why teams use ShukAI</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Save time and money on procurement</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-6">⏱️</div>
              <h3 className="text-2xl font-semibold mb-3">Cut sourcing time</h3>
              <p className="text-zinc-600 dark:text-zinc-400">From hours of manual research to minutes with AI</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-6">💰</div>
              <h3 className="text-2xl font-semibold mb-3">Better pricing</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Compare real vendor quotes instantly</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-6">📋</div>
              <h3 className="text-2xl font-semibold mb-3">Everything in one place</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Requests, quotes, orders, and saved items</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="text-6xl mb-6">1️⃣</div>
              <h3 className="text-2xl font-semibold mb-3">Tell us what you need</h3>
              <p className="text-zinc-600">Type your items — gloves, tape, boxes, etc.</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">2️⃣</div>
              <h3 className="text-2xl font-semibold mb-3">AI finds options</h3>
              <p className="text-zinc-600">ShukAI searches suppliers and returns best quotes</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">3️⃣</div>
              <h3 className="text-2xl font-semibold mb-3">Compare & order</h3>
              <p className="text-zinc-600">Review, add to requests, and place orders</p>
            </div>
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
