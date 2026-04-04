import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ShukAI - AI Procurement Platform",
  description: "AI that finds better vendors and quotes faster for modern teams.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-bold text-2xl tracking-tighter hover:text-blue-600 transition">
              ShukAI
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="hover:text-blue-600 transition">Home</Link>
              <Link href="/requests" className="hover:text-blue-600 transition">Requests</Link>
              <Link href="/quotes" className="hover:text-blue-600 transition">Quotes</Link>
              <Link href="/orders" className="hover:text-blue-600 transition">Orders</Link>
              <Link href="/vendors" className="hover:text-blue-600 transition">Vendors</Link>
              <Link href="/assistant" className="hover:text-blue-600 transition">AI Assistant</Link>
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

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="font-bold text-xl">ShukAI</div>

              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white transition">Pricing</Link>
                <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white transition">Terms</Link>
                <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition">Privacy</Link>
                <Link href="/assistant" className="hover:text-zinc-900 dark:hover:text-white transition">AI Assistant</Link>
              </div>

              <div className="text-sm text-zinc-500">
                © {new Date().getFullYear()} ShukAI. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
