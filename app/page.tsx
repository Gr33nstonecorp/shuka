import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center">
          <div className="inline-block border border-yellow-400/30 text-yellow-400 px-8 py-3 rounded-full text-sm mb-8 tracking-widest">
            AI POWERED VEHICLE DIAGNOSTICS
          </div>

          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-yellow-400 mb-12 leading-none">
            Find a Mechanic Based On Your Car's Needs
          </h1>

          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto mb-16">
            Describe the problem with your car. Get local mechanics with fair pricing and quick quotes.
          </p>

          <Link
            href="/assistant"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-3xl px-20 py-8 rounded-3xl transition active:scale-95"
          >
            AI Vehicle Diagnostic →
          </Link>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-7xl mb-8">⚡</div>
            <h3 className="text-3xl font-bold mb-4">Instant Quotes</h3>
            <p className="text-zinc-400">Get pricing estimates from local mechanics in seconds.</p>
          </div>
          <div>
            <div className="text-7xl mb-8">📍</div>
            <h3 className="text-3xl font-bold mb-4">Local Mechanics</h3>
            <p className="text-zinc-400">Find trusted shops near you with real reviews.</p>
          </div>
          <div>
            <div className="text-7xl mb-8">📋</div>
            <h3 className="text-3xl font-bold mb-4">Official Reports</h3>
            <p className="text-zinc-400">Download professional repair reports for insurance or records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
