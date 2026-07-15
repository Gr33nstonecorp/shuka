import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-24">
          <div className="inline-block border border-yellow-400/40 text-yellow-400 px-8 py-3 rounded-full text-sm mb-8">
            AI POWERED VEHICLE DIAGNOSTICS
          </div>

          <h1 className="text-7xl font-black tracking-tighter text-yellow-400 mb-8">
            Find a Mechanic Based On Your Car's Needs
          </h1>

          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">
            Describe the problem with your car. Get local mechanics with fair pricing and quick quotes.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/assistant"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-2xl px-16 py-8 rounded-3xl transition"
          >
            AI Vehicle Diagnostic →
          </Link>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-10 text-center">
          <div className="bg-zinc-900 rounded-3xl p-10">
            <div className="text-6xl mb-6">🔧</div>
            <h3 className="text-2xl font-semibold mb-4">Instant Quotes</h3>
            <p className="text-zinc-400">Get pricing estimates from local mechanics in seconds.</p>
          </div>
          <div className="bg-zinc-900 rounded-3xl p-10">
            <div className="text-6xl mb-6">📍</div>
            <h3 className="text-2xl font-semibold mb-4">Local Mechanics</h3>
            <p className="text-zinc-400">Find trusted shops near you with real reviews.</p>
          </div>
          <div className="bg-zinc-900 rounded-3xl p-10">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-semibold mb-4">Official Reports</h3>
            <p className="text-zinc-400">Download professional repair reports for insurance or records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
