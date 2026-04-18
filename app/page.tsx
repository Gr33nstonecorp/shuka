"use client";

import { useState } from "react";

type Product = {
  item: string;
  vendor: string;
  website: string;
  price: number;
  reason: string;
  delivery: string;
};

export default function HomePage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSourcing = async () => {
    if (!input.trim()) {
      setError("Enter what you need.");
      return;
    }

    setLoading(true);
    setResults([]);
    setError("");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (!res.ok || !data.results) {
        setError(data.error || "Failed to fetch results.");
        return;
      }

      setResults(data.results);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* HEADER */}
      <div className="text-center mb-12">
        <div className="inline-block border border-yellow-400/40 text-yellow-400 px-5 py-2 rounded-full text-sm mb-6">
          AI POWERED SOURCING
        </div>

        <h1 className="text-5xl font-black tracking-tighter text-yellow-400 mb-4">
          Find live supplier prices instantly
        </h1>

        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Describe what you need. ShukAI finds real suppliers and gives you direct links.
        </p>
      </div>

      {/* INPUT BOX */}
      <div className="bg-zinc-900 rounded-3xl p-8 mb-12">
        <p className="text-zinc-400 mb-4">What do you need to source?</p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="nitrile gloves - 1\npacking tape - 50"
          className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-lg text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 min-h-[140px]"
        />

        <button
          onClick={handleSourcing}
          disabled={loading}
          className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-4 rounded-2xl text-lg transition"
        >
          {loading ? "Searching..." : "Run AI Sourcing"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-center text-red-400 mb-8">
          {error}
        </div>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="space-y-6">
          {results.map((p, i) => (
            <div key={i} className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">{p.item}</h3>
                <div className="text-yellow-400 text-2xl font-black">
                  ${p.price}
                </div>
              </div>

              <p className="text-zinc-400 mb-2">
                {p.vendor}
              </p>

              <p className="text-zinc-500 text-sm mb-4">
                {p.reason}
              </p>

              <a
                href={p.website}
                target="_blank"
                className="block text-center bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 rounded-xl"
              >
                Buy Now →
              </a>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
