import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 via-transparent to-black pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 px-6 py-2.5 rounded-full text-sm font-semibold tracking-widest mb-8">
            🌿 UBER EATS FOR LANDSCAPING
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-8">
            Need landscaping done?
            <br />
            <span className="text-yellow-400">Get local pros in minutes.</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12">
            Describe your yard, lawn, or outdoor project. Get quotes from verified
            local landscapers — fast, transparent, and fair.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assistant"
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xl px-12 py-5 rounded-2xl transition-all hover:scale-105 active:scale-95"
            >
              Get Free Quotes →
            </Link>
            <Link
              href="/provider"
              className="inline-flex items-center justify-center border border-zinc-700 hover:border-yellow-400 text-white font-semibold text-xl px-12 py-5 rounded-2xl transition"
            >
              I’m a Landscaper
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 hover:border-yellow-400/40 transition">
            <div className="text-5xl mb-6">📝</div>
            <h3 className="text-2xl font-bold mb-3">Describe Your Job</h3>
            <p className="text-zinc-400 leading-relaxed">
              Tell us what you need — mowing, cleanup, tree work, hardscaping, or full redesign.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 hover:border-yellow-400/40 transition">
            <div className="text-5xl mb-6">📍</div>
            <h3 className="text-2xl font-bold mb-3">Local Pros Bid</h3>
            <p className="text-zinc-400 leading-relaxed">
              Nearby landscapers see your request and send transparent quotes with incentives.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 hover:border-yellow-400/40 transition">
            <div className="text-5xl mb-6">✅</div>
            <h3 className="text-2xl font-bold mb-3">Book & Get It Done</h3>
            <p className="text-zinc-400 leading-relaxed">
              Choose the best offer and schedule the work. Simple, fast, and fair.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-
