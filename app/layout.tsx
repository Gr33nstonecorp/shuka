import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "ShukAI",
  description: "AI procurement platform for modern teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* Clean Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="font-bold text-xl tracking-tighter">ShukAI</div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Link 
                  href="/terms" 
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  Terms
                </Link>
                <Link 
                  href="/privacy" 
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/msa" 
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  User Agreement
                </Link>
                <Link 
                  href="/pricing" 
                  className="hover:text-zinc-900 dark:hover:text-white transition font-medium text-blue-600"
                >
                  Support Us
                </Link>
              </div>

              <div className="text-xs text-zinc-500 text-center md:text-right">
                © {new Date().getFullYear()} ShukAI. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
