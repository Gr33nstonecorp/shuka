"use client";

import { useState } from "react";

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

  const [possibleScope, setPossibleScope] =
    useState("");

  const [jobId, setJobId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFindPros = async () => {
    if (!input.trim()) {
      setError(
        "Please describe the landscaping job."
      );

      return;
    }

    if (zip && !/^\d{5}$/.test(zip.trim())) {
      setError(
        "Please enter a valid 5-digit ZIP code."
      );

      return;
    }

    setLoading(true);

    setError("");
    setResults([]);
    setPossibleScope("");
    setJobId("");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          problem: input,
          zip: zip || "11364",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Could not create landscaping request."
        );
      }

      setJobId(data.jobId || "");

      setResults(
        data.landscapers || []
      );

      setPossibleScope(
        data.possibleScope ||
          "General landscaping work recommended."
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch results.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-3xl mx-auto px-5 py-10">

        {/* HEADER */}

        <div className="text-center mb-12">

          <div className="inline-flex items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-400 mb-6">
            Free for homeowners
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-yellow-400 mb-4">
            Find Local Landscapers
          </h1>

          <p className="text-zinc-400 text-lg">
            Describe the job. ShukAI handles the rest.
          </p>

        </div>


        {/* FORM */}

        <div className="bg-zinc-900 rounded-3xl p-8 mb-10 border border-zinc-800">

          <div className="space-y-6">

            <div>

              <label className="block text-zinc-400 mb-2 text-sm">
                What landscaping work do you need?
              </label>

              <textarea
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                placeholder="Overgrown backyard, need full cleanup + weekly mowing..."
                className="w-full bg-black border border-zinc-700 rounded-2xl p-5 text-white placeholder-zinc-500 min-h-[140px] focus:border-yellow-400 outline-none"
              />

            </div>


            <div>

              <label className="block text-zinc-400 mb-2 text-sm">
                Your ZIP Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setZip(value);
                }}
                placeholder="11364"
                className="w-full bg-black border border-zinc-700 rounded-2xl p-5 text-white focus:border-yellow-400 outline-none"
              />

            </div>

          </div>


          <button
            onClick={handleFindPros}
            disabled={
              loading || !input.trim()
            }
            className="mt-8 w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold py-5 rounded-2xl text-lg transition active:scale-95"
          >
            {loading
              ? "Creating your request..."
              : "Get Free Quotes"}
          </button>

          <p className="text-center text-xs text-zinc-500 mt-4">
            No homeowner fees. No obligation.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="border border-red-900 bg-red-950/30 rounded-2xl p-4 text-red-400 text-center mb-8 font-medium">
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {jobId && (
          <div className="bg-green-950/30 border border-green-800 rounded-2xl p-5 mb-8">

            <div className="font-semibold text-green-400">
              ✓ Landscaping request created
            </div>

            <div className="text-zinc-400 text-sm mt-1">
              ShukAI Job #{jobId.slice(0, 8)}
            </div>

          </div>
        )}


        {/* SCOPE */}

        {possibleScope && (
          <div className="bg-zinc-900 rounded-3xl p-8 mb-10 border border-zinc-800">

            <div className="text-xs uppercase tracking-widest text-yellow-400 mb-3">
              ShukAI Assessment
            </div>

            <h3 className="text-xl font-bold mb-3">
              Suggested Scope
            </h3>

            <p className="text-zinc-300 leading-relaxed">
              {possibleScope}
            </p>

          </div>
        )}


        {/* RESULTS */}

        {results.length > 0 && (
          <div>

            <div className="flex items-end justify-between mb-6">

              <div>

                <div className="text-sm text-zinc-500">
                  Matching providers
                </div>

                <h2 className="text-2xl font-bold">
                  Estimated Options
                </h2>

              </div>

              <div className="text-xs text-zinc-500">
                {results.length} matches
              </div>

            </div>


            <div className="space-y-6">

              {results.map((item, i) => (

                <div
                  key={`${item.name}-${i}`}
                  className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800"
                >

                  <div className="flex justify-between items-start gap-6 mb-4">

                    <div>

                      <h3 className="text-xl font-bold">
                        {item.name}
                      </h3>

                      <div className="text-sm text-zinc-500 mt-1">
                        Estimated starting price
                      </div>

                      <div className="text-yellow-400 text-3xl font-black mt-1">
                        ${item.price}
                      </div>

                    </div>


                    <div className="text-right text-sm">

                      <div className="text-zinc-400">
                        {item.distance}
                      </div>

                      <div className="text-yellow-400 mt-1">
                        ★ {item.rating}
                      </div>

                    </div>

                  </div>


                  <p className="text-zinc-400 mb-6">
                    {item.reason}
                  </p>


                  <button
                    disabled
                    className="block w-full text-center bg-zinc-800 text-zinc-400 font-bold py-4 rounded-xl cursor-not-allowed"
                  >
                    Awaiting Real Quote
                  </button>

                </div>

              ))}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
