import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-32">
        
        {/* Top Hero Pill */}
        <div className="text-center">
          <div className="inline-block border border-yellow-400/20 bg-yellow-400/5 text-yellow-400 px-6 py-2 rounded-full text-xs md:text-sm mb-8 tracking-widest uppercase font-semibold">
            ✨ AI-Powered Vehicle Diagnostics
          </div>

          {/* Responsive Typography */}
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 mb-6 leading-none">
            Find a Mechanic <br />
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Based On Your Car's Needs
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Describe the problem with your car. Get local mechanics with fair pricing and quick quotes.
          </p>

          {/* Fixed Button Scale for Mobile & Desktop */}
          <Link
            href="/assistant"
            className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold text-lg md:text-xl px-8 py-4 md:px-12 md:py-5 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-400/20"
          >
            Start AI Vehicle Diagnostic
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Features Grid with Dark Borders */}
        <div className="mt-32 grid gap-6 md:grid-cols-3">
          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 text-2xl mb-6">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Quotes</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Get pricing estimates from local mechanics in seconds without the back-and-forth.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 text-2xl mb-6">
              📍
            </div>
            <h3 className="text-xl font-bold mb-2">Local Mechanics</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Find trusted, verified shops near you with transparent, community-driven reviews.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 text-2xl mb-6">
              📋
            </div>
            <h3 className="text-xl font-bold mb-2">Official Reports</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Download comprehensive professional repair reports for insurance claims or personal records.
            </p>
          </div>
        </div>

        {/* Brand Value Section (From your screenshot) */}
        <div className="mt-32 p-8 md:p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-400/5 blur-3xl rounded-full pointer-events-none"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Stop guessing what's wrong with your car.
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Our AI helps you understand the problem first, so you can make smarter, stress-free repair decisions.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-32 text-xs md:text-sm text-zinc-600 tracking-wide">
          © {new Date().getFullYear()} ShukAI — Making car repairs simple and fair.
        </div>
      </div>
    </div>
  );
}
