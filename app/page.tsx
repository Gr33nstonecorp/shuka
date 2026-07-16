import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero */}
      <section className="relative pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-black pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 px-8 py-3 rounded-full text-sm font-semibold tracking-widest mb-8">
            ⚡ AI POWERED VEHICLE DIAGNOSTICS
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-10">
            Find a Mechanic<br />Based On Your Car's Needs
          </h1>

          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto mb-16">
            Describe the problem with your car. Get local mechanics with fair pricing and quick quotes.
          </p>

          <Link
            href="/assistant"
            className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-3xl px-20 py-8 rounded-3xl transition-all active:scale-95 shadow-2xl"
          >
            Start AI Vehicle Diagnostic →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 rounded-3xl p-12 hover:border-yellow-400/50 border border-zinc-800 transition">
            <div className="text-7xl mb-8">⚡</div>
            <h3 className="text-3xl font-bold mb-4">Instant Quotes</h3>
            <p className="text-zinc-400">Get pricing estimates from local mechanics in seconds.</p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-12 hover:border-yellow-400/50 border border-zinc-800 transition">
            <div className="text-7xl mb-8">📍</div>
            <h3 className="text-3xl font-bold mb-4">Local Mechanics</h3>
            <p className="text-zinc-400">Find trusted shops near you with real reviews.</p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-12 hover:border-yellow-400/50 border border-zinc-800 transition">
            <div className="text-7xl mb-8">📋</div>
            <h3 className="text-3xl font-bold mb-4">Official Reports</h3>
            <p className="text-zinc-400">Download professional repair reports for insurance or records.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-zinc-800 bg-zinc-950 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-8">
            Stop guessing what's wrong with your car.
          </h2>
          <p className="text-2xl text-zinc-400">
            Our AI helps you understand the problem first, so you can make smarter repair decisions.
          </p>
        </div>
      </section>
    </main>
  );
}
