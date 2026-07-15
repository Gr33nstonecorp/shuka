"use client";

import { useState } from "react";

type Mechanic = {
  name: string;
  price: number;
  reason: string;
  distance: string;
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
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: input }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.mechanics) {
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black tracking-tighter text-yellow-400">Car Mechanic Finder</h1>
        <p className="text-zinc-400 mt-4 text-xl max-w-2xl mx-auto">
          Describe the problem with your car. Get local mechanics with pricing.
        </p>
      </div>

      {/* Input */}
      <div className="bg-zinc-900 rounded-3xl p-10 mb-16">
        <p className="text-zinc-400 mb-4 text-lg">What's wrong with your car?</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Brakes squeaking when I stop, check engine light came on..."
          className="w-full bg-black border border-zinc-700 rounded-2xl p-8 text-lg min-h-[160px] focus:border-yellow-400"
        />
        <button
          onClick={handleFindMechanic}
          disabled={loading || !input.trim()}
          className="mt-8 w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-semibold py-5 rounded-2xl text-xl transition"
        >
          {loading ? "Finding mechanics near you..." : "Find Mechanics"}
        </button>
      </div>

      {error && <div className="text-red-400 text-center py-8 text-lg">{error}</div>}

      {mechanics.length > 0 && (
        <div>
          <h2 className="text-4xl font-semibold mb-10 text-center">Recommended Mechanics</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {mechanics.map((m, i) => (
              <div key={i} className="bg-zinc-900 rounded-3xl p-10 border border-zinc-800 hover:border-yellow-400/50 transition">
                <div className="text-5xl mb-6">🔧</div>
                <h3 className="text-2xl font-semibold mb-2">{m.name}</h3>
                <div className="text-5xl font-black text-yellow-400 mb-1">${m.price}</div>
                <p className="text-sm text-zinc-400 mb-6">{m.distance}</p>
                <p className="text-zinc-300 mb-8">{m.reason}</p>
                <a
                  href={m.website}
                  target="_blank"
                  className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-4 rounded-2xl"
                >
                  Contact / Book Appointment
                </a>
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
        <div className="bg-white text-black rounded-3xl p-10 shadow-2xl mt-16">
          <div className="bg-black text-white p-10 rounded-t-3xl -mx-10 -mt-10 mb-12 text-center">
            <div className="text-5xl font-black text-yellow-400">SHUKAI</div>
            <div className="text-lg tracking-widest">OFFICIAL REPAIR REPORT</div>
          </div>

          <p className="text-3xl font-semibold mb-10">Problem: {input}</p>

          <table className="w-full mb-12 text-lg">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-5">Mechanic</th>
                <th className="text-left py-5">Estimate</th>
                <th className="text-left py-5">Distance</th>
              </tr>
            </thead>
            <tbody>
              {mechanics.map((m, i) => (
                <tr key={i} className="border-b">
                  <td className="py-6 font-medium">{m.name}</td>
                  <td className="py-6 font-semibold">${m.price}</td>
                  <td className="py-6">{m.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-4">
            <button onClick={() => window.print()} className="flex-1 py-5 bg-black text-white rounded-2xl text-lg">Print / Save as PDF</button>
            <button onClick={() => setShowReport(false)} className="flex-1 py-5 border border-black rounded-2xl text-lg">Close Report</button>
          </div>
        </div>
      )}
    </div>
  );
}
