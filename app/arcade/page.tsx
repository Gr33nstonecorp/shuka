"use client";

import { useState, useEffect } from "react";

export default function ArcadePage() {
  const [currentGame, setCurrentGame] = useState<"menu" | "old" | "railroad" | "guesser" | "rps">("menu");

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black tracking-tighter text-yellow-400">SHUKAI ARCADE</h1>
          <p className="text-zinc-400 mt-4 text-xl">Free Games</p>
        </div>

        {/* MENU */}
        {currentGame === "menu" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div onClick={() => setCurrentGame("old")} className="bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/30 rounded-3xl p-10 cursor-pointer transition group">
              <div className="text-5xl mb-6">🎮</div>
              <h2 className="text-3xl font-bold mb-3">Your Original Game</h2>
              <p className="text-zinc-400">Continue your existing game</p>
              <div className="mt-8 text-yellow-400 font-medium group-hover:underline">Play Now →</div>
            </div>

            <div onClick={() => setCurrentGame("railroad")} className="bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/30 rounded-3xl p-10 cursor-pointer transition group">
              <div className="text-5xl mb-6">🚦🚂</div>
              <h2 className="text-3xl font-bold mb-3">Railroad Crossing</h2>
              <p className="text-zinc-400">Lower the gate before the train arrives!</p>
              <div className="mt-8 text-yellow-400 font-medium group-hover:underline">Play Now →</div>
            </div>

            <div onClick={() => setCurrentGame("guesser")} className="bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/30 rounded-3xl p-10 cursor-pointer transition group">
              <div className="text-5xl mb-6">🎯</div>
              <h2 className="text-3xl font-bold mb-3">Number Guesser</h2>
              <p className="text-zinc-400">Guess the number 1-100</p>
              <div className="mt-8 text-yellow-400 font-medium group-hover:underline">Play Now →</div>
            </div>

            <div onClick={() => setCurrentGame("rps")} className="bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/30 rounded-3xl p-10 cursor-pointer transition group">
              <div className="text-5xl mb-6">✊✋✌️</div>
              <h2 className="text-3xl font-bold mb-3">Rock Paper Scissors</h2>
              <p className="text-zinc-400">Beat ShukAI</p>
              <div className="mt-8 text-yellow-400 font-medium group-hover:underline">Play Now →</div>
            </div>
          </div>
        )}

        {/* Games */}
        {currentGame === "old" && <div className="text-center py-20 text-3xl">Your Original Game Goes Here</div>}
        {currentGame === "railroad" && <RailroadCrossing onBack={() => setCurrentGame("menu")} />}
        {currentGame === "guesser" && <NumberGuesser onBack={() => setCurrentGame("menu")} />}
        {currentGame === "rps" && <RockPaperScissors onBack={() => setCurrentGame("menu")} />}
      </div>
    </div>
  );
}

/* ==================== RAILROAD CROSSING ==================== */
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
            setMessage("✅ Safe crossing!");
          } else {
            setLives(l => l - 1);
            setMessage("💥 CRASH! Cars hit by train.");
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
      <button onClick={onBack} className="mb-6 text-yellow-400 hover:underline">← Back</button>
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
        {message || "Watch for incoming trains..."}
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

/* ==================== NUMBER GUESSER ==================== */
function NumberGuesser({ onBack }: { onBack: () => void }) {
  const [target] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (!num) return;
    setAttempts(a => a + 1);
    if (num === target) {
      setMessage(`🎉 Correct! It was ${target}.`);
    } else if (num < target) {
      setMessage("⬆️ Higher");
    } else {
      setMessage("⬇️ Lower");
    }
    setGuess("");
  };

  return (
    <div className="bg-zinc-900 rounded-3xl p-10 max-w-md mx-auto">
      <button onClick={onBack} className="mb-8 text-yellow-400 hover:underline">← Back</button>
      <h2 className="text-4xl font-black text-yellow-400 mb-8 text-center">Number Guesser</h2>
      <p className="text-center mb-8">Attempts: {attempts}</p>

      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        className="w-full bg-black border border-zinc-700 rounded-2xl p-8 text-5xl text-center mb-6"
        placeholder="??"
      />
      <button onClick={handleGuess} className="w-full bg-yellow-400 text-black py-6 rounded-2xl text-2xl font-bold">Guess</button>
      {message && <div className="mt-8 text-2xl text-center p-8 bg-zinc-800 rounded-3xl">{message}</div>}
    </div>
  );
}

/* ==================== ROCK PAPER SCISSORS ==================== */
function RockPaperScissors({ onBack }: { onBack: () => void }) {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [aiChoice, setAiChoice] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const play = (choice: string) => {
    const options = ["rock", "paper", "scissors"];
    const ai = options[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setAiChoice(ai);

    if (choice === ai) setResult("Tie!");
    else if (
      (choice === "rock" && ai === "scissors") ||
      (choice === "paper" && ai === "rock") ||
      (choice === "scissors" && ai === "paper")
    ) {
      setResult("You Win!");
      setPlayerScore(s => s + 1);
    } else {
      setResult("ShukAI Wins!");
      setAiScore(s => s + 1);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-3xl p-10 max-w-lg mx-auto">
      <button onClick={onBack} className="mb-8 text-yellow-400 hover:underline">← Back</button>
      <h2 className="text-4xl font-black text-yellow-400 mb-8 text-center">Rock Paper Scissors</h2>
      
      <div className="text-center mb-8 text-2xl">You {playerScore} — {aiScore} ShukAI</div>

      <div className="flex justify-center gap-8 mb-12">
        {["✊", "✋", "✌️"].map((emoji, i) => (
          <button key={i} onClick={() => play(["rock", "paper", "scissors"][i])} className="text-7xl p-6 hover:scale-110 transition">
            {emoji}
          </button>
        ))}
      </div>

      {result && <div className="text-3xl text-center mb-8">{result}</div>}

      <button onClick={() => { setPlayerChoice(null); setAiChoice(null); setResult(""); }} className="w-full py-5 bg-zinc-700 hover:bg-zinc-600 rounded-2xl">
        Play Again
      </button>
    </div>
  );
}
