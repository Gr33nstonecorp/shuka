import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 via-transparent to-black pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">

          <div className="inline-flex items-center gap-2 border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 px-6 py-3 rounded-full text-sm font-semibold tracking-widest mb-8">
            ⚡ AI POWERED VEHICLE DIAGNOSTICS
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-8">
            Your Car Problem.
            <br />
            <span className="text-yellow-400">
              Diagnosed Instantly.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12">
            Tell our AI what's wrong with your vehicle. Get possible causes,
            repair estimates, and nearby mechanics who can fix it.
          </p>

          <Link
            href="/assistant"
            className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl md:text-2xl px-12 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-400/20"
          >
            Start AI Diagnosis →
          </Link>

          <p className="text-sm text-zinc-500 mt-6">
            No guessing. No unnecessary repairs. Just answers.
          </p>
        </div>
      </section>


      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">

          <Feature
            icon="🔧"
            title="Smart Diagnosis"
            text="Describe symptoms and get AI-powered explanations before visiting a shop."
          />

          <Feature
            icon="📍"
            title="Find Mechanics"
            text="Match with local repair shops based on your vehicle and repair needs."
          />

          <Feature
            icon="💰"
            title="Fair Pricing"
            text="Understand expected costs before approving expensive repairs."
          />

        </div>
      </section>


      {/* Trust Section */}
      <section className="border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stop guessing what's wrong with your car.
          </h2>

          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Our AI helps you understand your vehicle problem first, so you can
            make smarter repair decisions.
          </p>

        </div>
      </section>

    </main>
  );
}


function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-yellow-400/50 transition">
      <div className="text-5xl mb-6">{icon}</div>

      <h3 className="text-2xl font-bold mb-3">
        {title}
      </h3>

      <p className="text-zinc-400 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
