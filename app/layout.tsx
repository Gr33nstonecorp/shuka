import Link from "next/link";
import "./globals.css";
import ShukaPhantomProvider from "./providers/PhantomProvider";

export const metadata = {
  title: "Shuka",
  description: "AI purchasing and inventory assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f5f5f5" }}>
        <ShukaPhantomProvider>
          <nav
            style={{
              padding: "18px 24px",
              background: "#1f2937",
              color: "white",
              display: "flex",
              gap: "20px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <strong style={{ marginRight: "16px" }}>Shuka</strong>

            <Link href="/" style={{ color: "white", textDecoration: "none" }}>
              Dashboard
            </Link>
            <Link href="/inventory" style={{ color: "white", textDecoration: "none" }}>
              Inventory
            </Link>
            <Link href="/reorders" style={{ color: "white", textDecoration: "none" }}>
              Reorders
            </Link>
            <Link href="/vendors" style={{ color: "white", textDecoration: "none" }}>
              Vendors
            </Link>
            <Link href="/orders" style={{ color: "white", textDecoration: "none" }}>
              Orders
            </Link>
            <Link href="/receiving" style={{ color: "white", textDecoration: "none" }}>
              Receiving
            </Link>
            <Link href="/assistant" style={{ color: "white", textDecoration: "none" }}>
              AI Assistant
            </Link>
            <Link href="/wallet" style={{ color: "white", textDecoration: "none" }}>
              Wallet
            </Link>
          </nav>

          {children}
        </ShukaPhantomProvider>
      </body>
    </html>
  );
}
