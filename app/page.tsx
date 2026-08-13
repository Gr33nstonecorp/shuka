import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-300px] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[140px]" />
        <div className="absolute bottom-[-300px] right-[-200px] h-[500px] w-[500px] rounded-full bg-yellow-500/5 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-yellow-400 flex items-center justify-center text-black font-black">
              🌿
            </div>
            <span className="text-xl font-black tracking-tight">
              Yard<span className="text-yellow-400">ly</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link href="#how-it-works" className="hover:text-white transition">
              How it works
            </Link>
            <Link href="#why-us" className="hover:text-white transition">
              Why Yardly
            </Link>
            <Link href="/provider" className="hover:text-white transition">
              For landscapers
            </Link>
          </div>

          <Link
            href="/assistant"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-2.5 rounded-xl transition"
          >
            Get a quote
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 border border-yellow-400/20 bg-yellow-400/5 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold mb-7">
              <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
              LOCAL LANDSCAPERS • ON DEMAND
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
              Your yard.
              <br />
              <span className="text-yellow-400">Done right.</span>
            </h1>

            <p className="mt-7 text-lg md:text-xl text-zinc-400 leading-relaxed max-w-xl">
              Tell us what your outdoor space needs. Get competitive quotes
              from local landscaping pros and choose the one that works best
              for you.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                href="/assistant"
                className="group bg-yellow-400 hover:bg-yellow-300 text-black font-black text-lg px-8 py-4 rounded-2xl transition shadow-[0_0_40px_rgba(250,204,21,0.15)] flex items-center justify-center gap-2"
              >
                Get Free Quotes
                <span className="group-hover:translate-x-1 transition">
                  →
                </span>
              </Link>

              <Link
                href="/provider"
                className="border border-white/10 hover:border-yellow-400/40 hover:bg-white/5 text-white font-bold text-lg px-8 py-4 rounded-2xl transition flex items-center justify-center"
              >
                I'm a Landscaper
              </Link>
            </div>

            {/* Trust */}
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                No obligation
              </span>
              <span className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Local professionals
              </span>
              <span className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Compare quotes
              </span>
            </div>
          </div>

          {/* Right — Quote Preview */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[40px] bg-yellow-400/5 blur-3xl" />

            <div className="relative rounded-[32px] border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-5 shadow-2xl">
              {/* Fake App Header */}
              <div className="flex items-center justify-between px-3 py-3 mb-3">
                <div>
                  <p className="text-xs text-zinc-500">YOUR PROJECT</p>
                  <p className="font-bold">Front Yard Cleanup</p>
                </div>
                <div className="text-xs bg-green-400/10 text-green-400 px-3 py-1.5 rounded-full">
                  4 pros nearby
                </div>
              </div>

              {/* Job Card */}
              <div className="rounded-2xl bg-zinc-900 border border-white/5 p-5">
                <div className="flex gap-4">
                  <div className="h-14 w-14 rounded-xl bg-yellow-400/10 flex items-center justify-center text-2xl">
                    🌳
                  </div>

                  <div>
                    <h3 className="font-bold">Spring Yard Cleanup</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      Lawn • Leaves • Trimming
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-black/40 rounded-xl p-3">
                    <p className="text-xs text-zinc-600">SIZE</p>
                    <p className="font-semibold text-sm mt-1">~2,000 sq ft</p>
                  </div>
                  <div className="bg-black/40 rounded-xl p-3">
                    <p className="text-xs text-zinc-600">WHEN</p>
                    <p className="font-semibold text-sm mt-1">This weekend</p>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-3 rounded-2xl bg-zinc-900 border border-yellow-400/20 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center">
                        👨‍🌾
                      </div>
                      <div>
                        <p className="font-bold text-sm">GreenLine Landscaping</p>
                        <p className="text-xs text-zinc-500">
                          ★ 4.9 • 127 jobs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-zinc-500">QUOTE</p>
                    <p className="text-2xl font-black text-yellow-400">
                      $185
                    </p>
                  </div>
                </div>

                <button className="w-full mt-4 bg-yellow-400 text-black font-bold py-3 rounded-xl">
                  View Offer
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-5">
                <span className="h-1.5 w-6 rounded-full bg-yellow-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat value="Fast" label="Request to quotes" />
          <Stat value="Local" label="Professionals nearby" />
          <Stat value="Free" label="For homeowners" />
          <Stat value="3+" label="Quotes to compare" />
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="max-w-6xl mx-auto px-6 py-28"
      >
        <div className="max-w-2xl mb-14">
          <p className="text-yellow-400 font-bold text-sm uppercase tracking-widest">
            Simple by design
          </p>

          <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">
            From messy yard to
            <span className="text-yellow-400"> done.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Step
            number="01"
            icon="📝"
            title="Tell us what you need"
            text="Describe your project in plain English. Add photos, size, timing, and anything else that matters."
          />

          <Step
            number="02"
            icon="⚡"
            title="Pros compete for your job"
            text="Local landscapers receive your request and send you their best offer."
          />

          <Step
            number="03"
            icon="🤝"
            title="Pick your pro"
            text="Compare pricing, reviews, availability, and offers. Then book the landscaper you trust."
          />
        </div>
      </section>

      {/* CTA */}
      <section id="why-us" className="px-6 pb-24">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[36px] border border-yellow-400/20 bg-yellow-400 p-10 md:p-16 text-black">
          <div className="absolute right-[-100px] top-[-150px] h-[400px] w-[400px] rounded-full bg-white/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <p className="font-bold uppercase tracking-widest text-black/60 text-sm">
              Your next project starts here
            </p>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight mt-3 leading-tight">
              Stop searching.
              <br />
              Start getting quotes.
            </h2>

            <p className="text-black/70 text-lg mt-5 max-w-xl">
              Whether it's a simple mow or a complete backyard transformation,
              Yardly helps you find the right local pro.
            </p>

            <Link
              href="/assistant"
              className="inline-flex mt-8 bg-black text-white hover:bg-zinc-900 font-black px-8 py-4 rounded-2xl transition"
            >
              Describe My Project →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-yellow-400 flex items-center justify-center text-black text-sm">
              🌿
            </div>
            <span className="font-bold">
              Yard<span className="text-yellow-400">ly</span>
            </span>
          </div>

          <p className="text-sm text-zinc-600">
            Landscaping, simplified.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* Components */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-black text-white">{value}</p>
      <p className="text-xs md:text-sm text-zinc-500 mt-1">{label}</p>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group relative rounded-3xl border border-white/10 bg-zinc-950 p-7 hover:border-yellow-400/30 transition">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center text-2xl">
          {icon}
        </div>

        <span className="text-sm font-mono text-zinc-700">{number}</span>
      </div>

      <h3 className="text-xl font-bold mt-7">{title}</h3>

      <p className="text-zinc-500 leading-relaxed text-sm mt-3">{text}</p>
    </div>
  );
}
