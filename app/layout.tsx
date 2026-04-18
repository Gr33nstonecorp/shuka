import "./globals.css";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const metadata = {
  title: "ShukAI",
  description: "AI procurement platform for modern teams",
};

// Force fresh rendering to break cache
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
        
        {/* Bold Black + Yellow Navigation - Tabs forced visible */}
        <nav className="bg-black border-b-4 border-yellow-400 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
            
            <Link href="/assistant" className="font-black text-3xl tracking-tighter text-yellow-400">
              SHUKAI
            </Link>

            {/* Tabs - Always visible */}
            <div className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-widest">
              <Link href="/assistant" className="hover:text-yellow-400 transition">AI Assistant</Link>
              <Link href="/requests" className="hover:text-yellow-400 transition">Requests</Link>
              <Link href="/quotes" className="hover:text-yellow-400 transition">Quotes</Link>
              <Link href="/orders" className="hover:text-yellow-400 transition">Orders</Link>
              <Link href="/vendors" className="hover:text-yellow-400 transition">Vendors</Link>
              <Link href="/saved-items" className="hover:text-yellow-400 transition">Saved Items</Link>
            </div>

            {/* Login / Logout */}
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

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-black border-t-4 border-yellow-400 mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm">
              <div className="font-black text-2xl text-yellow-400">SHUKAI</div>
              <div className="flex flex-wrap gap-x-10 gap-y-4 text-zinc-400">
                <Link href="/terms" className="hover:text-yellow-400 transition">Terms</Link>
                <Link href="/privacy" className="hover:text-yellow-400 transition">Privacy</Link>
                <Link href="/msa" className="hover:text-yellow-400 transition">Agreement</Link>
                <Link href="/pricing" className="hover:text-yellow-400 transition font-medium">Support Us</Link>
              </div>
              <div className="text-xs text-zinc-500">
                © {new Date().getFullYear()} ShukAI
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
