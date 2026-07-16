import Link from "next/link";
import { Inter } from "next/font/google";
import { createClient } from "@supabase/supabase-js";
import "./globals.css"; // 👈 CRITICAL: This is what makes your Tailwind styles work!

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata = {
  title: "ShukAI | Find a Mechanic Based On Your Car's Needs",
  description: "AI-Powered Vehicle Diagnostics. Describe your car problem, get local mechanics, and quick quotes.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white min-h-screen`}>
        {/* Modern Sticky Nav with Backdrop Blur */}
        <nav className="border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            
            {/* Logo */}
            <Link 
              href="/" 
              className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 tracking-tight"
            >
              ShukAI
            </Link>

            {/* Nav Links - Responsive Gaps & Font Sizes */}
            <div className="flex items-center gap-4 md:gap-8 text-xs md:text-sm font-medium">
              <Link 
                href="/assistant" 
                className="text-zinc-300 hover:text-yellow-400 transition-colors"
              >
                AI Diagnostic
              </Link>
              <Link 
                href="/profile" 
                className="text-zinc-300 hover:text-yellow-400 transition-colors"
              >
                Profile
              </Link>

              {session ? (
                <Link 
                  href="/logout" 
                  className="text-red-400 hover:text-red-500 transition-colors"
                >
                  Log Out
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold transition-all duration-200 text-xs md:text-sm shadow-md shadow-yellow-400/10 active:scale-95"
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
