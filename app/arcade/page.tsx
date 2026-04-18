"use client";

import { useEffect, useState } from "react";

type ScoreRow = {
  id: string;
  player_name: string | null;
  score: number;
  created_at: string;
};

export default function ArcadePage() {
  const [email, setEmail] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadLeaderboard();

    const url = new URL(window.location.href);
    const checkout = url.searchParams.get("checkout");
    if (checkout === "cancel") {
      setMessage("Checkout canceled.");
    }
  }, []);

  async function loadLeaderboard() {
    try {
      const res = await fetch("/api/arcade/leaderboard");
      const data = await res.json();
      if (res.ok && data.scores) {
        setScores(data.scores);
      }
    } catch {}
  }

  async function handleCheckout() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/arcade/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          playerName: playerName || "Player"
        })
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setMessage(data.error || "Could not start checkout.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setMessage("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-14">
        <div className="inline-block bg-yellow-400/10 text-yellow-400 px-6 py-2 rounded-full text-sm font-medium mb-6 border border-yellow-400/30">
          SHUKAI ARCADE
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-6 text-yellow-400">
          Box Runner
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Dodge falling warehouse boxes, survive as long as you can, and post your score.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Play for $1</h2>

          <div className="space-y-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Player name"
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
            />

            <div className="bg-zinc-800 rounded-2xl p-5 text-zinc-300">
              <div className="font-semibold text-white mb-2">How it works</div>
              <ul className="space-y-2 text-sm">
                <li>• Pay $1 to unlock one play</li>
                <li>• Survive as long as possible</li>
                <li>• Score is submitted once per paid run</li>
              </ul>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-4 rounded-2xl text-lg transition-all"
            >
              {loading ? "Starting checkout..." : "Play Box Runner for $1"}
            </button>

            {message && (
              <div className="text-red-400 text-sm text-center">{message}</div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Leaderboard</h2>

          {scores.length === 0 ? (
            <div className="text-zinc-500">No scores yet.</div>
          ) : (
            <div className="space-y-3">
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between bg-zinc-800 rounded-2xl px-5 py-4"
                >
                  <div>
                    <div className="text-white font-semibold">
                      #{index + 1} {score.player_name || "Player"}
                    </div>
                    <div className="text-zinc-500 text-sm">
                      {new Date(score.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-yellow-400 text-2xl font-black">
                    {score.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
