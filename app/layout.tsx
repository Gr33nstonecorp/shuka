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
              </
