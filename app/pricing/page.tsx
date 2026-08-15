import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Simple pricing for landscapers
          </h1>
          <p className="text-xl text-zinc-400">
            Start free. Upgrade when you want more jobs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <div className="text-4xl font-black mb-6">
              $0<span className="text-lg text-zinc-400 font-normal">/mo</span>
            </div>

            <ul className="space-y-4 mb-10 text-zinc-300">
              <li className="flex gap-3"><span className="text-yellow-400">✓</span> Create provider profile</li>
              <li className="flex gap-3"><span className="text-yellow-400">✓</span> Receive limited job leads</li>
              <li className="flex gap-3"><span className="text-yellow-400">✓</span> Send quotes</li>
              <li className="flex gap-3 text-zinc-500"><span>○</span> Limited visibility</li>
            </ul>

            <Link
              href="/signup"
              className="block w-full text-center border border-zinc-700 hover:border-yellow-400 py-4 rounded-2xl font-semibold transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-zinc-900 border-2 border-yellow-400 rounded-3xl p-10 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-sm font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>

            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <div className="text-4xl font-black text-yellow-400 mb-1">
              $29<span className="text-lg text-zinc-400 font-normal">/mo</span>
            </div>
            <p className="text-zinc-400 text-sm mb-6">Cancel anytime</p>

            <ul className="space-y-4 mb-10 text-zinc-300">
              <li className="flex gap-3"><span className="text-yellow-400">✓</span> Everything in Free</li>
              <li className="flex gap-3"><span className="text-yellow-400">✓</span> <strong>Unlimited job leads</strong></li>
              <li className="flex gap-3"><span className="text-yellow-400">✓</span> Higher ranking in results</li>
              <li className="flex gap-3"><span className="text-yellow-400">✓</span> Priority notifications</li>
              <li className="flex gap-3"><span className="text-yellow-400">✓</span> Featured profile badge</li>
            </ul>

            <form action="/api/stripe/create-checkout-session" method="POST">
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-2xl transition"
              >
                Upgrade to Pro →
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-12">
          No long-term contracts. Cancel anytime.<br />
          Less than the cost of one lead on Angi or Thumbtack.
        </p>
      </div>
    </main>
  );
}
