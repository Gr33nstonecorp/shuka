import Link from "next/link";
import "./globals.css";
import AuthGate from "./components/AuthGate";
import LogoutButton from "./components/LogoutButton";
import UserNav from "./components/UserNav";

export const metadata = {
  title: "Shuka",
  description: "AI procurement control layer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "#f5f5f5",
        }}
      >
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
          <strong style={{ marginRight: "16px", fontSize: "18px" }}>
            Shuka
          </strong>

          <Link href="/" style={{ color: "white", textDecoration: "none" }}>
            Dashboard
          </Link>
          <Link href="/requests" style={{ color: "white", textDecoration: "none" }}>
            Requests
          </Link>
          <Link href="/quotes" style={{ color: "white", textDecoration: "none" }}>
            Quotes
          </Link>
          <Link href="/approvals" style={{ color: "white", textDecoration: "none" }}>
            Approvals
          </Link>
          <Link href="/orders" style={{ color: "white", textDecoration: "none" }}>
            Orders
          </Link>
          <Link href="/shipments" style={{ color: "white", textDecoration: "none" }}>
            Shipments
          </Link>
          <Link href="/vendors" style={{ color: "white", textDecoration: "none" }}>
            Vendor Sources
          </Link>
          <Link href="/assistant" style={{ color: "white", textDecoration: "none" }}>
            AI Assistant
          </Link>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <UserNav />
            <LogoutButton />
          </div>
        </nav>

        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <AuthGate>{children}</AuthGate>
        </div>
      </body>
    </html>
  );
}
