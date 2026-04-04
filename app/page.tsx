{/* Hero */}
<div className="pt-24 pb-20 px-6">
  <div className="max-w-4xl mx-auto text-center">
    <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-5 py-2 mb-8">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm font-medium">Early Beta • 7-Day Free Trial</span>
    </div>

    <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-8">
      AI that finds<br />better vendors,<br />faster.
    </h1>

    <p className="text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12">
      ShukAI helps procurement teams source products, compare quotes, and manage requests — all in one place.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {isLoggedIn ? (
        <Link
          href="/assistant"
          className="px-10 py-4 bg-zinc-900 hover:bg-black text-white text-lg font-semibold rounded-2xl transition"
        >
          Open AI Assistant
        </Link>
      ) : (
        <Link
          href="/pricing"
          className="px-10 py-4 bg-zinc-900 hover:bg-black text-white text-lg font-semibold rounded-2xl transition"
        >
          Start 7-Day Free Trial
        </Link>
      )}

      <Link
        href="/pricing"
        className="px-10 py-4 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-lg font-semibold rounded-2xl transition"
      >
        See Pricing
      </Link>
    </div>

    <p className="text-sm text-zinc-500 mt-6">
      No charge today • Cancel anytime before billing starts
    </p>
  </div>
</div>
