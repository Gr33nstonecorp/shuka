function DucklingFollow({ onBack }: { onBack: () => void }) {
  const [duckY, setDuckY] = useState(220);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<{ x: number; gapY: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const GAME_HEIGHT = 500;
  const DUCK_SIZE = 50;

  useEffect(() => {
    if (gameOver) return;

    const gravity = setInterval(() => {
      setVelocity(v => v + 0.6);

      setDuckY(y => {
        const next = y + velocity;

        if (next > GAME_HEIGHT - DUCK_SIZE || next < 0) {
          setGameOver(true);
        }

        return next;
      });

      setPipes(prev =>
        prev
          .map(pipe => ({ ...pipe, x: pipe.x - 4 }))
          .filter(pipe => pipe.x > -80)
      );

      if (Math.random() < 0.025) {
        setPipes(prev => [
          ...prev,
          {
            x: 100,
            gapY: 100 + Math.random() * 220,
          },
        ]);
      }

      pipes.forEach(pipe => {
        const withinX = pipe.x < 35 && pipe.x > -35;

        const hitTop = duckY < pipe.gapY - 70;
        const hitBottom = duckY > pipe.gapY + 70;

        if (withinX && (hitTop || hitBottom)) {
          setGameOver(true);
        }

        if (pipe.x === 30) {
          setScore(s => s + 1);
        }
      });
    }, 20);

    return () => clearInterval(gravity);
  }, [duckY, velocity, pipes, gameOver]);

  const flap = () => {
    if (gameOver) return;
    setVelocity(-8);
  };

  const reset = () => {
    setDuckY(220);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="bg-zinc-900 rounded-3xl p-8 max-w-md mx-auto">
      <button onClick={onBack} className="mb-6 text-yellow-400">
        ← Back
      </button>

      <h2 className="text-4xl font-black text-yellow-400 text-center mb-6">
        Duckling Follow
      </h2>

      <div className="text-center text-2xl mb-4">
        Score: {score}
      </div>

      <div
        onClick={flap}
        className="relative h-[500px] overflow-hidden rounded-3xl border-4 border-yellow-400/30 bg-gradient-to-b from-sky-400 to-emerald-700"
      >
        {/* Mama Duck */}
        <div className="absolute left-6 top-8 text-7xl">
          🦆
        </div>

        {/* Duck */}
        <div
          className="absolute text-6xl transition-transform"
          style={{
            left: "30px",
            top: `${duckY}px`,
            transform: `rotate(${velocity * 2}deg)`,
          }}
        >
          🐥
        </div>

        {/* Pipes */}
        {pipes.map((pipe, i) => (
          <div key={i}>
            <div
              className="absolute w-20 bg-emerald-950 border-4 border-emerald-700"
              style={{
                left: `${pipe.x}%`,
                top: 0,
                height: `${pipe.gapY - 70}px`,
              }}
            />

            <div
              className="absolute w-20 bg-emerald-950 border-4 border-emerald-700"
              style={{
                left: `${pipe.x}%`,
                top: `${pipe.gapY + 70}px`,
                height: `${500 - pipe.gapY}px`,
              }}
            />
          </div>
        ))}

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <h2 className="text-5xl font-black text-yellow-400 mb-6">
              GAME OVER
            </h2>

            <p className="text-3xl mb-8">
              Score: {score}
            </p>

            <button
              onClick={reset}
              className="bg-yellow-400 text-black px-10 py-4 rounded-2xl text-xl font-bold"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <button
        onClick={flap}
        className="w-full mt-6 py-6 bg-yellow-400 text-black rounded-3xl text-2xl font-black"
      >
        TAP TO FLAP 🪶
      </button>
    </div>
  );
}
