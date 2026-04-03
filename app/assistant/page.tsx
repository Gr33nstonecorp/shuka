"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkLogin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, [supabase]);

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

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "AI request failed.");
      } else {
        setResults(data.results || []);
        if (!data.results || data.results.length === 0) {
          setMessage("No results returned.");
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("AI request failed. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Access Required</h1>
          <p className="text-zinc-600 mb-8">Please log in to use the AI Assistant.</p>
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
          <h1 className="text-5xl font-black tracking-tighter mb-6">AI Assistant</h1>
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
            <div className="grid gap-6">
              {results.map((result, i) => (
                <div key={i} className="bg-white border rounded-3xl p-8">
                  <div className="font-semibold text-xl mb-2">{result.item}</div>
                  {result.best_quote && (
                    <div className="mt-4">
                      <p>Best Vendor: <strong>{result.best_quote.vendor_name}</strong></p>
                      <p>Total: <strong>${result.best_quote.total}</strong></p>
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
