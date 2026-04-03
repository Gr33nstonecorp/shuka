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
  trial_end?: string | null; // Add this if your profiles table has a trial_end column
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
  const [addedItems, setAddedItems] = useState<number[]>([]);

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
          .select("id, email, plan, subscription_status, current_period_end, trial_end")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Profile load error:", error);
        } else {
          setProfile(data as ProfileRow | null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, [supabase]);

  // Improved access check - respects trial if your helper does
  const hasAccess = hasActivePaidPlan(profile) || 
    (profile?.trial_end && new Date(profile.trial_end) > new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRunning(true);
    setMessage("");
    setResults([]);
    setAddedItems([]);

    if (!hasAccess) {
      setMessage("Active paid subscription or free trial required for AI Assistant.");
      setRunning(false);
      return;
    }

    if (!input.trim()) {
      setMessage("Please enter at least one item.");
      setRunning(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage("Please log in again.");
        setRunning(false);
        return;
      }

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "AI request failed.");
      } else {
        setResults(data.results || []);
      }
    } catch (error) {
      console.error(error);
      setMessage("AI request failed. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  const addToRequest = (index: number, result: AssistantResult) => {
    if (!result.item) return;

    const saved = JSON.parse(localStorage.getItem("shukai_requests") || "[]");
    const newRequest = {
      id: Date.now(),
      name: result.item,
      quantity: Number(result.quantity || 1),
      dateAdded: new Date().toISOString(),
    };

    localStorage.setItem("shukai_requests", JSON.stringify([newRequest, ...saved]));
    setAddedItems([...addedItems, index]);
    alert(`✅ "${result.item}" added to Requests!`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading assistant...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Free Trial or Subscription Required</h1>
          <p className="text-zinc-600 mb-8">
            The AI Assistant is available during your free trial or with a paid plan ($9 or $29/month).
          </p>
          <Link
            href="/pricing"
            className="inline-block px-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl hover:bg-black"
          >
            View Plans & Continue Trial
          </Link>
        </div>
      </div>
    );
  }

  // Paid or trial user - show full AI interface
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-semibold px-5 py-2 rounded-full mb-6">
            AI Sourcing Engine
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none mb-6">
            AI Assistant
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Enter your items below and let ShukAI find the best suppliers.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Items to source</label>
              <textarea
                placeholder="10 gloves&#10;20 packing tape&#10;10 shipping labels"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={8}
                disabled={running}
                className="w-full p-6 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 font-mono focus:outline-none focus:border-blue-500"
              />
              <p className="mt-3 text-xs text-zinc-500">One item per line • Format: quantity item name</p>
            </div>

            <button
              type="submit"
              disabled={running}
              className="w-full py-4 bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white font-semibold rounded-2xl transition"
            >
              {running ? "Running AI Sourcing..." : "Run AI Sourcing"}
            </button>
          </form>

          {message && <div className="mt-6 p-5 bg-amber-50 rounded-2xl text-amber-800">{message}</div>}
        </div>

        {results.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Sourcing Results</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result, index) => (
                <div key={index} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                  <div className="font-semibold text-2xl mb-4">{result.item}</div>
                  <div className="text-zinc-500 mb-6">Quantity: {result.quantity}</div>

                  {result.best_quote && (
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

                      <button
                        onClick={() => addToRequest(index, result)}
                        disabled={addedItems.includes(index)}
                        className={`w-full py-3.5 rounded-2xl font-semibold transition ${
                          addedItems.includes(index) ? "bg-green-600 text-white" : "bg-zinc-900 hover:bg-black text-white"
                        }`}
                      >
                        {addedItems.includes(index) ? "✓ Added to Request" : "Add to Request"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !message && (
          <div className="text-center py-20 text-zinc-500">
            Run the AI Assistant above to see sourcing recommendations.
          </div>
        )}
      </div>
    </main>
  );
}
