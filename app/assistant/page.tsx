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

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReport, setShowReport] = useState(false);

  const handleSourcing = async () => {
    if (!input.trim()) {
      setError("Please describe what you need.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setShowReport(false);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: input }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.results && Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        setError("No results returned.");
      }
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    if (results.length === 0) return;
    setShowReport(true);
  };

  const makeDonation = async () => {
    try {
      const res = await fetch("/api/create-donation-checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Could not open donation page.");
      }
    } catch (err) {
      alert("Could not open donation page. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black tracking-tighter text-yellow-400">AI Sourcing Assistant</h1>
        <p className="text-zinc-400 mt-3">Free supplier options + Official Data Sheet</p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8 mb-12">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="50 boxes of nitrile gloves..."
          className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-base min-h-[140px]"
        />
        <button
          onClick={handleSourcing}
          disabled={loading || !input.trim()}
          className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-5 rounded-2xl text-lg"
        >
          {loading ? "Searching suppliers..." : "Run AI Sourcing"}
        </button>
      </div>

      {error && <div className="text-red-400 text-center py-8">{error}</div>}

      {results.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Supplier Options</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {results.map((p, i) => (
              <div key={i} className="bg-zinc-900 rounded-3xl p-8 text-center">
                <h3 className="font-medium">{p.vendor}</h3>
                <p className="text-4xl font-black text-yellow-400 mt-3">${p.price}</p>
                <a href={p.website} target="_blank" className="mt-8 block bg-black text-yellow-400 py-4 rounded-2xl text-sm">Buy on {p.vendor} →</a>
              </div>
            ))}
          </div>

          <button
            onClick={generateReport}
            className="w-full py-7 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-3xl text-2xl shadow-xl"
          >
            📋 Generate Official Data Sheet
          </button>
        </div>
      )}

      {showReport && (
        <div className="bg-white text-black rounded-3xl p-8 shadow-2xl">
          <div className="bg-black text-white p-8 rounded-t-3xl -mx-8 -mt-8 mb-10 text-center">
            <div className="text-4xl font-black text-yellow-400">SHUKAI</div>
            <div className="text-sm">OFFICIAL DATA SHEET</div>
          </div>

          <p className="text-2xl font-semibold mb-8">{input}</p>

          <table className="w-full mb-12">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-4">Supplier</th>
                <th className="text-left py-4">Price</th>
                <th className="text-left py-4">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p, i) => (
                <tr key={i} className="border-b">
                  <td className="py-5 font-medium">{p.vendor}</td>
                  <td className="py-5 font-semibold">${p.price}</td>
                  <td className="py-5">{p.delivery}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-4 mt-12">
            <button onClick={() => window.print()} className="flex-1 py-4 bg-black text-white rounded-2xl">Print / Save PDF</button>
            <button onClick={() => setShowReport(false)} className="flex-1 py-4 border border-black rounded-2xl">Close</button>
          </div>
        </div>
      )}

      <button
        onClick={makeDonation}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-2 z-50"
      >
        💛 Support ShukAI ($5 suggested)
      </button>
    </div>
  );
}
