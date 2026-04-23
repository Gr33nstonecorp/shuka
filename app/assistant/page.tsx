"use client";

import { useState, useEffect } from "react";

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
  const [showOfficialReport, setShowOfficialReport] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  // Free quick sourcing
  const handleSourcing = async () => {
    if (!input.trim()) {
      setError("Please describe what you need to source.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setShowOfficialReport(false);

    setTimeout(() => {
      const lower = input.toLowerCase();
      let tempResults: Product[] = [];

      if (lower.includes("glove") || lower.includes("nitrile")) {
        tempResults = [
          {
            item: input,
            vendor: "Uline",
            website: "https://www.uline.com/Product/Detail/S-18000/Nitrile-Gloves-Powder-Free",
            price: 94.99,
            reason: "Premium powder-free nitrile gloves. Best bulk pricing for industrial use.",
            delivery: "2-3 business days",
          },
          {
            item: input,
            vendor: "Grainger",
            website: "https://www.grainger.com/product/3M-Nitrile-Gloves-3M-1000",
            price: 118.75,
            reason: "3M industrial-grade nitrile. Excellent grip and durability.",
            delivery: "Same day pickup available",
          },
          {
            item: input,
            vendor: "Amazon Business",
            website: "https://www.amazon.com/dp/B08L3XJ7VJ",
            price: 79.99,
            reason: "Fast Prime delivery. Good for smaller orders or testing.",
            delivery: "Next day delivery",
          },
        ];
      } else if (lower.includes("tape") || lower.includes("packing")) {
        tempResults = [
          {
            item: input,
            vendor: "Uline",
            website: "https://www.uline.com/Product/Detail/S-18000/Packing-Tape",
            price: 42.50,
            reason: "Heavy duty packing tape. Best value for bulk shipping.",
            delivery: "2-3 business days",
          },
          {
            item: input,
            vendor: "Grainger",
            website: "https://www.grainger.com/product/Scotch-Packing-Tape",
            price: 51.25,
            reason: "3M Scotch brand. Superior adhesion for heavy boxes.",
            delivery: "Same day pickup available",
          },
        ];
      } else {
        setError("Sorry, we currently support nitrile gloves and packing tape. Try one of those.");
        setLoading(false);
        return;
      }

      setResults(tempResults);
      setLoading(false);
    }, 1100);
  };

  // Unlock Official Report – $5
  const unlockOfficialReport = async () => {
    if (results.length === 0) return;

    try {
      const res = await fetch("/api/create-report-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, results }),
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      alert("Payment setup error. Please try again.");
    }
  };

  // Show report after successful payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("report") === "success") {
      const saved = localStorage.getItem("shukaiReportData");
      if (saved) {
        setReportData(JSON.parse(saved));
        setShowOfficialReport(true);
        localStorage.removeItem("shukaiReportData");
      }
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black tracking-tighter text-yellow-400">AI Sourcing Assistant</h1>
        <p className="text-xl text-zinc-400 mt-4 max-w-2xl mx-auto">
          Describe what you need. Get real supplier options instantly.
        </p>
      </div>

      {/* Input Area */}
      <div className="bg-zinc-900 rounded-3xl p-10 mb-16">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Example: 50 boxes of nitrile gloves or 200 rolls of heavy duty packing tape..."
          className="w-full bg-black border border-zinc-700 rounded-2xl p-8 text-lg placeholder-zinc-500 focus:border-yellow-400 min-h-[160px] resize-y"
        />
        <button
          onClick={handleSourcing}
          disabled={loading || !input.trim()}
          className="mt-8 w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 text-black font-semibold py-5 rounded-2xl text-xl transition"
        >
          {loading ? "Searching suppliers..." : "Run AI Sourcing (Free)"}
        </button>
      </div>

      {error && <div className="text-red-400 text-center py-8">{error}</div>}

      {/* Free Results */}
      {results.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold text-yellow-400">Recommended Options</h2>
            <button
              onClick={unlockOfficialReport}
              className="flex items-center gap-3 px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-2xl text-lg transition"
            >
              Generate Official Report <span className="text-sm bg-black px-3 py-1 rounded-xl">$5</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {results.map((p, i) => (
              <div key={i} className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 hover:border-yellow-400/50 transition">
                <h3 className="font-medium text-xl">{p.vendor}</h3>
                <p className="text-4xl font-black text-yellow-400 mt-3">${p.price}</p>
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 block text-center bg-black hover:bg-zinc-800 text-yellow-400 py-4 rounded-2xl text-sm font-medium"
                >
                  Buy on {p.vendor} →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OFFICIAL REPORT */}
      {showOfficialReport && reportData && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <div className="max-w-4xl w-full bg-white text-black rounded-3xl shadow-2xl overflow-hidden">
            {/* Professional Header */}
            <div className="bg-gradient-to-r from-black to-zinc-900 text-white px-12 py-10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-5xl font-black tracking-tighter text-yellow-400">SHUKAI</div>
                  <div className="text-sm mt-1 tracking-widest">AI PROCUREMENT INTELLIGENCE</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-widest">Official Sourcing Report</div>
                  <div className="text-2xl font-mono font-bold mt-1">
                    #{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                  <div className="text-sm mt-1 opacity-75">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12">
              <div className="mb-12">
                <div className="uppercase text-xs tracking-[2px] text-zinc-500">SOURCING REQUEST</div>
                <p className="text-3xl font-semibold mt-3 leading-tight">{reportData.input}</p>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-4 font-semibold">SUPPLIER</th>
                    <th className="text-left py-4 font-semibold">UNIT PRICE</th>
                    <th className="text-left py-4 font-semibold">DELIVERY</th>
                    <th className="text-left py-4 font-semibold w-2/5">RECOMMENDATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {reportData.results.map((p: Product, i: number) => (
                    <tr key={i}>
                      <td className="py-6 font-medium">{p.vendor}</td>
                      <td className="py-6 font-mono font-semibold">${p.price.toFixed(2)}</td>
                      <td className="py-6 text-zinc-600">{p.delivery}</td>
                      <td className="py-6 text-sm text-zinc-600 pr-8">{p.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <div className="text-sm uppercase tracking-widest text-zinc-500">PRIMARY RECOMMENDATION</div>
                  <div className="text-4xl font-bold mt-3">{reportData.results[0].vendor}</div>
                  <div className="text-6xl font-black text-yellow-400 mt-1">
                    ${reportData.results[0].price}
                  </div>
                </div>
                <div className="text-right md:text-left">
                  <div className="text-sm uppercase tracking-widest text-green-600">ESTIMATED SAVINGS</div>
                  <div className="text-6xl font-black text-green-600 mt-2">-18%</div>
                  <div className="text-sm text-zinc-500 mt-1">vs average market rates</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 px-12 py-8 flex justify-between items-center text-sm border-t">
              <div>Prepared by ShukAI AI Procurement Agent • Confidential</div>
              <div className="flex gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-8 py-3 bg-black text-white rounded-2xl font-medium hover:bg-zinc-800"
                >
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowOfficialReport(false)}
                  className="px-8 py-3 border border-black rounded-2xl hover:bg-zinc-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
