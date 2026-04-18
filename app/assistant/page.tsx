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

function parseQuantityMap(input: string) {
  const map = new Map<string, number>();

  input
    .split("\n")
    .map((line) => {
      const [name, qty] = line.split("-");
      return {
        item: name?.trim() || "",
        quantity: Number(qty?.trim()) || 1,
      };
    })
    .filter((x) => x.item)
    .forEach((x) => map.set(x.item, x.quantity));

  return map;
}

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quantityMap = parseQuantityMap(input);

  const handleSourcing = async () => {
    if (!input.trim()) {
      setError("Please enter what you need to source.");
      return;
    }

    setLoading(true);
    setResults([]);
    setError("");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (!res.ok || !data.results) {
        setError(data.error || "Failed to get live sourcing results.");
        setLoading(false);
        return;
      }

      setResults(data.results);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <div className="inline-block bg-yellow-400/10 text-yellow-400 px-6 py-2 rounded-full text-sm font-medium mb-6 border border-yellow-400/30">
          AI POWERED SOURCING
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-6 text-yellow-400">
          Find live supplier prices instantly
        </h1>
        <p className="text-xl text-zinc-400 max-w-xl mx-auto">
          Describe what you need. ShukAI finds live shopping results and gives you direct links.
        </p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-10 mb-16">
        <p className="text-zinc-400 mb-6 text-lg">What do you need to source?</p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"nitrile gloves - 1\npacking tape - 50"}
          className="w-full bg-black border border-zinc-700 rounded-2xl p-8 text-lg placeholder-zinc-500 focus:outline-none focus:border-yellow-400 min-h-[160px] resize-y"
        />

        <button
          onClick={handleSourcing}
          disabled={loading || !input.trim()}
          className="mt-8 w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-5 rounded-2xl text-xl transition-all duration-200"
        >
          {loading ? "Searching live suppliers..." : "Run AI Sourcing"}
        </button>
      </div>

      {error && (
        <div className="text-center text-red-400 py-8 bg-zinc-900 rounded-3xl">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-semibold text-yellow-400">Recommended Options</h2>
            <p className="text-zinc-400">Live links only</p>
          </div>

          <div className="space-y-8">
            {results.map((product, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-3xl p-10 border border-zinc-800 hover:border-yellow-400/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">{product.item}</h3>
                    <p className="text-zinc-400">
                      Quantity: {quantityMap.get(product.item) || 1}
                    </p>
                  </div>

                  <div className="text-right md:text-left">
                    <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                      Live Total
                    </p>
                    <p className="text-4xl font-black text-yellow-400">
                      {product.price > 0 ? `$${product.price.toFixed(2)}` : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-10 mb-8">
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
                    Vendor
                  </p>
                  <p className="text-2xl font-medium">{product.vendor}</p>
                </div>

                <div className="bg-zinc-800/80 rounded-2xl p-8 mb-10">
                  <p className="text-zinc-300">{product.reason}</p>
                  <p className="text-zinc-400 mt-2">Delivery: {product.delivery}</p>
                </div>

                {product.website ? (
                  <a
                    href={product.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-5 rounded-2xl text-xl transition-all"
                  >
                    Open supplier →
                  </a>
                ) : (
                  <div className="block w-full text-center bg-zinc-700 text-zinc-400 font-semibold py-5 rounded-2xl text-xl">
                    No live link found
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && !error && (
        <div className="text-center text-zinc-500 py-20">
          Enter one item per line and click “Run AI Sourcing” to get live supplier results.
        </div>
      )}
    </div>
  );
}
