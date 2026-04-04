{/* Top Navigation */}
<nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
    <Link href="/" className="font-bold text-2xl tracking-tighter hover:text-blue-600 transition">
      ShukAI
    </Link>

    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
      <Link href="/assistant" className="hover:text-blue-600 transition">AI Assistant</Link>
      <Link href="/requests" className="hover:text-blue-600 transition">Requests</Link>
      <Link href="/quotes" className="hover:text-blue-600 transition">Quotes</Link>
      <Link href="/orders" className="hover:text-blue-600 transition">Orders</Link>
      <Link href="/vendors" className="hover:text-blue-600 transition">Vendors</Link>
      <Link href="/saved-items" className="hover:text-blue-600 transition">Saved Items</Link>
    </div>

    <div className="flex items-center gap-4">
      <Link
        href="/pricing"
        className="px-6 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
      >
        Pricing
      </Link>
      <Link
        href="/login"
        className="px-6 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
      >
        Log in
      </Link>
      <Link
        href="/pricing"
        className="px-6 py-2 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-black transition"
      >
        Get Started
      </Link>
    </div>
  </div>
</nav>
