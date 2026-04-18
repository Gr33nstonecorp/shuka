"use client";

import { useState } from "react";
import Link from "next/link";

type Result = {
  item: string;
  quantity: number;
  best_quote: {
    vendor_name: string;
    total: number;
    reason: string;
  };
};

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<number[]>([]);

  const handleSourcing = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResults([]);

    // Simple mock sourcing (replace with real OpenAI later)
    setTimeout(() => {
      const mockResults: Result[] = [
        {
          item: input,
          quantity: 1,
          best_quote: {
            vendor_name: "Global Supplies",
            total: 124.99,
            reason: "Best bulk price with fast shipping (2-3 days)",
          },
        },
      ];
      setResults(mockResults);
      setLoading(false);
    }, 800);
  };

  const addToRequest = (index: number, result: Result) => {
    // Save to localStorage for persistence across pages
    const saved = JSON.parse(localStorage.getItem("shukai_requests") || "[]");
    const newRequest = {
      id: Date.now(),
      name: result.item,
      quantity: result.quantity,
      vendor: result.best_quote.vendor_name,
      total: result.best_quote.total,
      dateAdded: new Date().toISOString(),
    };

    localStorage.setItem("shukai_requests", JSON.stringify([newRequest, ...saved]));

    setAdded([...added, index]);

    alert(`✅ "${result.item}" added to Requests! Go to Requests tab to view.`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-4 text-yellow-400">AI Sourcing</h1>
        <p className="text-xl text-zinc-400">Describe what you need. Get real vendor options instantly.</p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8 mb-12">
        <p className="text-zinc-400 mb-4">What do you need to source?</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="1 box of gloves"
          className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-lg placeholder-zinc-500 focus:outline-none focus:border-yellow-400 min-h-[120px]"
        />
        <button
          onClick={handleSourcing}
          disabled={loading || !input.trim()}
          className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 text-black font-semibold py-4 rounded-2xl text-lg transition"
        >
          {loading ? "Sourcing vendors..." : "Run AI Sourcing"}
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <h2 className="text-3xl font-semibold mb-8">Recommended Options</h2>
          {results.map((result, index) => (
            <div key={index} className="bg-zinc-900 rounded-3xl p-8 mb-6">
              <h3 className="text-2xl font-semibold mb-2">{result.item}</h3>
              <p className="text-zinc-400 mb-6">Quantity: {result.quantity}</p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Best Vendor</p>
                  <p className="text-2xl font-medium">{result.best_quote.vendor_name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Est. Total</p>
                  <p className="text-3xl font-black text-yellow-400">${result.best_quote.total}</p>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-2xl p-6 mb-8">
                <p className="text-zinc-300">{result.best_quote.reason}</p>
              </div>

              <button
                onClick={() => addToRequest(index, result)}
                disabled={added.includes(index)}
                className={`w-full py-4 rounded-2xl font-semibold text-lg transition ${
                  added.includes(index)
                    ? "bg-green-600 text-white"
                    : "bg-yellow-400 hover:bg-yellow-300 text-black"
                }`}
              >
                {added.includes(index) ? "✓ Added to Request" : "Add to Request"}
              </button>
            </div>
          ))}

          <div className="text-center mt-12">
            <Link
              href="/requests"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-12 py-4 rounded-2xl text-lg transition"
            >
              View My Requests →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
