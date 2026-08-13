"use client";

import { useState } from "react";
import Link from "next/link";

type Landscaper = {
  name: string;
  price: number;
  reason: string;
  distance: string;
  website: string;
  rating: number;
};

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [zip, setZip] = useState("");
  const [results, setResults] = useState<Landscaper[]>([]);
  const [possibleScope, setPossibleScope] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFindPros = async () => {
    if (!input.trim()) {
      setError("Please describe the landscaping job.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setPossibleScope("");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: input, zip: zip || "11364" }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.mechanics || data.landscapers || []);
        setPossibleScope(data.possibleCause || data.possibleScope || "General landscaping work recommended.");
      }
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-3xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-yellow-400 mb-4">
            Find Local Landscapers
          </h1>
          <p className="text-zinc-400 text-lg">
            Describe the job + your zip code
          </p>
        </div>

        {/* Form */}
        <div className="bg-zinc-900 rounded-3xl p-8 mb-10 border border-zinc-800">
          <div className="space-y-6">
            <div>
              <label className="block text-zinc-400 mb-2 text-sm">
                What landscaping work do you need?
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Overgrown backyard, need full cleanup + weekly mowing..."
                className="w-full bg-black border border-zinc-700 rounded-2xl p-5 text-white placeholder-zinc-500 min-h-[140px] focus:border-yellow-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-2 text-sm">
                Your Zip Code
              </label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="11364"
                className="w-full bg-black border border-zinc-700 rounded-2xl p-5 text-white focus:border-yellow-400 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleFindPros}
            disabled={loading || !input.trim()}
            className="mt-8 w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold py-5 rounded-2xl text-lg transition active:scale-95"
          >
            {loading ? "Finding local pros..." : "Get Free Quotes"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-400 text-center mb-8 font-medium">
            {error}
          </div>
        )}

        {/* Possible Scope */}
        {possibleScope && (
          <div className="bg-zinc-900 rounded-3xl p-8 mb-10 border border-zinc-800">
            <h3 className="text-yellow-400 font-semibold mb-3">Suggested Scope</h3>
            <p className="text-zinc-300 leading-relaxed">{possibleScope}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Local Landscapers
            </h2>

            <div className="space-y-6">
              {results.map((item, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <div className="text-yellow-400 text-3xl font-black mt-1">
                        ${item.price}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-zinc-400">{item.distance}</div>
                      <div className="text-yellow-400 mt-1">★ {item.rating}</div>
                    </div>
                  </div>

                  <p className="text-zinc-400 mb-6">{item.reason}</p>

                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl transition"
                  >
                    Contact / Book Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
