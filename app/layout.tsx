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
  description: "AI-powered marketplace for modern procurement. Manage requests, compare quotes, track orders, and work with suppliers in one place.",
  keywords: ["procurement", "AI marketplace", "quotes", "inventory", "supply chain"],
  authors: [{ name: "Gr33nstonecorp" }],
  openGraph: {
    title: "ShukAI - AI Procurement Platform",
    description: "Modern AI-powered platform for requests, quotes, orders, and vendor management.",
    images: [{ url: "/og-image.jpg" }], // Add an image to public/ later
    url: "https://shuka-theta.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
        {/* Optional: Add a top navbar here later */}
        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-bold text-xl tracking-tight">ShukAI</div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/msa" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Master Service Agreement
              </Link>
            </div>

            <div className="text-sm text-zinc-500 dark:text-zinc-500">
              © {new Date().getFullYear()} ShukAI. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
