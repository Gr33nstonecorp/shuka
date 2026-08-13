import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050807] text-white">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[140px]" />
        <div className="absolute right-[-200px] top-[500px] h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[140px]" />
      </div>

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:pb-28 lg:pt-24">

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">

          {/* Left */}
          <div>

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/5 px-4 py-2 text-xs font-bold tracking-wide text-yellow-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              LOCAL LANDSCAPERS • ON DEMAND
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-5xl font-black leading-[.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Your yard.
              <br />
              <span className="text-yellow-400">Done right.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
              Tell us what your outdoor space needs. Get competitive quotes
              from local landscaping pros and choose the one that works best
              for you.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/assistant"
                className="group flex items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-7 py-4 text-lg font-black text-black shadow-[0_15px_50px_rgba(250,204,21,.12)] transition hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                Get Free Quotes
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/provider"
                className="flex items-center justify-center rounded-2xl border border-white/20 bg-white/[0.02] px-7 py-4 text-lg font-bold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                I'm a Landscaper
              </Link>

            </div>

            {/* Trust */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400">

              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-xs text-green-400">
                  ✓
                </span>
                No obligation
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-xs text-green-400">
                  ✓
                </span>
                Local professionals
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-xs text-green-400">
                  ✓
                </span>
                Compare quotes
              </div>

            </div>
          </div>

          {/* Right graphic */}
          <div className="relative">

            {/* Glow */}
            <div className="absolute inset-0 rounded-[40px] bg-green-400/10 blur-3xl" />

            {/* Landscape image */}
            <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-zinc-900 shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=85"
                alt="Beautiful landscaped yard"
                className="h-[520px] w-full object-cover"
              />

              {/* Dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

              {/* Floating card */}
              <div className="absolute bottom-6 left-5 right-5 rounded-2xl border border-white/10 bg-black/70 p-5 shadow-2xl backdrop-blur-xl sm:left-7 sm:right-7">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-green-400">
                      Your Project
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      Front Yard Cleanup
                    </h3>

                    <p className="mt-1 text-sm text-zinc-400">
                      Lawn • Leaves • Trimming
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-zinc-500">
                      PROS NEARBY
                    </p>

                    <p className="mt-1 text-2xl font-black text-yellow-400">
                      4
                    </p>
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-400/10">
                    🌳
                  </span>

                  <span>
                    Getting competitive quotes...
                  </span>

                  <span className="ml-auto flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400 [animation-delay:300ms]" />
                  </span>
                </div>

              </div>
            </div>

            {/* Floating quote */}
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-green-400/20 bg-[#101513]/95 p-4 shadow-2xl backdrop-blur-xl sm:block lg:-left-10">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-400/15 text-xl">
                  👨‍🌾
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Local pro found
                  </p>

                  <p className="text-xs text-zinc-500">
                    ★ 4.9 • 127 completed jobs
                  </p>
                </div>

                <div className="ml-4 text-right">
                  <p className="text-xs text-zinc-500">
                    FROM
                  </p>

                  <p className="text-lg font-black text-yellow-400">
                    $185
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROJECT PREVIEW */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">

          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-400">
                See how it works
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Your project, simplified.
              </h2>
            </div>

            <Link
              href="/assistant"
              className="hidden font-bold text-yellow-400 hover:text-yellow-300 sm:block"
            >
              Start a project →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <ProjectCard
              icon="🌳"
              number="01"
              title="Describe your job"
              text="Tell ShukAI what you want done."
            />

            <ProjectCard
              icon="⚡"
              number="02"
              title="Pros send offers"
              text="Local landscapers compete for your project."
            />

            <ProjectCard
              icon="✓"
              number="03"
              title="Choose your pro"
              text="Compare offers and book the right one."
            />

          </div>
        </div>
      </section>

      {/* BIG CTA */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[35px] bg-yellow-400 px-7 py-14 text-black sm:px-12 lg:px-16">

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/20 blur-3xl" />

          <div className="relative max-w-2xl">

            <p className="text-sm font-black uppercase tracking-widest text-black/50">
              Landscaping without the hassle
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Stop searching.
              <br />
              Start getting quotes.
            </h2>

            <p className="mt-5 max-w-xl text-lg text-black/70">
              From a simple lawn mow to a complete backyard transformation,
              ShukAI connects you with local landscaping professionals.
            </p>

            <Link
              href="/assistant"
              className="mt-8 inline-flex rounded-2xl bg-black px-7 py-4 font-black text-white transition hover:bg-zinc-900"
            >
              Describe My Project →
            </Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">

          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="font-black">
              Shuk<span className="text-yellow-400">AI</span>
            </span>
          </div>

          <p className="text-sm text-zinc-600">
            Local landscaping. Simplified.
          </p>

        </div>
      </footer>

    </main>
  );
}


/* Project Card */

function ProjectCard({
  icon,
  number,
  title,
  text,
}: {
  icon: string;
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-[#0b0f0d] p-6 transition hover:-translate-y-1 hover:border-green-400/30">

      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-400/10 text-2xl">
          {icon}
        </div>

        <span className="font-mono text-xs text-zinc-600">
          {number}
        </span>

      </div>

      <h3 className="mt-7 text-xl font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
        {text}
      </p>

    </div>
  );
}
