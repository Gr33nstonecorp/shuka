import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-24 relative">
        {/* Hero */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-8 py-3 rounded-full text-sm mb-8">
            🚗 AI POWERED CAR REPAIR
          </div>

          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none mb-8 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Your Car Broke?<br />We Got You.
          </h1>

          <p className="text-2xl text-zinc-400 max-w-2xl mx-auto">
            Tell us what's wrong. Get local mechanics with real quotes and incentives in seconds.
          </p>
        </div>

        {/* Big CTA */}
        <div className="text-center mb-32">
          <Link
            href="/assistant"
            className="group inline-flex items-center gap-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-3xl px-20 py-8 rounded-3xl transition-all active:scale-95 shadow-2xl hover:shadow-yellow-400/50"
          >
            Start AI Vehicle Diagnostic
            <span className="text-4xl group-hover:rotate-12 transition">🚀</span>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/80 backdrop-blur rounded-3xl p-10 border border-zinc-800 hover:border-yellow-400/50 transition">
            <div className="text-6xl mb-8">⚡</div>
            <h3 className="text-3xl font-bold mb-4">Instant Quotes</h3>
            <p className="text-zinc-400">Mechanics bid with pricing and special offers.</p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur rounded-3xl p-10 border border-zinc-800 hover:border-yellow-400/50 transition">
            <div className="text-6xl mb-8">📍</div>
            <h3 className="text-3xl font-bold mb-4">Local Shops</h3>
            <p className="text-zinc-400">Real mechanics near you with verified reviews.</p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur rounded-3xl p-10 border border-zinc-800 hover:border-yellow-400/50 transition">
            <div className="text-6xl mb-8">📋</div>
            <h3 className="text-3xl font-bold mb-4">Repair Reports</h3>
            <p className="text-zinc-400">Professional reports for insurance or records.</p>
          </div>
        </div>

        <div className="text-center mt-24 text-sm text-zinc-500">
          ShukAI — Making car repairs simple and fair.
        </div>
      </div>
    </div>
  );
}
