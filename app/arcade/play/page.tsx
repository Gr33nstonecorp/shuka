"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SessionResponse = {
  session?: {
    id: string;
    player_name: string | null;
    email: string | null;
    status: string;
    paid_at?: string | null;
    used_at?: string | null;
    created_at?: string | null;
  };
  canPlay?: boolean;
  error?: string;
};

type GameState = "loading" | "ready" | "playing" | "gameover" | "blocked";

type Obstacle = {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
};

export default function ArcadePlayPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const [gameState, setGameState] = useState<GameState>("loading");
  const [sessionId, setSessionId] = useState("");
  const [playerName, setPlayerName] = useState("Player");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const gameData = useRef({
    playerX: 180,
    playerY: 520,
    playerW: 60,
    playerH: 60,
    moveLeft: false,
    moveRight: false,
    obstacles: [] as Obstacle[],
    frame: 0,
    running: false,
    score: 0,
  });

  const params = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  useEffect(() => {
    const id = params.get("session_id") || "";
    setSessionId(id);

    if (!id) {
      setGameState("blocked");
      setMessage("Missing arcade session.");
      return;
    }

    loadSession(id);

    return () => {
      stopLoop();
    };
  }, [params]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        gameData.current.moveLeft = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        gameData.current.moveRight = true;
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        gameData.current.moveLeft = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        gameData.current.moveRight = false;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  async function loadSession(id: string) {
    try {
      const res = await fetch(`/api/arcade/session?session_id=${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      const data: SessionResponse = await res.json();

      if (!res.ok || !data.session) {
        setGameState("blocked");
        setMessage(data.error || "Could not load arcade session.");
        return;
      }

      setPlayerName(data.session.player_name || "Player");

      if (!data.canPlay) {
        setGameState("blocked");
        setMessage("This paid play has already been used or was not paid.");
        return;
      }

      setGameState("ready");
    } catch {
      setGameState("blocked");
      setMessage("Network error while loading session.");
    }
  }

  function startGame() {
    gameData.current = {
      playerX: 180,
      playerY: 520,
      playerW: 60,
      playerH: 60,
      moveLeft: false,
      moveRight: false,
      obstacles: [],
      frame: 0,
      running: true,
      score: 0,
    };

    setScore(0);
    setGameState("playing");
    loop();
  }

  function stopLoop() {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    gameData.current.running = false;
  }

  async function finishGame(finalScore: number) {
    stopLoop();
    setScore(finalScore);
    setSubmitting(true);

    try {
      const res = await fetch("/api/arcade/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          playerName,
          score: finalScore,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.error || "Could not submit score.");
      } else {
        setMessage("Your score was submitted.");
      }
    } catch {
      setMessage("Network error while submitting score.");
    } finally {
      setSubmitting(false);
      setGameState("gameover");
    }
  }

  function loop() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const g = gameData.current;

    const tick = () => {
      if (!g.running) return;

      g.frame += 1;

      if (g.moveLeft) g.playerX -= 6;
      if (g.moveRight) g.playerX += 6;

      if (g.playerX < 0) g.playerX = 0;
      if (g.playerX + g.playerW > width) g.playerX = width - g.playerW;

      if (g.frame % 28 === 0) {
        const w = 40 + Math.floor(Math.random() * 60);
        const h = 40 + Math.floor(Math.random() * 60);
        const x = Math.floor(Math.random() * (width - w));
        const speed = 3 + Math.random() * 4;

        g.obstacles.push({
          x,
          y: -h,
          w,
          h,
          speed,
        });
      }

      g.obstacles.forEach((o) => {
        o.y += o.speed;
      });

      g.obstacles = g.obstacles.filter((o) => o.y < height + 100);

      for (const o of g.obstacles) {
        const hit =
          g.playerX < o.x + o.w &&
          g.playerX + g.playerW > o.x &&
          g.playerY < o.y + o.h &&
          g.playerY + g.playerH > o.y;

        if (hit) {
          finishGame(g.score);
          return;
        }
      }

      g.score += 1;
      setScore(g.score);

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#27272a";
      for (let i = 0; i < height; i += 60) {
        ctx.fillRect(width / 2 - 4, i, 8, 30);
      }

      ctx.fillStyle = "#facc15";
      ctx.fillRect(g.playerX, g.playerY, g.playerW, g.playerH);

      ctx.fillStyle = "#f59e0b";
      g.obstacles.forEach((o) => {
        ctx.fillRect(o.x, o.y, o.w, o.h);
      });

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(`Score: ${g.score}`, 20, 36);

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
  }

  function moveLeftStart() {
    gameData.current.moveLeft = true;
  }

  function moveLeftEnd() {
    gameData.current.moveLeft = false;
  }

  function moveRightStart() {
    gameData.current.moveRight = true;
  }

  function moveRightEnd() {
    gameData.current.moveRight = false;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="text-yellow-400 text-sm font-medium tracking-wider mb-3">
          BOX RUNNER
        </div>

        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
          Dodge the falling boxes
        </h1>

        <p className="text-zinc-400">
          Player: {playerName} • Score: {score}
        </p>
      </div>

      {gameState === "loading" && (
        <div className="text-center text-zinc-400 py-16">
          Loading arcade session...
        </div>
      )}

      {gameState === "blocked" && (
        <div className="bg-zinc-900 rounded-3xl p-10 text-center">
          <div className="text-red-400 text-xl font-semibold mb-4">{message}</div>
          <a
            href="/arcade"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-2xl"
          >
            Back to Arcade
          </a>
        </div>
      )}

      {(gameState === "ready" || gameState === "playing" || gameState === "gameover") && (
        <div className="bg-zinc-900 rounded-3xl p-8">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <div className="text-zinc-400">
              Use <span className="text-white font-semibold">← →</span> or{" "}
              <span className="text-white font-semibold">A / D</span>
            </div>

            {gameState === "ready" && (
              <button
                onClick={startGame}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-2xl"
              >
                Start Run
              </button>
            )}

            {gameState === "gameover" && (
              <a
                href="/arcade"
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-2xl"
              >
                Back to Arcade
              </a>
            )}
          </div>

          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={420}
              height={600}
              className="rounded-2xl border border-zinc-700 bg-black max-w-full"
            />
          </div>

          {gameState === "playing" && (
            <div className="grid grid-cols-2 gap-4 mt-6 md:hidden">
              <button
                onTouchStart={moveLeftStart}
                onTouchEnd={moveLeftEnd}
                onMouseDown={moveLeftStart}
                onMouseUp={moveLeftEnd}
                onMouseLeave={moveLeftEnd}
                className="bg-zinc-800 text-white font-semibold py-4 rounded-2xl"
              >
                ← Left
              </button>

              <button
                onTouchStart={moveRightStart}
                onTouchEnd={moveRightEnd}
                onMouseDown={moveRightStart}
                onMouseUp={moveRightEnd}
                onMouseLeave={moveRightEnd}
                className="bg-zinc-800 text-white font-semibold py-4 rounded-2xl"
              >
                Right →
              </button>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="text-center mt-8">
              <div className="text-3xl font-black text-yellow-400 mb-2">
                Final Score: {score}
              </div>
              <div className="text-zinc-400">
                {submitting ? "Submitting score..." : message || "Your paid run has been submitted."}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
