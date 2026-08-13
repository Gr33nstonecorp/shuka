import Link from "next/link";

export default function ProviderPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block border border-yellow-400/40 text-yellow-400 px-5 py-2 rounded-full text-sm font-semibold mb-6">
            FOR LANDSCAPERS
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Get more landscaping jobs
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Homeowners post jobs near you. You send quotes. Simple, fast, and designed for local landscapers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-lg px-10 py-4 rounded-2xl transition"
            >
              Provider Login
            </Link>
            <Link
              href="/signup"
              className="border border-zinc-700 hover:border-yellow-400 text-white font-semibold text-lg px-10 py-4 rounded-2xl transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-3xl mb-4">1</div>
            <h3 className="text-xl font-bold mb-2">Create your profile</h3>
            <p className="text-zinc-400 text-sm">
              Add your services, service area, and pricing range.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-3xl mb-4">2</div>
            <h3 className="text-xl font-bold mb-2">Get job requests</h3>
            <p className="text-zinc-400 text-sm">
              Receive notifications when homeowners near you need work.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-3xl mb-4">3</div>
            <h3 className="text-xl font-bold mb-2">Send quotes & win jobs</h3>
            <p className="text-zinc-400 text-sm">
              Respond fast, offer incentives, and grow your business.
            </p>
          </div>
        </div>

        {/* Monetization CTA */}
        <div className="bg-zinc-900 border border-yellow-400/30 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Go Pro — Get more leads</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Free accounts can receive limited jobs. Upgrade to Pro to appear higher in results and get unlimited leads.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="text-4xl font-black text-yellow-400">$29<span className="text-lg text-zinc-400">/mo</span></div>
            <Link
              href="/pricing"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-xl transition"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
