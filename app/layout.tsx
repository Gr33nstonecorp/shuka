import "./globals.css";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const metadata = {
  title: "ShukAI",
  description: "AI procurement platform for modern teams",
};

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
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
        
        {/* Persistent Navigation – Tabs ALWAYS visible */}
        <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            
            <Link href="/assistant" className="font-bold text-2xl tracking-tighter hover:text-blue-600 transition">
              ShukAI
            </Link>

            {/* Main Tabs – Always shown */}
            <div className="hidden md:flex gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <Link href="/assistant" className="hover:text-zinc-900 dark:hover:text-white transition">AI Assistant</Link>
              <Link href="/requests" className="hover:text-zinc-900 dark:hover:text-white transition">Requests</Link>
              <Link href="/quotes" className="hover:text-zinc-900 dark:hover:text-white transition">Quotes</Link>
              <Link href="/orders" className="hover:text-zinc-900 dark:hover:text-white transition">Orders</Link>
              <Link href="/vendors" className="hover:text-zinc-900 dark:hover:text-white transition">Vendors</Link>
              <Link href="/saved-items" className="hover:text-zinc-900 dark:hover:text-white transition">Saved Items</Link>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                    {user.email}
                  </span>
                  <form action="/auth/signout" method="post">
                    <button 
                      type="submit"
                      className="px-5 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition font-medium"
                    >
                      Log out
                    </button>
                  </form>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="px-5 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium"
                >
                  Log in
                </Link>
              )}

              <Link 
                href="/pricing" 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
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
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="font-bold text-xl tracking-tighter">ShukAI</div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white transition">Terms</Link>
                <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition">Privacy Policy</Link>
                <Link href="/msa" className="hover:text-zinc-900 dark:hover:text-white transition">User Agreement</Link>
                <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white transition font-medium text-blue-600">Support Us</Link>
              </div>

              <div className="text-xs text-zinc-500">
                © {new Date().getFullYear()} ShukAI. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
