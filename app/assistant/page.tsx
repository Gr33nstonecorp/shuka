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
          .select("id, email, plan, subscription_status, current_period_end")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          setMessage("Could not load profile.");
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
    setAddedItems([]);

    if (!hasPaidAccess) {
      setMessage("An active paid subscription is required.");
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
        setMessage(data.error || "AI request failed.");
        return;
      }

      const newResults = Array.isArray(data.results) ? data.results : [];
      setResults(newResults);

      if (newResults.length === 0) {
        setMessage("No results returned.");
      }
    } catch (error) {
      console.error(error);
      setMessage("AI request failed.");
    } finally {
      setRunning(false);
    }
  }

  const addToRequest = (index: number, result: AssistantResult) => {
    if (!result.item) return;

    const saved = JSON.parse(localStorage.getItem("shukai_requests") || "[]");

    const newRequest = {
      id: Date.now(),
      name: result.item,
      quantity: Number(result.quantity || 1),
      dateAdded: new Date().toISOString()
    };

    localStorage.setItem("shukai_requests", JSON.stringify([newRequest, ...saved]));

    setAddedItems([...addedItems, index]);
    alert(`✅ "${result.item}" added to your Requests!`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading assistant...</div>;
  }

  if (!hasPaidAccess) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Access Required</h1>
          <p className="text-zinc-600 mb-8">{message || "Please log in with an active subscription to use the AI Assistant."}</p>
          <Link href="/login" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-black block">
            Log In
          </Link>
        </div>
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
                disabled={running}
                className="w-full resize-y min-h-[180px] p-6 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
              <p className="mt-3 text-xs text-zinc-500">One item per line • Format: Item name - quantity</p>
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

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Sourcing Results</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result, index) => (
                <div key={index} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                  <div className="font-semibold text-2xl mb-4">{result.item}</div>
                  <div className="text-zinc-500 mb-6">Quantity: {result.quantity}</div>

                  {result.best_quote && (
                    <div>
                      <div className="font-medium mb-4">
                        Best: {result.best_quote.vendor_name} — ${result.best_quote.total}
                      </div>
                      {result.best_quote.reason && (
                        <div className="bg-blue-50 p-4 rounded-2xl text-sm mb-6">
                          {result.best_quote.reason}
                        </div>
                      )}
                      <button
                        onClick={() => addToRequest(index, result)}
                        disabled={addedItems.includes(index)}
                        className={`w-full py-3 rounded-2xl font-semibold transition ${
                          addedItems.includes(index) ? "bg-green-600 text-white" : "bg-zinc-900 text-white hover:bg-black"
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
