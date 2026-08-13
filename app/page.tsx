import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-block border border-yellow-400/40 text-yellow-400 px-5 py-2 rounded-full text-sm font-semibold mb-8">
          🌿 UBER EATS FOR LANDSCAPING
        </div>

        <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
          Need landscaping done?
          <br />
          <span className="text-yellow-400">Get local pros in minutes.</span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
          Describe your yard, lawn, or outdoor project. Get quotes from verified local landscapers — fast, transparent, and fair.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/assistant"
            className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-lg px-10 py-4 rounded-2xl transition"
          >
            Get Free Quotes →
          </Link>
          <Link
            href="/provider"
            className="w-full sm:w-auto border border-zinc-700 hover:border-yellow-400 text-white font-semibold text-lg px-10 py-4 rounded-2xl transition"
          >
            I’m a Landscaper
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-3">Describe Your Job</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tell us what you need — mowing, cleanup, tree work, hardscaping, or full redesign.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-3">Local Pros Bid</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Nearby landscapers see your request and send transparent quotes with incentives.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-3">Book & Get It Done</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Choose the best offer and schedule the work. Simple, fast, and fair.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
