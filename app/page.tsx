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

    // Check for checkout success
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("checkout") === "success") {
        setShowSuccess(true);
        // Clean URL
        window.history.replaceState({}, "", "/");
      }
    }
  }, [supabase]);

  const TABS = [
    { label: "Requests", href: "/requests", description: "Create and manage purchasing requests." },
    { label: "Quotes", href: "/quotes", description: "Review and compare vendor quotes." },
    { label: "Orders", href: "/orders", description: "Track approved and active orders." },
    { label: "Vendors", href: "/vendors", description: "Browse and manage supplier options." },
    { label: "AI Assistant", href: "/assistant", description: "Use the sourcing assistant workflow." },
    { label: "Saved Items", href: "/saved-items", description: "Keep shortlisted products and options." },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Success Banner */}
      {showSuccess && (
        <div className="bg-green-600 text-white py-4 text-center">
          🎉 Payment successful! Welcome to ShukAI. Your subscription is now active.
        </div>
      )}

      {/* Hero */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-5 py-2 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Now in Early Beta</span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-8">
            AI that finds<br />better vendors,<br />faster.
          </h1>

          <p className="text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12">
            ShukAI helps modern teams source products, compare quotes, and manage procurement — all in one place.
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
                Start Free Trial — $9/mo
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
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {/* Workspace Section */}
      <div className="bg-white dark:bg-zinc-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold tracking-widest text-zinc-500 mb-3">YOUR WORKSPACE</div>
            <h2 className="text-4xl font-bold tracking-tight">Everything in one place</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TABS.map((tab) => (
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
            Start with our $9 Starter plan or go Premium for full AI power.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-12 py-5 bg-white text-zinc-900 font-semibold rounded-2xl hover:bg-zinc-100 text-lg transition"
          >
            Choose Your Plan
          </Link>
        </div>
      </div>
    </main>
  );
}
