"use client";

import { useState, useEffect } from "react";

export default function ArcadePage() {
  const [currentGame, setCurrentGame] = useState<"menu" | "railroad" | "duckling">("menu");

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black tracking-tighter text-yellow-400">SHUKAI ARCADE</h1>
          <p className="text-zinc-400 mt-4 text-xl">Free Games</p>
        </div>

        {currentGame === "menu" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div onClick={() => setCurrentGame("railroad")} className="bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/30 rounded-3xl p-10 cursor-pointer transition group">
              <div className="text-5xl mb-6">🚦🚂</div>
              <h2 className="text-3xl font-bold mb-3">Railroad Crossing</h2>
              <p className="text-zinc-400">Lower the gate before the train arrives!</p>
              <div className="mt-8 text-yellow-400 font-medium group-hover:underline">Play Now →</div>
            </div>

            <div onClick={() => setCurrentGame("duckling")} className="bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/30 rounded-3xl p-10 cursor-pointer transition group">
              <div className="text-5xl mb-6">🦆🐥</div>
              <h2 className="text-3xl font-bold mb-3">Duckling Follow</h2>
              <p className="text-zinc-400">Jump over obstacles to follow Mama Duck</p>
              <div className="mt-8 text-yellow-400 font-medium group-hover:underline">Play Now →</div>
            </div>
          </div>
        )}

        {currentGame === "railroad" && <RailroadCrossing onBack={() => setCurrentGame("menu")} />}
        {currentGame === "duckling" && <DucklingFollow onBack={() => setCurrentGame("menu")} />}
      </div>
    </div>
  );
}

/* ==================== RAILROAD CROSSING ==================== */
function RailroadCrossing({ onBack }: { onBack: () => void }) {
  const [gateDown, setGateDown] = useState(false);
  const [trainComing, setTrainComing] = useState(false);
  const [carsPassed, setCarsPassed] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver || lives <= 0) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        setTrainComing(true);
        setMessage("🚨 TRAIN COMING! LOWER GATE!");

        setTimeout(() => {
          if (gateDown) {
            setScore(s => s + 200);
            setMessage("✅ Safe crossing!");
          } else {
            setLives(l => l - 1);
            setMessage("💥 CRASH! Cars hit by train.");
          }
          setTrainComing(false);
          setGateDown(false);

          if (lives - 1 <= 0) setGameOver(true);
        }, 2200);
      } else {
        setCarsPassed(c => c + 1);
        setScore(s => s + 10);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [gateDown, lives, gameOver]);

  const toggleGate = () => setGateDown(!gateDown);

  const reset = () => {
    setGateDown(false);
    setTrainComing(false);
    setCarsPassed(0);
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
    <div className="bg-zinc-900 rounded-3xl p-8 max-w-lg mx-auto">
      <button onClick={onBack} className="mb-6 text-yellow-400 hover:underline">← Back</button>
      <h2 className="text-4xl font-black text-yellow-400 text-center mb-6">Railroad Crossing</h2>

      <div className="text-center mb-6">
        <p>Score: <span className="text-yellow-400 font-bold">{score}</span> | Lives: {"❤️".repeat(lives)}</p>
      </div>

      {/* Visual Crossing */}
      <div className="bg-black h-80 rounded-2xl relative overflow-hidden border-4 border-zinc-700 mb-8">
        {/* Road */}
        <div className="absolute bottom-12 w-full h-20 bg-zinc-700" />
        {/* Cars */}
        <div className={`absolute bottom-16 text-4xl transition-all duration-700 ${trainComing ? 'opacity-30' : ''}`} style={{ left: '20%' }}>🚗</div>
        <div className={`absolute bottom-16 text-4xl transition-all duration-700 ${trainComing ? 'opacity-30' : ''}`} style={{ left: '60%' }}>🚙</div>

        {/* Gate */}
        <div className={`absolute left-1/2 top-20 w-3 h-52 bg-red-600 transition-all duration-700 origin-top ${gateDown ? 'rotate-[-45deg]' : ''}`} />

        {/* Train */}
        {trainComing && <div className="absolute top-28 text-7xl animate-[train_2s_linear_forwards] left-[-100px]">🚂</div>}
      </div>

      <div className="text-center text-xl mb-8 min-h-[60px]">{message || "Wait for train..."}</div>

      <button
        onClick={toggleGate}
        className={`w-full py-8 text-2xl font-bold rounded-3xl mb-6 ${gateDown ? 'bg-red-600' : 'bg-yellow-400 text-black'}`}
      >
        {gateDown ? "RAISE GATE ↑" : "LOWER GATE ↓"}
      </button>

      <button onClick={reset} className="w-full py-4 bg-zinc-700 rounded-2xl">Reset Game</button>
    </div>
  );
}

