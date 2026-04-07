"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setHasAccess(!!session);
    } catch (e) {
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setRunning(true);
    setMessage("");
    setResults([]);

    // Mock realistic results for immediate demo
    setTimeout(() => {
      setResults([
        { item: "Nitrile Gloves", quantity: 50, best_quote: { vendor_name: "Global Supplies", total: 245.50, reason: "Best bulk price with fast shipping" } },
        { item: "Packing Tape", quantity: 20, best_quote: { vendor_name: "PackPro Inc.", total: 89.99, reason: "Lowest unit cost for heavy duty rolls" } },
      ]);
      setRunning(false);
    }, 1200);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading assistant...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Access Required</h1>
          <p className="text-zinc-600 mb-8">Active paid subscription or free trial required for AI Assistant.</p>
          <Link href="/pricing" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-black">View Pricing</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-6">AI Assistant</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">Describe what you need. Get real vendor options instantly.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea
              placeholder="50 nitrile gloves&#10;20 heavy duty packing tape"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              disabled={running}
              className="w-full p-6 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={running}
              className="w-full py-4 bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white font-semibold rounded-2xl transition"
            >
              {running ? "Searching vendors..." : "Run AI Sourcing"}
            </button>
          </form>
        </div>

        {results.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Recommended Options</h2>
            <div className="grid gap-6">
              {results.map((r, i) => (
                <div key={i} className="bg-white border rounded-3xl p-8">
                  <div className="font-semibold text-xl mb-2">{r.item}</div>
                  {r.best_quote && (
                    <div className="mt-4">
                      <p className="font-medium">Best: {r.best_quote.vendor_name} — ${r.best_quote.total}</p>
                      <p className="text-sm text-zinc-600 mt-1">{r.best_quote.reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
