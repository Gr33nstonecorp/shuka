import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050505] text-white antialiased">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="h-9 w-9 rounded-xl bg-yellow-400 flex items-center justify-center text-black text-lg shadow-[0_0_20px_rgba(250,204,21,0.12)]">
                🌿
              </div>

              <span className="text-xl font-black tracking-tight">
                Shuk<span className="text-yellow-400">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
              <Link
                href="/assistant"
                className="hover:text-white transition"
              >
                Get Quotes
              </Link>

              <Link
                href="/profile"
                className="hover:text-white transition"
              >
                My Jobs
              </Link>

              <Link
                href="/provider"
                className="hover:text-white transition"
              >
                For Landscapers
              </Link>
            </div>

            {/* Account */}
            <div className="flex items-center gap-3">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    className="hidden sm:flex items-center gap-2 border border-white/10 hover:border-yellow-400/30 bg-white/[0.03] hover:bg-white/[0.06] px-4 py-2.5 rounded-xl transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="text-sm font-semibold">
                      My Account
                    </span>
                  </Link>

                  <Link
                    href="/logout"
                    className="text-sm text-zinc-500 hover:text-red-400 transition"
                  >
                    Log Out
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block text-sm font-semibold text-zinc-400 hover:text-white transition"
                  >
                    Log In
                  </Link>

                  <Link
                    href="/assistant"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-[0_0_25px_rgba(250,204,21,0.1)]"
                  >
                    Get a Quote
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-xs font-semibold text-zinc-500">
              <Link
                href="/assistant"
                className="hover:text-yellow-400 transition"
              >
                Get Quotes
              </Link>

              <Link
                href="/profile"
                className="hover:text-yellow-400 transition"
              >
                My Jobs
              </Link>

              <Link
                href="/provider"
                className="hover:text-yellow-400 transition"
              >
                Landscapers
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