/* ==================== DUCKLING FOLLOW ==================== */
function DucklingFollow({ onBack }: { onBack: () => void }) {
  const [ducklingPos, setDucklingPos] = useState(40);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [obstacles, setObstacles] = useState<number[]>([]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setDucklingPos(p => Math.max(10, p - 0.8));

      // Spawn obstacles
      if (Math.random() < 0.15) {
        setObstacles(prev => [...prev, 100]);
      }

      // Move obstacles
      setObstacles(prev => prev.map(pos => pos - speed).filter(pos => pos > -10));

      // Collision
      const collision = obstacles.some(pos => pos < 55 && pos > 25 && ducklingPos < 60);
      if (collision) {
        setGameOver(true);
      }

      setScore(s => s + 1);

      // Increase difficulty
      if (score % 80 === 0 && speed < 4) setSpeed(s => s + 0.3);
    }, 60);

    return () => clearInterval(gameLoop);
  }, [ducklingPos, obstacles, score, speed, gameOver]);

  const jump = () => {
    if (gameOver) return;
    setDucklingPos(p => Math.min(85, p + 35));
  };

  const reset = () => {
    setDucklingPos(40);
    setScore(0);
    setSpeed(1);
    setObstacles([]);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="bg-zinc-900 rounded-3xl p-12 text-center max-w-md mx-auto">
        <h2 className="text-5xl font-black text-yellow-400 mb-6">Game Over</h2>
        <p className="text-3xl mb-8">Score: {score}</p>
        <button onClick={reset} className="bg-yellow-400 text-black px-12 py-5 rounded-2xl text-xl mb-6">Play Again</button>
        <button onClick={onBack} className="text-zinc-400 block">← Back to Arcade</button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-8 max-w-md mx-auto">
      <button onClick={onBack} className="mb-6 text-yellow-400 hover:underline">← Back</button>
      <h2 className="text-4xl font-black text-yellow-400 text-center mb-6">Duckling Follow</h2>

      <p className="text-center text-2xl mb-6">Score: {score}</p>

      <div className="bg-gradient-to-b from-sky-900 to-emerald-900 h-96 rounded-3xl relative overflow-hidden border-4 border-yellow-400/30">
        {/* Mama Duck */}
        <div className="absolute top-1/3 left-8 text-6xl transition-all">🦆</div>

        {/* Duckling */}
        <div className="absolute text-5xl transition-all duration-200" style={{ left: `${ducklingPos}%`, top: '45%' }}>🐥</div>

        {/* Obstacles */}
        {obstacles.map((pos, i) => (
          <div key={i} className="absolute text-4xl" style={{ left: `${pos}%`, top: '65%' }}>🌳</div>
        ))}
      </div>

      <button
        onClick={jump}
        className="w-full mt-8 py-8 bg-yellow-400 text-black text-2xl font-bold rounded-3xl active:scale-95"
      >
        TAP TO FLAP / JUMP 🪶
      </button>

      <p className="text-center text-zinc-400 mt-6">Stay close to Mama Duck and jump over logs!</p>
    </div>
  );
}
