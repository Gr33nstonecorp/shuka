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

  const handleSourcing = () => {
    if (!input.trim()) {
      setError("Please describe what you need to source.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setShowReport(false);

    setTimeout(() => {
      const lower = input.toLowerCase();
      let tempResults: Product[] = [];

      if (lower.includes("glove") || lower.includes("nitrile")) {
        tempResults = [
          { item: input, vendor: "Uline", website: "https://www.uline.com/Product/Detail/S-18000/Nitrile-Gloves-Powder-Free", price: 94.99, reason: "Premium industrial nitrile gloves - high volume supplier", delivery: "2-3 business days" },
          { item: input, vendor: "Grainger", website: "https://www.grainger.com/product/3M-Nitrile-Gloves-3M-1000", price: 118.75, reason: "3M branded - excellent quality and durability", delivery: "Same day pickup" },
          { item: input, vendor: "Amazon Business", website: "https://www.amazon.com/dp/B08L3XJ7VJ", price: 79.99, reason: "Fastest delivery option for urgent restock", delivery: "Next day delivery" },
        ];
      } else if (lower.includes("tape") || lower.includes("packing")) {
        tempResults = [
          { item: input, vendor: "Uline", website: "https://www.uline.com/Product/Detail/S-18000/Packing-Tape", price: 42.50, reason: "Heavy duty packaging tape - best for warehouse shipping", delivery: "2-3 business days" },
          { item: input, vendor: "Grainger", website: "https://www.grainger.com/product/Scotch-Packing-Tape", price: 51.25, reason: "3M Scotch - superior adhesion", delivery: "Same day pickup" },
        ];
      } else {
        setError("Currently supporting nitrile gloves and packing tape.");
        setLoading(false);
        return;
      }

      setResults(tempResults);
      setLoading(false);
    }, 900);
  };

  const generateReport = () => {
    if (results.length === 0) return;
    setShowReport(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black tracking-tighter text-yellow-400">Warehouse Sourcing Assistant</h1>
        <p className="text-xl text-zinc-400 mt-4">Free supplier options + Professional Report</p>
      </div>

      {/* Input */}
      <div className="bg-zinc-900 rounded-3xl p-10 mb-16">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="50 boxes of nitrile gloves, 200 rolls of packing tape..."
          className="w-full bg-black border border-zinc-700 rounded-2xl p-8 text-lg min-h-[160px]"
        />
        <button
          onClick={handleSourcing}
          disabled={loading || !input.trim()}
          className="mt-8 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-5 rounded-2xl text-xl"
        >
          {loading ? "Searching suppliers..." : "Run AI Sourcing"}
        </button>
      </div>

      {error && <div className="text-red-400 text-center py-8">{error}</div>}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold">Quick Supplier Options</h2>
            <button
              onClick={generateReport}
              className="px-12 py-5 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-3xl text-xl"
            >
              Generate Official Report
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {results.map((p, i) => (
              <div key={i} className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
                <h3 className="font-medium text-xl">{p.vendor}</h3>
                <p className="text-4xl font-black text-yellow-400 mt-3">${p.price}</p>
                <a href={p.website} target="_blank" className="mt-8 block text-center bg-black hover:bg-zinc-800 text-yellow-400 py-4 rounded-2xl text-sm font-medium">
                  View on {p.vendor} →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Warehouse Report */}
      {showReport && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full bg-white text-black rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-black text-white px-12 py-10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-5xl font-black text-yellow-400">SHUKAI</div>
                  <div className="text-sm tracking-widest">WAREHOUSE PROCUREMENT</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">OFFICIAL SOURCING REPORT</div>
                  <div className="font-mono">#{Math.floor(100000 + Math.random() * 900000)}</div>
                  <div>{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="p-12">
              <p className="text-3xl font-semibold mb-10">{input}</p>

              <table className="w-full mb-12 text-left">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="py-4 font-semibold">SUPPLIER</th>
                    <th className="py-4 font-semibold">PRICE</th>
                    <th className="py-4 font-semibold">DELIVERY</th>
                    <th className="py-4 font-semibold">NOTES</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map((p, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-6 font-medium">{p.vendor}</td>
                      <td className="py-6 font-mono font-semibold">${p.price}</td>
                      <td className="py-6">{p.delivery}</td>
                      <td className="py-6 text-sm text-zinc-600">{p.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-8">
                <div className="uppercase text-xs tracking-widest text-yellow-700 mb-2">RECOMMENDED SUPPLIER</div>
                <div className="text-4xl font-bold">{results[0].vendor}</div>
                <div className="text-6xl font-black text-yellow-600 mt-1">${results[0].price}</div>
                <div className="mt-4 text-green-600 font-medium">Best choice for warehouse stock</div>
              </div>
            </div>

            <div className="bg-zinc-100 px-12 py-8 flex justify-between items-center border-t">
              <div className="text-sm">Prepared by ShukAI AI • Confidential</div>
              <div className="flex gap-4">
                <button onClick={() => window.print()} className="px-8 py-3 bg-black text-white rounded-2xl font-medium">Print / Save as PDF</button>
                <button onClick={() => setShowReport(false)} className="px-8 py-3 border border-black rounded-2xl">Close Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
