import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-24">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-3 rounded-full text-sm mb-8 font-bold tracking-widest">
            AI POWERED CAR REPAIR
          </div>

          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none mb-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Find a Mechanic<br />Based On Your Car's Needs
          </h1>

          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">
            Describe the problem with your car. Get local mechanics with fair pricing and quick quotes.
          </p>
        </div>

        <div className="text-center mb-32">
          <Link
            href="/assistant"
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black font-bold text-3xl px-20 py-8 rounded-3xl transition active:scale-95 shadow-2xl"
          >
            Start AI Vehicle Diagnostic →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-12 border border-yellow-400/20">
            <div className="text-7xl mb-8">⚡</div>
            <h3 className="text-3xl font-bold mb-4">Instant Quotes</h3>
            <p className="text-zinc-400">Get pricing estimates from local mechanics in seconds.</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-12 border border-yellow-400/20">
            <div className="text-7xl mb-8">📍</div>
            <h3 className="text-3xl font-bold mb-4">Local Mechanics</h3>
            <p className="text-zinc-400">Find trusted shops near you with real reviews.</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-12 border border-yellow-400/20">
            <div className="text-7xl mb-8">📋</div>
            <h3 className="text-3xl font-bold mb-4">Official Reports</h3>
            <p className="text-zinc-400">Download professional repair reports for insurance or records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
