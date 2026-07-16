import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-24">
          <div className="inline-block border border-yellow-400/30 text-yellow-400 px-8 py-3 rounded-full text-sm mb-8 tracking-widest">
            AI POWERED VEHICLE DIAGNOSTICS
          </div>

          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-yellow-400 mb-10 leading-none">
            Find a Mechanic<br />Based On Your Car's Needs
          </h1>

          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">
            Describe the problem. Get local mechanics with fair pricing and quick quotes.
          </p>
        </div>

        <div className="text-center mb-32">
          <Link
            href="/assistant"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-3xl px-20 py-8 rounded-3xl transition active:scale-95 shadow-2xl"
          >
            Start AI Vehicle Diagnostic →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="bg-zinc-900 rounded-3xl p-12">
            <div className="text-7xl mb-8">⚡</div>
            <h3 className="text-3xl font-semibold mb-6">Instant Quotes</h3>
            <p className="text-zinc-400 text-lg">Get pricing estimates from local mechanics in seconds.</p>
          </div>
          <div className="bg-zinc-900 rounded-3xl p-12">
            <div className="text-7xl mb-8">📍</div>
            <h3 className="text-3xl font-semibold mb-6">Local Mechanics</h3>
            <p className="text-zinc-400 text-lg">Find trusted shops near you with real reviews.</p>
          </div>
          <div className="bg-zinc-900 rounded-3xl p-12">
            <div className="text-7xl mb-8">📋</div>
            <h3 className="text-3xl font-semibold mb-6">Official Reports</h3>
            <p className="text-zinc-400 text-lg">Download professional repair reports for insurance or records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
