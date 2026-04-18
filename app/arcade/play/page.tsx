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

type ScoreRow = {
  id: string;
  player_name: string | null;
  score: number;
  created_at: string;
};

type GameState = "loading" | "ready" | "playing" | "gameover" | "blocked";

type Obstacle = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  hitboxInset: number;
};

type Coin = {
  id: number;
  x: number;
  y: number;
  r: number;
  speed: number;
  collected: boolean;
};

type Particle = {
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  color: string;
};

type GameData = {
  playerX: number;
  playerY: number;
  playerW: number;
  playerH: number;
  moveLeft: boolean;
  moveRight: boolean;
  obstacles: Obstacle[];
  coins: Coin[];
  particles: Particle[];
  frame: number;
  running: boolean;
  score: number;
  coinScore: number;
  difficulty: number;
  obstacleTimer: number;
  coinTimer: number;
  nextId: number;
  animTick: number;
  animFrame: number;
};

const CANVAS_W = 420;
const CANVAS_H = 600;
const ROAD_Y = 520;
const PLAYER_SPEED = 7;
const BASE_OBSTACLE_SPEED = 3.2;
const BASE_SPAWN_INTERVAL = 34;
const BASE_COIN_INTERVAL = 80;
const RUN_FRAMES = 4;

export default function ArcadePlayPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const spriteLoadedRef = useRef(false);

  const [gameState, setGameState] = useState<GameState>("loading");
  const [sessionId, setSessionId] = useState("");
  const [playerName, setPlayerName] = useState("Player");
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<ScoreRow[]>([]);

  const gameData = useRef<GameData>({
    playerX: 180,
    playerY: ROAD_Y,
    playerW: 64,
    playerH: 64,
    moveLeft: false,
    moveRight: false,
    obstacles: [],
    coins: [],
    particles: [],
    frame: 0,
    running: false,
    score: 0,
    coinScore: 0,
    difficulty: 1,
    obstacleTimer: 0,
    coinTimer: 0,
    nextId: 1,
    animTick: 0,
    animFrame: 0,
  });

  const params = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/player-sprite.png";
    img.onload = () => {
      spriteRef.current = img;
      spriteLoadedRef.current = true;
    };
    img.onerror = () => {
      spriteLoadedRef.current = false;
    };
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
    loadLeaderboard();

    return () => stopLoop();
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

  async function loadLeaderboard() {
    try {
      const res = await fetch("/api/arcade/leaderboard", {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.scores) {
        setLeaderboard(data.scores);
      }
    } catch {
      // ignore
    }
  }

  function resetGame() {
    gameData.current = {
      playerX: 180,
      playerY: ROAD_Y,
      playerW: 64,
      playerH: 64,
      moveLeft: false,
      moveRight: false,
      obstacles: [],
      coins: [],
      particles: [],
      frame: 0,
      running: true,
      score: 0,
      coinScore: 0,
      difficulty: 1,
      obstacleTimer: 0,
      coinTimer: 0,
      nextId: 1,
      animTick: 0,
      animFrame: 0,
    };

    setScore(0);
    setCoinsCollected(0);
    setMessage("");
  }

  function startGame() {
    resetGame();
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
        await loadLeaderboard();
      }
    } catch {
      setMessage("Network error while submitting score.");
    } finally {
      setSubmitting(false);
      setGameState("gameover");
    }
  }

  function addObstacle(g: GameData) {
    const difficultySpeed = BASE_OBSTACLE_SPEED + g.difficulty * 0.55;
    const w = 48 + Math.floor(Math.random() * 52);
    const h = 48 + Math.floor(Math.random() * 52);
    const lanePadding = 18;
    const x = lanePadding + Math.random() * (CANVAS_W - w - lanePadding * 2);

    g.obstacles.push({
      id: g.nextId++,
      x,
      y: -h - 10,
      w,
      h,
      speed: difficultySpeed + Math.random() * 1.8,
      hitboxInset: 8,
    });
  }

  function addCoin(g: GameData) {
    const r = 14;
    const x = 24 + Math.random() * (CANVAS_W - 48);
    g.coins.push({
      id: g.nextId++,
      x,
      y: -20,
      r,
      speed: 3 + g.difficulty * 0.35,
      collected: false,
    });
  }

  function addTrail(g: GameData) {
    g.particles.push({
      x: g.playerX + 14 + Math.random() * 8,
      y: g.playerY + g.playerH - 8,
      size: 4 + Math.random() * 4,
      life: 12,
      maxLife: 12,
      vx: -0.4 + Math.random() * 0.8,
      vy: 0.3 + Math.random() * 0.9,
      color: Math.random() > 0.5 ? "#FF8C1A" : "#FFD700",
    });
  }

  function addCoinBurst(g: GameData, x: number, y: number) {
    for (let i = 0; i < 10; i++) {
      g.particles.push({
        x,
        y,
        size: 3 + Math.random() * 4,
        life: 18,
        maxLife: 18,
        vx: -2 + Math.random() * 4,
        vy: -2 + Math.random() * 4,
        color: Math.random() > 0.4 ? "#FFD700" : "#FFA500",
      });
    }
  }

  function updateParticles(g: GameData) {
    g.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
    });
    g.particles = g.particles.filter((p) => p.life > 0);
  }

  function drawParticles(ctx: CanvasRenderingContext2D, g: GameData) {
    g.particles.forEach((p) => {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  function updateDifficulty(g: GameData) {
    g.difficulty = 1 + Math.floor(g.score / 300) * 0.2 + g.coinScore * 0.03;
  }

  function rectsHit(
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    bx: number,
    by: number,
    bw: number,
    bh: number
  ) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  function coinHit(
    px: number,
    py: number,
    pw: number,
    ph: number,
    cx: number,
    cy: number,
    cr: number
  ) {
    const closestX = Math.max(px, Math.min(cx, px + pw));
    const closestY = Math.max(py, Math.min(cy, py + ph));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy < cr * cr;
  }

  function drawBackground(ctx: CanvasRenderingContext2D, g: GameData) {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    sky.addColorStop(0, "#111827");
    sky.addColorStop(1, "#0f172a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = "#1f2937";
    for (let i = 0; i < CANVAS_H; i += 70) {
      ctx.fillRect(CANVAS_W / 2 - 4, i + ((g.frame * 2) % 70), 8, 34);
    }

    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, ROAD_Y + 54, CANVAS_W, CANVAS_H - (ROAD_Y + 54));

    ctx.fillStyle = "#374151";
    ctx.fillRect(0, ROAD_Y + 52, CANVAS_W, 4);
  }

  function drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle) {
    const grad = ctx.createLinearGradient(o.x, o.y, o.x, o.y + o.h);
    grad.addColorStop(0, "#6b7280");
    grad.addColorStop(1, "#4b5563");
    ctx.fillStyle = grad;
    ctx.fillRect(o.x, o.y, o.w, o.h);

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.strokeRect(o.x, o.y, o.w, o.h);

    ctx.fillStyle = "#9ca3af";
    const spikeW = 8;
    const spikeH = 8;
    for (let i = 0; i < Math.floor(o.w / 16); i++) {
      const sx = o.x + 6 + i * 16;
      ctx.beginPath();
      ctx.moveTo(sx, o.y);
      ctx.lineTo(sx + spikeW / 2, o.y - spikeH);
      ctx.lineTo(sx + spikeW, o.y);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawCoin(ctx: CanvasRenderingContext2D, c: Coin, spin: number) {
    const squash = 0.82 + Math.sin(spin) * 0.18;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.scale(squash, 1);

    ctx.beginPath();
    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#FF8C00";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, c.r * 0.55, 0, Math.PI * 2);
    ctx.strokeStyle = "#FFA500";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  function drawPlayer(ctx: CanvasRenderingContext2D, g: GameData) {
    const img = spriteRef.current;
    const running = g.moveLeft || g.moveRight || g.running;
    if (running) {
      g.animTick += 1;
      if (g.animTick % 6 === 0) {
        g.animFrame = (g.animFrame + 1) % RUN_FRAMES;
      }
    }

    const bounce = running ? Math.sin(g.animTick * 0.35) * 2 : 0;
    const scaleY = 1 + Math.abs(Math.sin(g.animTick * 0.3)) * 0.03;
    const scaleX = 1 - Math.abs(Math.sin(g.animTick * 0.3)) * 0.02;

    ctx.save();
    ctx.translate(g.playerX + g.playerW / 2, g.playerY + g.playerH / 2 + bounce);
    ctx.scale(scaleX, scaleY);

    if (img && spriteLoadedRef.current) {
      const frameW = img.width / RUN_FRAMES;
      const frameH = img.height;
      const sx = g.animFrame * frameW;

      ctx.drawImage(
        img,
        sx,
        0,
        frameW,
        frameH,
        -g.playerW / 2,
        -g.playerH / 2,
        g.playerW,
        g.playerH
      );
    } else {
      ctx.fillStyle = "#FF6A00";
      ctx.fillRect(-g.playerW / 2, -g.playerH / 2, g.playerW, g.playerH);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.strokeRect(-g.playerW / 2, -g.playerH / 2, g.playerW, g.playerH);
    }

    ctx.restore();
  }

  function drawHud(ctx: CanvasRenderingContext2D, g: GameData) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(`Score: ${g.score}`, 18, 34);

    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(`Coins: ${g.coinScore}`, 18, 62);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`Level: ${g.difficulty.toFixed(1)}`, CANVAS_W - 95, 34);
  }

  function tickGame(ctx: CanvasRenderingContext2D) {
    const g = gameData.current;
    if (!g.running) return;

    g.frame += 1;
    updateDifficulty(g);

    if (g.moveLeft) g.playerX -= PLAYER_SPEED;
    if (g.moveRight) g.playerX += PLAYER_SPEED;

    if (g.playerX < 12) g.playerX = 12;
    if (g.playerX + g.playerW > CANVAS_W - 12) g.playerX = CANVAS_W - g.playerW - 12;

    g.obstacleTimer += 1;
    g.coinTimer += 1;

    const obstacleInterval = Math.max(16, BASE_SPAWN_INTERVAL - Math.floor(g.difficulty * 2));
    const coinInterval = Math.max(42, BASE_COIN_INTERVAL - Math.floor(g.difficulty * 2));

    if (g.obstacleTimer >= obstacleInterval) {
      addObstacle(g);
      g.obstacleTimer = 0;
    }

    if (g.coinTimer >= coinInterval) {
      addCoin(g);
      g.coinTimer = 0;
    }

    g.obstacles.forEach((o) => {
      o.y += o.speed;
    });

    g.coins.forEach((c) => {
      c.y += c.speed;
    });

    g.obstacles = g.obstacles.filter((o) => o.y < CANVAS_H + 120);
    g.coins = g.coins.filter((c) => !c.collected && c.y < CANVAS_H + 40);

    if ((g.moveLeft || g.moveRight) && g.frame % 2 === 0) {
      addTrail(g);
    }

    updateParticles(g);

    const px = g.playerX + 10;
    const py = g.playerY + 8;
    const pw = g.playerW - 20;
    const ph = g.playerH - 12;

    for (const o of g.obstacles) {
      const inset = o.hitboxInset;
      const ox = o.x + inset;
      const oy = o.y + inset;
      const ow = o.w - inset * 2;
      const oh = o.h - inset * 2;

      if (rectsHit(px, py, pw, ph, ox, oy, ow, oh)) {
        finishGame(g.score);
        return;
      }
    }

    for (const c of g.coins) {
      if (!c.collected && coinHit(px, py, pw, ph, c.x, c.y, c.r)) {
        c.collected = true;
        g.coinScore += 1;
        setCoinsCollected(g.coinScore);
        g.score += 25;
        addCoinBurst(g, c.x, c.y);
      }
    }

    g.score += 1;
    setScore(g.score);

    drawBackground(ctx, g);

    g.coins.forEach((c, i) => {
      drawCoin(ctx, c, g.frame * 0.15 + i);
    });

    g.obstacles.forEach((o) => drawObstacle(ctx, o));

    drawParticles(ctx, g);
    drawPlayer(ctx, g);
    drawHud(ctx, g);

    animationRef.current = requestAnimationFrame(() => tickGame(ctx));
  }

  function loop() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    animationRef.current = requestAnimationFrame(() => tickGame(ctx));
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

  const topScores = leaderboard.slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="text-yellow-400 text-sm font-medium tracking-wider mb-3">
          BOX RUNNER
        </div>

        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
          Dodge, collect, survive
        </h1>

        <p className="text-zinc-400">
          Player: {playerName} • Score: {score} • Coins: {coinsCollected}
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
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
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
                width={CANVAS_W}
                height={CANVAS_H}
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

          <div className="bg-zinc-900 rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-5">Leaderboard</h2>

            {topScores.length === 0 ? (
              <div className="text-zinc-500">No scores yet.</div>
            ) : (
              <div className="space-y-3">
                {topScores.map((row, index) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between bg-zinc-800 rounded-2xl px-4 py-3"
                  >
                    <div>
                      <div className="text-white font-semibold">
                        #{index + 1} {row.player_name || "Player"}
                      </div>
                      <div className="text-zinc-500 text-xs">
                        {new Date(row.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-yellow-400 text-xl font-black">
                      {row.score}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 bg-zinc-800 rounded-2xl p-4 text-sm text-zinc-400">
              <div className="text-white font-semibold mb-2">Scoring</div>
              <div>• +1 per frame survived</div>
              <div>• +25 per coin</div>
              <div>• Difficulty increases over time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
