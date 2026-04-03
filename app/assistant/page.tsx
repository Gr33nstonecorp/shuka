"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { hasActivePaidPlan } from "@/lib/subscription";

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
  subscription_status: string | null;
  current_period_end: string | null;
};

type AssistantResult = {
  item?: string;
  quantity?: number | string;
  best_quote?: {
    vendor_name?: string;
    total?: number | string;
    reason?: string;
    product_url?: string;
  };
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AssistantResult[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, plan, subscription_status, current_period_end")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          setMessage("Could not load profile: " + error.message);
        } else {
          setProfile(data as ProfileRow | null);
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to load assistant access.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, [supabase]);

  const hasPaidAccess = hasActivePaidPlan(profile);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRunning(true);
    setMessage("");
    setResults([]);

    if (!hasPaidAccess) {
      setMessage("An active paid subscription is required to use the AI Assistant.");
      setRunning(false);
      return;
    }

    if (!input.trim()) {
      setMessage("Please enter at least one item to source.");
      setRunning(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        setMessage("You must be logged in.");
        setRunning(false);
        return;
      }

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.error || "AI request failed. Please try again.");
        return;
      }

      const newResults = Array.isArray(data.results) ? data.results : [];
      setResults(newResults);

      if (newResults.length === 0) {
        setMessage("No sourcing results were returned.");
      }
    } catch (error) {
      console.error(error);
      setMessage("AI request failed. Please check your connection.");
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-xl">Loading assistant...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-semibold px-5 py-2 rounded-full mb-6">
            AI Sourcing Engine
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none mb-6">
            Turn simple requests into vendor options fast.
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Enter your items and let ShukAI find the best suppliers, pricing, and lead times.
          </p>
        </div>

        {/* Subscription Status */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">SUBSCRIPTION STATUS</div>
              <div className="text-3xl font-bold">
                {hasPaidAccess ? `${profile?.plan || "Paid"} • Active` : "No Active Paid Plan"}
              </div>
              <div className="mt-2 text-zinc-600 dark:text-zinc-400">
                Period ends: {formatDate(profile?.current_period_end)}
              </div>
            </div>

            {!hasPaidAccess && (
              <Link
                href="/pricing"
                className="px-8 py-3 bg-zinc-900 text-white font-semibold rounded-2xl hover:bg-black transition"
              >
                Upgrade Now
              </Link>
            )}
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Items to source</label>
              <textarea
                placeholder="gloves - 50&#10;packing tape - 20&#10;shipping labels - 10"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={8}
                disabled={!hasPaidAccess || running}
                className="w-full resize-y min-h-[180px] p-6 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
              <p className="mt-3 text-xs text-zinc-500">One item per line • Format: Item name - quantity</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={!hasPaidAccess || running}
                className="px-12 py-4 bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white font-semibold rounded-2xl transition disabled:cursor-not-allowed flex-1 md:flex-none"
              >
                {running ? "Running AI Sourcing..." : "Run AI Sourcing"}
              </button>

              <Link
                href="/quotes"
                className="px-8 py-4 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl font-medium transition"
              >
                View All Quotes
              </Link>
            </div>
          </form>

          {message && (
            <div className="mt-6 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
              {message}
            </div>
          )}
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-8">Sourcing Results</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:border-blue-500 transition-all group"
                >
                  <div className="font-semibold text-2xl mb-4">{result.item || "Item"}</div>

                  <div className="text-zinc-500 dark:text-zinc-400 mb-6">
                    Quantity: <span className="font-medium text-zinc-900 dark:text-white">{result.quantity}</span>
                  </div>

                  {result.best_quote ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-500">Best Vendor</div>
                          <div className="font-semibold text-lg mt-1">{result.best_quote.vendor_name}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-500">Est. Total</div>
                          <div className="font-bold text-2xl mt-1">
                            ${Number(result.best_quote.total || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {result.best_quote.reason && (
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-5 rounded-2xl text-sm leading-relaxed">
                          {result.best_quote.reason}
                        </div>
                      )}

                      {result.best_quote.product_url && (
                        <a
                          href={result.best_quote.product_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium group-hover:gap-3 transition-all"
                        >
                          View on supplier site →
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="text-zinc-500 italic">No quote data available for this item.</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !message && (
          <div className="text-center py-20 text-zinc-500">
            Run the AI Assistant above to see sourcing recommendations here.
          </div>
        )}
      </div>
    </main>
  );
}
