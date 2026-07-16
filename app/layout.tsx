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
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white">
        <nav className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="text-3xl font-black text-yellow-400">ShukAI</Link>

            <div className="flex items-center gap-8 text-sm font-medium">
              <Link href="/assistant" className="hover:text-yellow-400 transition">AI Diagnostic</Link>
              <Link href="/profile" className="hover:text-yellow-400 transition">Profile</Link>

              {session ? (
                <Link href="/logout" className="text-red-400 hover:text-red-500 transition">Log Out</Link>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-full font-semibold transition"
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
