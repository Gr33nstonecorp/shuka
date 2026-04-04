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
            Stop wasting hours manually searching suppliers. Tell ShukAI what you need — it finds options, compares prices, and helps you order.
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
            No charge today • Cancel anytime before billing starts • Takes less than 30 seconds to begin
          </p>
        </div>
      </div>

      {/* Why should I care? */}
      <div className="py-20 px-6 bg-white dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Why teams are switching to ShukAI</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Real time and money saved on procurement</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10">
              <div className="text-5xl mb-6">⏱️</div>
              <h3 className="text-2xl font-semibold mb-4">Save hours every week</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Stop manually searching vendors. AI finds suppliers and quotes in seconds.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10">
              <div className="text-5xl mb-6">💰</div>
              <h3 className="text-2xl font-semibold mb-4">Never overpay again</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                AI instantly compares real pricing from multiple suppliers.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10">
              <div className="text-5xl mb-6">📦</div>
              <h3 className="text-2xl font-semibold mb-4">Everything stays organized</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Requests, quotes, orders, and saved items — all in one clean workspace.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works — AI as the star */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-semibold mb-6">
              CORE FEATURE
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Your AI Procurement Agent</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Three simple steps to better sourcing</p>
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
