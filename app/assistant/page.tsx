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
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, email, plan, subscription_status, current_period_end")
        .eq("id", session.user.id)
        .maybeSingle();

      setProfile(data as ProfileRow | null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const hasAccess = hasActivePaidPlan(profile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setMessage("Please enter at least one item.");
      return;
    }

    setRunning(true);
    setMessage("");
    setResults([]);

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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "AI request failed.");
        setRunning(false);
        return;
      }

      const data = await res.json();
      setResults(data.results || []);
      if (!data.results || data.results.length === 0) {
        setMessage("No results returned. Try different items.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Connection error. Please try again.");
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
    alert(`✅ "${result.item}" added to your Requests!`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Access Required</h1>
          <p className="text-zinc-600 mb-8">Active paid subscription or free trial required for AI Assistant.</p>
          <Link href="/pricing" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-black">
            View Pricing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-6">AI Assistant</h1>
          <p className="text-xl text-zinc-600">Enter items and get vendor recommendations.</p>
        </div>

        <div className="bg-white border rounded-3xl p-8 mb-12">
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="10 gloves&#10;20 packing tape"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              disabled={running}
              className="w-full p-6 rounded-2xl border font-mono focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={running}
              className="mt-6 w-full py-4 bg-black text-white rounded-2xl font-semibold disabled:bg-gray-400"
            >
              {running ? "Searching vendors..." : "Run AI Sourcing"}
            </button>
          </form>

          {message && <div className="mt-6 p-4 bg-yellow-50 rounded-2xl">{message}</div>}
        </div>

        {results.length > 0 && (
          <div className="grid gap-6">
            {results.map((r, i) => (
              <div key={i} className="bg-white border rounded-3xl p-8">
                <div className="font-semibold text-xl">{r.item}</div>
                {r.best_quote && (
                  <div className="mt-4">
                    <p>Best: {r.best_quote.vendor_name} — ${r.best_quote.total}</p>
                    <button
                      onClick={() => addToRequest(i, r)}
                      className="mt-4 px-6 py-3 bg-green-600 text-white rounded-2xl"
                    >
                      Add to Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
