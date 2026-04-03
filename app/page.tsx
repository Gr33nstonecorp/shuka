"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type UserState = {
  email: string | null;
};

type AppTab = {
  label: string;
  href: string;
  description: string;
};

const TABS: AppTab[] = [
  { label: "Requests", href: "/requests", description: "Create and manage purchasing requests." },
  { label: "Quotes", href: "/quotes", description: "Review and compare vendor quotes." },
  { label: "Orders", href: "/orders", description: "Track approved and active orders." },
  { label: "Vendors", href: "/vendors", description: "Browse and manage supplier options." },
  { label: "AI Assistant", href: "/assistant", description: "Use the sourcing assistant workflow." },
  { label: "Saved Items", href: "/saved-items", description: "Keep shortlisted products and options." },
];

export default function HomePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user, setUser] = useState<UserState | null>(null);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  useEffect(() => {
    // Non-blocking session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { email: session.user.email ?? null } : null);
    }).catch((err) => console.error("Session error:", err));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email ?? null } : null);
    });

    const url = new URL(window.location.href);
    if (url.searchParams.get("checkout") === "success") {
      setShowCheckoutSuccess(true);
      url.searchParams.delete("checkout");
      window.history.replaceState({}, "", url.toString());
    }

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Success Banner */}
      {showCheckoutSuccess && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl px-6 py-4 text-sm font-medium">
            Subscription started successfully. Your account is now active.
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-semibold px-5 py-2 rounded-full mb-6">
                AI procurement for modern teams
              </div>

              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-8">
                Source vendors,<br />compare quotes,<br />and manage purchasing
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg mb-10">
                ShukAI brings your entire procurement workflow into one powerful platform.
              </p>

              <div className="flex flex-wrap gap-4">
                {user ? (
                  <>
                    <Link href="/pricing" className="px-8 py-4 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl transition-all">
                      Manage plan
                    </Link>
                    <Link href="/assistant" className="px-8 py-4 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-2xl transition-all">
                      Open AI Assistant
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login?next=/pricing" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all active:scale-[0.985] shadow-lg shadow-blue-500/30">
                      Start free trial
                    </Link>
                    <Link href="/login" className="px-8 py-4 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold rounded-2xl transition-all">
                      Log in
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                <StatCard title="Requests" value="Structured" />
                <StatCard title="Quotes" value="Comparable" />
                <StatCard title="Orders" value="Trackable" />
                <StatCard title="AI" value="Actionable" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace Section */}
      <section id="workspace" className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-5xl font-black tracking-tighter mb-4">Workspace</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              Manage requests, compare quotes, track orders, and work with suppliers in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="font-semibold text-2xl mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tab.label}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">{tab.description}</p>
                <div className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Open →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-zinc-900 rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Ready to use ShukAI for real?</h2>
              <p className="text-xl text-zinc-400 max-w-md">Start with the trial, then move straight into your actual workflow.</p>
            </div>

            <div className="flex flex-wrap gap-4">
              {user ? (
                <>
                  <Link href="/pricing" className="px-8 py-4 bg-white text-zinc-950 font-semibold rounded-2xl hover:bg-zinc-100 transition">Go to pricing</Link>
                  <Link href="/profile" className="px-8 py-4 border border-zinc-700 hover:bg-zinc-800 font-semibold rounded-2xl transition">Open profile</Link>
                </>
              ) : (
                <>
                  <Link href="/login?next=/pricing" className="px-8 py-4 bg-white text-zinc-950 font-semibold rounded-2xl hover:bg-zinc-100 transition">Start free trial</Link>
                  <Link href="/login" className="px-8 py-4 border border-zinc-700 hover:bg-zinc-800 font-semibold rounded-2xl transition">Log in</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6">
      <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{title}</div>
      <div className="text-3xl font-bold mt-2 tracking-tight">{value}</div>
    </div>
  );
}
