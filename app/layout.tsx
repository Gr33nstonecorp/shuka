import "./globals.css";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const metadata = {
  title: "ShukAI",
  description: "AI procurement platform for modern teams",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white flex flex-col">
        
        {/* Black + Yellow Navigation */}
        <nav className="bg-black border-b-4 border-yellow-400 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
            
            <Link href="/assistant" className="font-black text-3xl tracking-tighter text-yellow-400">
              SHUKAI
            </Link>

            {/* Tabs - Simple and always visible on desktop */}
            <div className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-widest">
              <Link href="/assistant" className="hover:text-yellow-400 transition">AI Assistant</Link>
              <Link href="/requests" className="hover:text-yellow-400 transition">Requests</Link>
              <Link href="/quotes" className="hover:text-yellow-400 transition">Quotes</Link>
              <Link href="/orders" className="hover:text-yellow-400 transition">Orders</Link>
              <Link href="/vendors" className="hover:text-yellow-400 transition">Vendors</Link>
              <Link href="/saved-items" className="hover:text-yellow-400 transition">Saved Items</Link>
            </div>

            {/* Auth */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs px-4 py-2 bg-yellow-400 text-black font-medium rounded-full">
                    {user.email}
                  </span>
                  <form action="/auth/signout" method="post">
                    <button 
                      type="submit"
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition"
                    >
                      Log out
                    </button>
                  </form>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="px-6 py-2 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-medium rounded-xl transition"
                >
                  Log in
                </Link>
              )}

              <Link 
                href="/pricing" 
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition"
              >
                Support Us
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-black border-t-4 border-yellow-400 mt-auto py-12">
          <div className="max-w-6xl mx-auto px-6 text-center md:text-left">
            <div className="font-black text-2xl text-yellow-400 mb-4">SHUKAI</div>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-sm text-zinc-400">
              <Link href="/terms" className="hover:text-yellow-400">Terms</Link>
              <Link href="/privacy" className="hover:text-yellow-400">Privacy</Link>
              <Link href="/msa" className="hover:text-yellow-400">Agreement</Link>
              <Link href="/pricing" className="hover:text-yellow-400 font-medium">Support Us</Link>
            </div>
            <div className="text-xs text-zinc-500 mt-8">
              © {new Date().getFullYear()} ShukAI
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
