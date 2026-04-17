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
      <body className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <nav className="border-b bg-white dark:bg-zinc-900 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-2xl tracking-tighter">ShukAI</Link>
            <div className="flex gap-8 text-sm font-medium">
              <Link href="/assistant" className="hover:text-blue-600">AI Assistant</Link>
              <Link href="/requests" className="hover:text-blue-600">Requests</Link>
              <Link href="/quotes" className="hover:text-blue-600">Quotes</Link>
              <Link href="/orders" className="hover:text-blue-600">Orders</Link>
              <Link href="/vendors" className="hover:text-blue-600">Vendors</Link>
              <Link href="/saved-items" className="hover:text-blue-600">Saved Items</Link>
            </div>
            <Link href="/pricing" className="text-blue-600 font-medium">Pricing</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
