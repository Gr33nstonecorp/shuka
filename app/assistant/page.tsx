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
          { item: input, vendor: "Uline", website: "https://www.uline.com/Product/Detail/S-18000/Nitrile-Gloves-Powder-Free", price: 94.99, reason: "Premium industrial nitrile gloves", delivery: "2-3 business days" },
          { item: input, vendor: "Grainger", website: "https://www.grainger.com/product/3M-Nitrile-Gloves-3M-1000", price: 118.75, reason: "3M branded - excellent quality", delivery: "Same day pickup" },
          { item: input, vendor: "Amazon Business", website: "https://www.amazon.com/dp/B08L3XJ7VJ", price: 79.99, reason: "Fast delivery", delivery: "Next day" },
        ];
      } else if (lower.includes("tape") || lower.includes("packing")) {
        tempResults = [
          { item: input, vendor: "Uline", website: "https://www.uline.com/Product/Detail/S-18000/Packing-Tape", price: 42.50, reason: "Heavy duty packaging tape", delivery: "2-3 business days" },
          { item: input, vendor: "Grainger", website: "https://www.grainger.com/product/Scotch-Packing-Tape", price: 51.25, reason: "3M Scotch brand", delivery: "Same day pickup" },
        ];
      } else {
        setError("We currently support nitrile gloves and packing tape.");
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-yellow-400">Warehouse Sourcing</h1>
        <p className="text-lg text-zinc-400 mt-3">Free results + Official Report</p>
      </div>

      {/* Input */}
      <div className="bg-zinc-900 rounded-3xl p-8 sm:p-10 mb-12">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="50 boxes of nitrile gloves or 200 rolls of packing tape..."
          className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-base sm:text-lg min-h-[140px]"
        />
        <button
          onClick={handleSourcing}
          disabled={loading || !input.trim()}
          className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 text-black font-semibold py-5 rounded-2xl text-lg sm:text-xl"
        >
          {loading ? "Searching suppliers..." : "Run AI Sourcing"}
        </button>
      </div>

      {error && <div className="text-red-400 text-center py-8 px-4">{error}</div>}

      {/* Results + Big Mobile-Friendly Button */}
      {results.length > 0 && (
        <div className="space-y-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center">Supplier Options</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {results.map((p, i) => (
              <div key={i} className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 text-center">
                <h3 className="font-medium text-lg">{p.vendor}</h3>
                <p className="text-4xl font-black text-yellow-400 mt-3">${p.price}</p>
                <a href={p.website} target="_blank" rel="noopener noreferrer" className="mt-8 block bg-black hover:bg-zinc-800 text-yellow-400 py-4 rounded-2xl text-sm font-medium">
                  Buy on {p.vendor}
                </a>
              </div>
            ))}
          </div>

          {/* Prominent Generate Report Button - Optimized for Mobile */}
          <div className="pt-8 border-t border-zinc-800 text-center">
            <button
              onClick={generateReport}
              className="w-full max-w-md mx-auto block bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-6 rounded-3xl text-2xl shadow-lg active:scale-95 transition"
            >
              Generate Official Report
            </button>
            <p className="text-zinc-400 text-sm mt-4">Professional warehouse-style report with comparison table</p>
          </div>
        </div>
      )}

      {/* Official Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full bg-white text-black rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-black text-white px-8 sm:px-12 py-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-4xl font-black text-yellow-400">SHUKAI</div>
                  <div className="text-xs tracking-widest">WAREHOUSE PROCUREMENT</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">OFFICIAL REPORT</div>
                  <div className="font-mono text-lg">#{Math.floor(100000 + Math.random() * 900000)}</div>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-12">
              <p className="text-2xl sm:text-3xl font-semibold mb-10">{input}</p>

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

              <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-8 text-center">
                <div className="uppercase text-xs tracking-widest text-yellow-700 mb-3">RECOMMENDED SUPPLIER</div>
                <div className="text-4xl font-bold">{results[0].vendor}</div>
                <div className="text-6xl font-black text-yellow-600 mt-2">${results[0].price}</div>
              </div>
            </div>

            <div className="bg-zinc-100 px-8 sm:px-12 py-8 flex flex-col sm:flex-row gap-4 justify-between items-center border-t">
              <div className="text-sm text-center sm:text-left">Prepared by ShukAI AI • Confidential</div>
              <div className="flex gap-4">
                <button onClick={() => window.print()} className="px-8 py-3 bg-black text-white rounded-2xl font-medium">Print / Save PDF</button>
                <button onClick={() => setShowReport(false)} className="px-8 py-3 border border-black rounded-2xl">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
