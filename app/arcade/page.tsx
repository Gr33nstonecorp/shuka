"use client";

import { useEffect, useRef, useState } from "react";

export default function ArcadePage() {
  const [currentGame, setCurrentGame] = useState<
    "menu" | "railroad" | "duckling"
  >("menu");

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-6xl font-black text-yellow-400 tracking-tight">
            SHUKAI ARCADE
          </h1>
          <p className="text-zinc-400 mt-4 text-xl">
            Free Games • More Coming Soon
          </p>
        </div>

        {currentGame === "menu" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div
              onClick={() => setCurrentGame("railroad")}
              className="bg-zinc-900 border border-yellow-400/30 rounded-3xl p-10 hover:bg-zinc-800 transition cursor-pointer"
            >
              <div className="text-6xl mb-6">🚂</div>

              <h2 className="text-4xl font-black mb-4">
                Railroad Crossing
              </h2>

              <p className="text-zinc-400 text-lg">
                Lower the crossing gate before the train crashes through.
              </p>

              <div className="mt-8 text-yellow-400 font-bold">
                PLAY →
              </div>
            </div>

            <div
              onClick={() => setCurrentGame("duckling")}
              className="bg-zinc-900 border border-yellow-400/30 rounded-3xl p-10 hover:bg-zinc-800 transition cursor-pointer"
            >
              <div className="text-6xl mb-6">🦆</div>

              <h2 className="text-4xl font-black mb-4">
                Duckling Escape
              </h2>

              <p className="text-zinc-400 text-lg">
                Jump over logs and follow Mama Duck.
              </p>

              <div className="mt-8 text-yellow-400 font-bold">
                PLAY →
              </div>
            </div>
          </div>
        )}

        {currentGame === "railroad" && (
          <RailroadGame onBack={() => setCurrentGame("menu")} />
        )}

        {currentGame === "duckling" && (
          <DuckGame onBack={() => setCurrentGame("menu")} />
        )}
      </div>
    </div>
  );
}

/* ===================================================== */
/* ================= RAILROAD GAME ===================== */
/* ===================================================== */

function RailroadGame({ onBack }: { onBack: () => void }) {
  const [gateDown, setGateDown] = useState(false);
  const [trainComing, setTrainComing] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState("Watch for trains...");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.7) {
        setTrainComing(true);
        setMessage("🚨 TRAIN APPROACHING!");

        setTimeout(() => {
          if (gateDown) {
            setScore((s) => s + 200);
            setMessage("✅ Safe Crossing!");
          } else {
            setLives((l) => l - 1);
            setMessage("💥 TRAIN CRASH!");
          }

          setTrainComing(false);
          setGateDown(false);
        }, 2500);
      } else {
        setScore((s) => s + 20);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [gateDown, gameOver]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
    }
  }, [lives]);

  const resetGame = () => {
    setGateDown(false);
    setTrainComing(false);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setMessage("Watch for trains...");
  };

  if (gameOver) {
    return (
      <div className="bg-zinc-900 rounded-3xl p-12 text-center max-w-lg mx-auto">
        <h2 className="text-5xl font-black text-red-500 mb-6">
          GAME OVER
        </h2>

        <p className="text-3xl mb-10">
          Final Score:{" "}
          <span className="text-yellow-400 font-black">
            {score}
          </span>
        </p>

        <button
          onClick={resetGame}
          className="bg-yellow-400 text-black px-10 py-5 rounded-2xl font-black text-xl"
        >
          Play Again
        </button>

        <button
          onClick={onBack}
          className="block mx-auto mt-6 text-zinc-400"
        >
          ← Back to Arcade
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-8 max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-yellow-400 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-5xl font-black text-center text-yellow-400 mb-6">
        Railroad Crossing
      </h2>

      <div className="text-center text-2xl mb-6">
        Score:{" "}
        <span className="text-yellow-400 font-black">
          {score}
        </span>

        <div className="mt-3 text-3xl">
          {"❤️".repeat(lives)}
        </div>
      </div>

      <div className="relative bg-black rounded-3xl overflow-hidden border-4 border-zinc-700 h-[500px]">
        {/* ROAD */}
        <div className="absolute bottom-0 w-full h-40 bg-zinc-800" />

        {/* RAIL TRACK */}
        <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-zinc-500" />
        <div className="absolute top-0 bottom-0 left-[52%] w-3 bg-zinc-500" />

        {/* TRAIN */}
        {trainComing && (
          <div className="absolute top-12 left-[-250px] text-8xl animate-[trainMove_2.5s_linear_forwards]">
            🚂🚃🚃
          </div>
        )}

        {/* CARS */}
        <div className="absolute bottom-16 left-20 text-6xl">
          🚗
        </div>

        <div className="absolute bottom-16 right-20 text-6xl">
          🚙
        </div>

        {/* GATE */}
        <div className="absolute left-1/2 bottom-36">
          <div className="w-5 h-40 bg-zinc-400 absolute left-0 bottom-0" />

          <div
            className={`w-44 h-5 bg-red-500 absolute left-0 top-5 origin-left transition-all duration-500 ${
              gateDown ? "rotate-[0deg]" : "-rotate-90"
            }`}
          >
            <div className="flex">
              <div className="w-6 h-5 bg-white" />
              <div className="w-6 h-5 bg-red-500" />
              <div className="w-6 h-5 bg-white" />
              <div className="w-6 h-5 bg-red-500" />
              <div className="w-6 h-5 bg-white" />
              <div className="w-6 h-5 bg-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-2xl mt-6 min-h-[50px]">
        {message}
      </div>

      <button
        onClick={() => setGateDown((g) => !g)}
        className={`w-full mt-8 py-6 rounded-3xl text-2xl font-black ${
          gateDown
            ? "bg-red-600"
            : "bg-yellow-400 text-black"
        }`}
      >
        {gateDown ? "RAISE GATE ↑" : "LOWER GATE ↓"}
      </button>

      <style jsx>{`
        @keyframes trainMove {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(1200px);
          }
        }
      `}</style>
    </div>
  );
}

