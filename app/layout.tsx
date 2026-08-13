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
      <body className="bg-black text-white">
        {/* Top Navigation */}
        <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-black text-yellow-400">
              ShukAI
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium">
              <Link href="/assistant" className="hover:text-yellow-400 transition">
                Get Quotes
              </Link>
              <Link href="/profile" className="hover:text-yellow-400 transition">
                My Jobs
              </Link>
              <Link href="/provider" className="hover:text-yellow-400 transition">
                For Landscapers
              </Link>

              {session ? (
                <Link
                  href="/logout"
                  className="text-red-400 hover:text-red-500 transition"
                >
                  Log Out
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2 rounded-full font-semibold transition"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
