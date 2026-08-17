import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import "./globals.css";

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
      <body className="bg-[#050807] text-white antialiased">

        {/* MAIN NAVIGATION */}
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050807]/90 backdrop-blur-xl">

          {/* TOP NAV */}
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-xl shadow-lg shadow-green-500/20">
                🌿
              </div>

              <span className="text-2xl font-black tracking-tight">
                Shuk<span className="text-yellow-400">AI</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden items-center gap-8 md:flex">

              <Link
                href="/assistant"
                className="text-sm font-semibold text-zinc-300 transition hover:text-white"
              >
                Get Quotes
              </Link>

              {/* NEW AI REDESIGN LINK */}
              <Link
                href="/redesign"
                className="text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
              >
                ✨ AI Redesign
              </Link>

              <Link
                href="/profile"
                className="text-sm font-semibold text-zinc-300 transition hover:text-white"
              >
                My Jobs
              </Link>

              <Link
                href="/provider"
                className="text-sm font-semibold text-zinc-300 transition hover:text-white"
              >
                For Landscapers
              </Link>

            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">

              {session && (
                <Link
                  href="/profile"
                  className="hidden rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-green-400/30 hover:text-white sm:block"
                >
                  My Account
                </Link>
              )}

              {!session && (
                <Link
                  href="/login"
                  className="hidden text-sm font-semibold text-zinc-300 transition hover:text-white sm:block"
                >
                  Log In
                </Link>
              )}

              <Link
                href="/assistant"
                className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20"
              >
                Get a Quote
              </Link>

            </div>
          </div>

          {/* MOBILE NAV */}
          <div className="border-t border-white/5 md:hidden">

            <div className="mx-auto grid max-w-7xl grid-cols-4 items-center px-3 py-3">

              <Link
                href="/assistant"
                className="text-center text-[11px] font-bold text-zinc-400 transition hover:text-yellow-400"
              >
                Quotes
              </Link>

              <Link
                href="/redesign"
                className="text-center text-[11px] font-bold text-yellow-400 transition hover:text-yellow-300"
              >
                ✨ Redesign
              </Link>

              <Link
                href="/profile"
                className="text-center text-[11px] font-bold text-zinc-400 transition hover:text-yellow-400"
              >
                My Jobs
              </Link>

              <Link
                href="/provider"
                className="text-center text-[11px] font-bold text-zinc-400 transition hover:text-yellow-400"
              >
                Landscapers
              </Link>

            </div>

          </div>
        </nav>

        {children}

      </body>
    </html>
  );
}
