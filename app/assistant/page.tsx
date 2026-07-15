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
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-yellow-400 mb-4">
            Find a Mechanic
          </h1>
          <p className="text-zinc-400 text-lg">Describe the problem + zip code</p>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-8 mb-12">
          <div className="space-y-8">
            <div>
              <p className="text-zinc-400 mb-3 text-lg">What's wrong with your car?</p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Brakes squeaking, car shakes at highway speeds..."
                className="w-full bg-black border border-zinc-700 rounded-3xl p-6 text-lg min-h-[160px] text-white placeholder-zinc-500"
              />
            </div>

            <div>
              <p className="text-zinc-400 mb-3 text-lg">Your Zip Code</p>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="11364"
                className="w-full bg-black border border-zinc-700 rounded-3xl p-6 text-lg text-white"
              />
            </div>
          </div>

          <button
            onClick={handleFindMechanic}
            disabled={loading || !input.trim()}
            className="mt-10 w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-black font-bold py-6 rounded-3xl text-2xl active:scale-95 transition"
          >
            {loading ? "Searching local mechanics..." : "AI Vehicle Diagnostic"}
          </button>
        </div>

        {error && <div className="text-red-400 text-center py-8 text-xl">{error}</div>}

        {possibleCause && (
          <div className="mb-12 bg-zinc-900 rounded-3xl p-8">
            <h3 className="text-yellow-400 text-xl font-semibold mb-3">Possible Cause</h3>
            <p className="text-zinc-300 text-lg leading-relaxed">{possibleCause}</p>
          </div>
        )}

        {mechanics.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-semibold mb-8 text-center">Local Mechanics (Best Reviews First)</h2>

            <div className="space-y-8">
              {mechanics.map((m, i) => (
                <div key={i} className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
                  <div className="flex justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">{m.name}</h3>
                      <div className="text-yellow-400 text-4xl font-black mt-1">${m.price}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">Distance</div>
                      <div className="text-xl">{m.distance}</div>
                      <div className="text-yellow-400">★ {m.rating}</div>
                    </div>
                  </div>

                  <p className="text-zinc-300 mb-6">{m.reason}</p>

                  <a
                    href={m.website}
                    target="_blank"
                    className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-5 rounded-2xl text-lg"
                  >
                    Contact / Book Now
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={generateReport}
              className="mt-12 w-full py-6 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-3xl text-2xl"
            >
              📋 Generate Official Repair Report
            </button>
          </div>
        )}

        {showReport && (
          <div className="bg-white text-black rounded-3xl p-10 shadow-2xl">
            {/* Report content same as before */}
            <div className="bg-black text-white p-10 rounded-t-3xl -mx-10 -mt-10 mb-12 text-center">
              <div className="text-4xl font-black text-yellow-400">SHUKAI</div>
              <div className="text-lg">OFFICIAL REPAIR REPORT</div>
            </div>

            <p className="text-3xl font-semibold mb-10">Problem: {input}</p>
            {possibleCause && <p className="text-xl mb-8">Possible Cause: {possibleCause}</p>}

            <div className="flex gap-4">
              <button onClick={() => window.print()} className="flex-1 py-5 bg-black text-white rounded-2xl">Print / Save PDF</button>
              <button onClick={() => setShowReport(false)} className="flex-1 py-5 border border-black rounded-2xl">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
