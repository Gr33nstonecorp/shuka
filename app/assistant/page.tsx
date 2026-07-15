"use client";

import { useState } from "react";

type Mechanic = {
  name: string;
  price: number;
  reason: string;
  distance: string;
  phone: string;
  website: string;
};

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReport, setShowReport] = useState(false);

  const handleFindMechanic = async () => {
    if (!input.trim()) {
      setError("Please describe the problem with your car.");
      return;
    }

    setLoading(true);
    setError("");
    setMechanics([]);
    setShowReport(false);

    try {
      // Call your backend
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: input }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.mechanics && Array.isArray(data.mechanics)) {
        setMechanics(data.mechanics);
      } else {
        setError("No mechanics found.");
      }
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    if (mechanics.length === 0) return;
    setShowReport(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black tracking-tighter text-yellow-400">Car Mechanic Finder</h1>
        <p className="text-zinc-400 mt-3">Describe the problem → Get cheap local mechanics</p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8 mb-12">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Brakes are squeaking, check engine light is on..."
          className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-base min-h-[140px]"
        />
        <button
          onClick={handleFindMechanic}
          disabled={loading || !input.trim()}
          className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-5 rounded-2xl text-lg"
        >
          {loading ? "Finding mechanics..." : "Find Mechanics"}
        </button>
      </div>

      {error && <div className="text-red-400 text-center py-8">{error}</div>}

      {mechanics.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Recommended Mechanics</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {mechanics.map((m, i) => (
              <div key={i} className="bg-zinc-900 rounded-3xl p-8 text-center">
                <h3 className="font-medium text-xl">{m.name}</h3>
                <p className="text-4xl font-black text-yellow-400 mt-3">${m.price}</p>
                <p className="text-zinc-400 mt-2">{m.distance}</p>
                <p className="text-sm text-zinc-500 mt-4">{m.reason}</p>
                <a href={m.website} target="_blank" className="mt-6 block bg-black text-yellow-400 py-4 rounded-2xl text-sm">Call / Book →</a>
              </div>
            ))}
          </div>

          <button
            onClick={generateReport}
            className="w-full py-7 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-3xl text-2xl shadow-xl"
          >
            📋 Generate Official Repair Report
          </button>
        </div>
      )}

      {showReport && (
        <div className="bg-white text-black rounded-3xl p-8 shadow-2xl">
          <div className="bg-black text-white p-8 rounded-t-3xl -mx-8 -mt-8 mb-10 text-center">
            <div className="text-4xl font-black text-yellow-400">SHUKAI</div>
            <div className="text-sm">OFFICIAL REPAIR REPORT</div>
          </div>

          <p className="text-2xl font-semibold mb-8">Problem: {input}</p>

          <table className="w-full mb-12">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-4">Mechanic</th>
                <th className="text-left py-4">Estimate</th>
                <th className="text-left py-4">Distance</th>
              </tr>
            </thead>
            <tbody>
              {mechanics.map((m, i) => (
                <tr key={i} className="border-b">
                  <td className="py-5 font-medium">{m.name}</td>
                  <td className="py-5 font-semibold">${m.price}</td>
                  <td className="py-5">{m.distance}</td>
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
    </div>
  );
}
