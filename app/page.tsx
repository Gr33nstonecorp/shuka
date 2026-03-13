import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Shuka",
  description: "AI Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 40px",
            background: "#111",
            color: "white",
          }}
        >
          <h2 style={{ margin: 0 }}>Shuka</h2>

          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/" style={{ color: "white" }}>Home</Link>
            <Link href="/buy" style={{ color: "white" }}>Buy</Link>
            <Link href="/sell" style={{ color: "white" }}>Sell</Link>
            <Link href="/wallet" style={{ color: "white" }}>Wallet</Link>
            <Link href="/chat" style={{ color: "white" }}>Chat</Link>
          </div>
        </nav>

        {children}

      </body>
    </html>
  );
}
