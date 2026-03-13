import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: "20px", background: "#eee" }}>
          <Link href="/" style={{ marginRight: 20 }}>Home</Link>
          <Link href="/buy" style={{ marginRight: 20 }}>Buy</Link>
          <Link href="/sell" style={{ marginRight: 20 }}>Sell</Link>
          <Link href="/wallet" style={{ marginRight: 20 }}>Link Wallet</Link>
          <Link href="/chat">Chat</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}