/* ===================================================== */
/* ================== DUCK GAME ======================== */
/* ===================================================== */

function DuckGame({ onBack }: { onBack: () => void }) {
  const [playerY, setPlayerY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<
    { x: number; height: number }[]
  >([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const gravity = 0.7;

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setVelocity((v) => v + gravity);

      setPlayerY((y) => {
        const newY = y + velocity;

        if (newY > 250) {
          return 250;
        }

        if (newY < 0) {
          return 0;
        }

        return newY;
      });

      setObstacles((prev) =>
        prev
          .map((o) => ({ ...o, x: o.x - 7 }))
          .filter((o) => o.x > -50)
      );

      if (Math.random() < 0.03) {
        setObstacles((prev) => [
          ...prev,
          {
            x: 1000,
            height: Math.random() * 120 + 60,
          },
        ]);
      }

      setScore((s) => s + 1);
    }, 30);

    return () => clearInterval(gameLoop);
  }, [velocity, gameOver]);

  useEffect(() => {
    obstacles.forEach((obs) => {
      const playerX = 140;

      if (
        obs.x < playerX + 60 &&
        obs.x + 50 > playerX &&
        playerY > 250 - obs.height
      ) {
        setLives((l) => l - 1);

        setObstacles((prev) =>
          prev.filter((o) => o !== obs)
        );
      }
    });
  }, [obstacles, playerY]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
    }
  }, [lives]);

  const flap = () => {
    if (gameOver) return;

    setVelocity(-10);
  };

  const resetGame = () => {
    setPlayerY(0);
    setVelocity(0);
    setObstacles([]);
    setScore(0);
    setLives(3);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="bg-zinc-900 rounded-3xl p-12 text-center max-w-lg mx-auto">
        <h2 className="text-5xl font-black text-red-500 mb-6">
          GAME OVER
        </h2>

        <p className="text-3xl mb-8">
          Score:{" "}
          <span className="text-yellow-400 font-black">
            {score}
          </span>
        </p>

        <button
          onClick={resetGame}
          className="bg-yellow-400 text-black px-10 py-5 rounded-2xl font-black text-xl"
        >
          Play Again
        </button>

        <button
          onClick={onBack}
          className="block mx-auto mt-6 text-zinc-400"
        >
          ← Back to Arcade
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-8 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-yellow-400 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-5xl font-black text-yellow-400 text-center mb-6">
        Duckling Escape
      </h2>

      <div className="flex justify-between text-2xl mb-6">
        <div>
          Score:{" "}
          <span className="text-yellow-400 font-black">
            {score}
          </span>
        </div>

        <div>{"❤️".repeat(lives)}</div>
      </div>

      <div
        onClick={flap}
        className="relative h-[500px] bg-gradient-to-b from-sky-700 to-emerald-700 rounded-3xl overflow-hidden border-4 border-yellow-400/30 cursor-pointer"
      >
        {/* GROUND */}
        <div className="absolute bottom-0 w-full h-24 bg-green-900" />

        {/* MAMA DUCK */}
        <div className="absolute top-12 left-12 text-7xl">
          🦆
        </div>

        {/* PLAYER */}
        <div
          className="absolute text-6xl transition-transform"
          style={{
            left: 140,
            top: 120 + playerY,
          }}
        >
          🐥
        </div>

        {/* OBSTACLES */}
        {obstacles.map((obs, i) => (
          <div
            key={i}
            className="absolute bottom-24 w-14 bg-amber-800 rounded-t-xl border-4 border-amber-950"
            style={{
              left: obs.x,
              height: obs.height,
            }}
          />
        ))}
      </div>

      <button
        onClick={flap}
        className="w-full mt-8 py-6 rounded-3xl bg-yellow-400 text-black text-2xl font-black active:scale-95"
      >
        TAP TO FLAP 🪶
      </button>

      <p className="text-center text-zinc-400 mt-6">
        Tap repeatedly to stay airborne and dodge logs.
      </p>
    </div>
  );
}
