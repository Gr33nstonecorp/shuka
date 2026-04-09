export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-semibold mb-6">
            Early Beta • AI Procurement
          </div>

          <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-8">
            AI that sources,<br />compares, and buys<br />for you.
          </h1>

          <p className="text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12">
            Stop wasting hours searching vendors. Tell ShukAI what you need — it finds the best options instantly.
          </p>

          {/* AI Demo Input on Homepage */}
          <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12">
            <div className="text-sm font-semibold text-zinc-500 mb-4">Try it now (demo)</div>
            <input
              type="text"
              placeholder="50 nitrile gloves, 20 packing tape..."
              className="w-full p-6 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-lg focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  alert("In real version: AI would now search vendors and show results.");
                }
              }}
            />
            <button 
              onClick={() => alert("In real version: This would trigger the AI Assistant with your query.")}
              className="mt-6 w-full py-4 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl transition"
            >
              Let AI Find Vendors
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/assistant" className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-black transition">
              Open AI Assistant
            </a>
            <a href="/pricing" className="px-10 py-4 border border-zinc-300 dark:border-zinc-700 rounded-2xl font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
              See Pricing
            </a>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white dark:bg-zinc-900 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">How ShukAI Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="text-5xl mb-6">1️⃣</div>
              <h3 className="font-semibold text-xl mb-3">Tell the AI</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Describe what you need to buy</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-6">2️⃣</div>
              <h3 className="font-semibold text-xl mb-3">AI Sources</h3>
              <p className="text-zinc-600 dark:text-zinc-400">It finds vendors, compares prices, and gives best options</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-6">3️⃣</div>
              <h3 className="font-semibold text-xl mb-3">Approve & Buy</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Review quotes and place orders in one click</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto">
          <p className="text-xl mb-8">Ready to let AI handle your procurement?</p>
          <a href="/assistant" className="inline-block px-12 py-5 bg-zinc-900 text-white text-lg font-semibold rounded-3xl hover:bg-black">
            Start Sourcing Now
          </a>
        </div>
      </div>
    </main>
  );
}
