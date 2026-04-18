import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "ShukAI",
  description: "AI procurement platform for modern teams",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
        <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link
              href="/"
              className="font-bold text-2xl tracking-tighter hover:text-blue-600 transition"
            >
              ShukAI
            </Link>

            <div className="hidden md:flex gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <Link href="/assistant" className="hover:text-zinc-900 dark:hover:text-white transition">
                AI Assistant
              </Link>
              <Link href="/requests" className="hover:text-zinc-900 dark:hover:text-white transition">
                Requests
              </Link>
              <Link href="/quotes" className="hover:text-zinc-900 dark:hover:text-white transition">
                Quotes
              </Link>
              <Link href="/orders" className="hover:text-zinc-900 dark:hover:text-white transition">
                Orders
              </Link>
              <Link href="/vendors" className="hover:text-zinc-900 dark:hover:text-white transition">
                Vendors
              </Link>
              <Link href="/saved-items" className="hover:text-zinc-900 dark:hover:text-white transition">
                Saved Items
              </Link>
              <Link href="/arcade" className="text-yellow-500 font-semibold hover:text-yellow-400 transition">
                Arcade
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/arcade"
                className="md:hidden text-sm font-semibold text-yellow-500 hover:text-yellow-400 transition"
              >
                Arcade
              </Link>

              <Link
                href="/pricing"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              >
                Support Us
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="font-bold text-xl tracking-tighter">ShukAI</div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Privacy Policy
                </Link>
                <Link href="/msa" className="hover:text-zinc-900 dark:hover:text-white transition">
                  User Agreement
                </Link>
                <Link href="/arcade" className="hover:text-zinc-900 dark:hover:text-white transition text-yellow-500 font-medium">
                  Arcade
                </Link>
                <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white transition font-medium text-blue-600">
                  Support Us
                </Link>
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
