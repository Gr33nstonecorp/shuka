"use client";

import { useState } from "react";

type Mechanic = {
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
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [possibleCause, setPossibleCause] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReport, setShowReport] = useState(false);

  const handleFindMechanic = async () => {
    if (!input.trim()) {
      setError("Please describe the problem.");
      return;
    }

    setLoading(true);
    setError("");
    setMechanics([]);
    setPossibleCause("");
    setShowReport(false);

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
        setMechanics(data.mechanics || []);
        setPossibleCause(data.possibleCause || "General diagnostic recommended.");
      }
    } catch (err) {
      setError("Failed to fetch results.");
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
        <h1 className="text-6xl font-black tracking-tighter text-yellow-400 mb-6">
          Find a Mechanic Based On Your Car's Needs
        </h1>
        <p className="text-zinc-400 text-xl">Enter zip code for local results.</p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-10 mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-zinc-400 mb-4">What's wrong with your car?</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Brakes squeaking when stopping..."
              className="w-full bg-black border border-zinc-700 rounded-2xl p-8 text-lg text-white placeholder-zinc-400 min-h-[160px] focus:border-yellow-400"
            />
          </div>
          <div>
            <p className="text-zinc-400 mb-4">Your Zip Code</p>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="11364"
              className="w-full bg-black border border-zinc-700 rounded-2xl p-8 text-lg text-white"
            />
          </div>
        </div>

        <button
          onClick={handleFindMechanic}
          disabled={loading || !input.trim()}
          className="mt-10 w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-semibold py-5 rounded-2xl text-xl"
        >
          {loading ? "Finding mechanics..." : "AI Vehicle Diagnostic"}
        </button>
      </div>

      {error && <div className="text-red-400 text-center py-8 text-lg">{error}</div>}

      {possibleCause && (
        <div className="mb-12 bg-zinc-900 rounded-3xl p-10">
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">Possible Cause</h3>
          <p className="text-zinc-300 text-lg">{possibleCause}</p>
        </div>
      )}

      {mechanics.length > 0 && (
        <div>
          <h2 className="text-4xl font-semibold mb-10 text-center">Recommended Mechanics (Best Reviews First)</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {mechanics.map((m, i) => (
              <div key={i} className="bg-zinc-900 rounded-3xl p-10 border border-zinc-800 hover:border-yellow-400/50 transition">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold">{m.name}</h3>
                    <div className="text-yellow-400 text-5xl font-black mt-2">${m.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-400">Distance</div>
                    <div className="text-xl font-medium">{m.distance}</div>
                    <div className="text-yellow-400">★ {m.rating}</div>
                  </div>
                </div>

                <p className="text-zinc-300 mb-8">{m.reason}</p>

                <a
                  href={m.website}
                  target="_blank"
                  className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-4 rounded-2xl"
                >
                  Visit Shop / Book Appointment
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
            <div className="text-4xl font-black text-yellow-400">SHUKAI</div>
            <div className="text-lg tracking-widest">OFFICIAL REPAIR REPORT</div>
          </div>

          <p className="text-3xl font-semibold mb-10">Problem: {input}</p>
          {possibleCause && <p className="text-xl mb-8 text-zinc-600">Possible Cause: {possibleCause}</p>}

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
