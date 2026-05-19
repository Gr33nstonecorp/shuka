"use client";

import { useState } from "react";

export default function ArcadePage() {
  const [currentGame, setCurrentGame] = useState<"menu" | "old" | "railroad" | "guesser" | "rps">("menu");

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black tracking-tighter text-yellow-400">SHUKAI ARCADE</h1>
          <p className="text-zinc-400 mt-4 text-xl">Free Games</p>
        </div>

        {/* ==================== MENU ==================== */}
        {currentGame === "menu" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Your Old Game */}
            <div
              onClick={() => setCurrentGame("old")}
              className="bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/30 rounded-3xl p-10 cursor-pointer transition group"
            >
              <div className="text-5xl mb-6">🎮</div>
              <h2 className="text-3xl font-bold mb-3">Your Original Game</h2>
              <p className="text-zinc-400">Continue playing your existing game</p>
              <div className="mt-8 text-yellow-400 font-medium group-hover:underline">Play Now →</div>
            </div>

            {/* New Railroad Crossing Game */}
            <div
              onClick={() => setCurrentGame("railroad")}
              className="bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/30 rounded-3xl p-10 cursor-pointer transition group"
            >
              <div className="text-5xl mb-6">🚦🚂</div>
              <h2 className="text-3xl font-bold mb-3">Railroad Crossing</h2>
              <p className="text-zinc-400">Lower the gate before the train arrives! 3 lives</p>
              <div className="mt-8 text-yellow-400 font-medium group-hover:underline">Play Now →</div>
            </div>

            {/* Number Guesser */}
            <div
              onClick={() => setCurrentGame("guesser")}
              className="bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/30 rounded-3xl p-10 cursor-pointer transition group"
            >
              <div className="text-5xl mb-6">🎯</div>
              <h2 className="text-3xl font-bold mb-3">Number Guesser</h2>
              <p className="text-zinc-400">Guess the number between 1-100</p>
              <div className="mt-8 text-yellow-400 font-medium group-hover:underline">Play Now →</div>
            </div>

            {/* Rock Paper Scissors */}
            <div
              onClick={() => setCurrentGame("rps")}
              className="bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/30 rounded-3xl p-10 cursor-pointer transition group"
            >
              <div className="text-5xl mb-6">✊✋✌️</div>
              <h2 className="text-3xl font-bold mb-3">Rock Paper Scissors</h2>
              <p className="text-zinc-400">Beat ShukAI in best of 5</p>
              <div className="mt-8 text-yellow-400 font-medium group-hover:underline">Play Now →</div>
            </div>
          </div>
        )}

        {/* Game Screens */}
        {currentGame === "old" && <div className="text-center py-20 text-2xl">Your Original Game Goes Here</div>}
        {currentGame === "railroad" && <RailroadCrossing onBack={() => setCurrentGame("menu")} />}
        {currentGame === "guesser" && <NumberGuesser onBack={() => setCurrentGame("menu")} />}
        {currentGame === "rps" && <RockPaperScissors onBack={() => setCurrentGame("menu")} />}
      </div>
    </div>
  );
}

/* ==================== RAILROAD CROSSING GAME ==================== */
function RailroadCrossing({ onBack }: { onBack: () => void }) {
  const [gateDown, setGateDown] = useState(false);
  const [trainComing, setTrainComing] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver || lives <= 0) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.45) {
        setTrainComing(true);
        setMessage("🚨 TRAIN COMING! LOWER THE GATE!");

        setTimeout(() => {
          if (gateDown) {
            setScore(s => s + 100);
            setMessage("✅ Safe! Well done.");
          } else {
            setLives(l => l - 1);
            setMessage("💥 CRASH! Cars were hit.");
          }
          setTrainComing(false);
          setGateDown(false);

          if (lives - 1 <= 0) setGameOver(true);
        }, 2500);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [gateDown, lives, gameOver]);

  const toggleGate = () => setGateDown(!gateDown);

  const reset = () => {
    setGateDown(false);
    setTrainComing(false);
    setScore(0);
    setLives(3);
    setMessage("");
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="bg-zinc-900 rounded-3xl p-12 text-center max-w-md mx-auto">
        <h2 className="text-5xl font-black text-yellow-400 mb-6">Game Over</h2>
        <p className="text-3xl mb-8">Final Score: {score}</p>
        <button onClick={reset} className="bg-yellow-400 text-black px-12 py-5 rounded-2xl text-xl mb-6">Play Again</button>
        <button onClick={onBack} className="text-zinc-400 block">← Back to Arcade</button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-10 max-w-lg mx-auto">
      <button onClick={onBack} className="mb-6 text-yellow-400 hover:underline">← Back to Arcade</button>
      <h2 className="text-4xl font-black text-yellow-400 text-center mb-8">Railroad Crossing</h2>

      <div className="text-center mb-8">
        <p className="text-3xl">Score: <span className="text-yellow-400">{score}</span></p>
        <p className="text-2xl mt-2">Lives: {"❤️".repeat(lives)}</p>
      </div>

      <div className="bg-black h-72 rounded-2xl relative flex items-center justify-center border-4 border-zinc-700 mb-10 overflow-hidden">
        <div className={`text-8xl transition-transform duration-500 ${gateDown ? 'rotate-[-45deg]' : ''}`}>
          {gateDown ? "🚧" : "🛤️"}
        </div>
        {trainComing && <div className="absolute text-8xl animate-bounce">🚂</div>}
      </div>

      <div className="text-center text-xl min-h-[70px] mb-8 font-medium">
        {message || "Watch for trains..."}
      </div>

      <button
        onClick={toggleGate}
        className={`w-full py-8 text-2xl font-bold rounded-3xl mb-6 transition-all ${gateDown ? 'bg-red-600' : 'bg-yellow-400 text-black'}`}
      >
        {gateDown ? "RAISE GATE ↑" : "LOWER GATE ↓"}
      </button>

      <button onClick={reset} className="w-full py-4 bg-zinc-700 rounded-2xl">Reset Game</button>
    </div>
  );
}

/* Number Guesser and Rock Paper Scissors can be added here if you want them too */
