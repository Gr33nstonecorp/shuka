import Link from "next/link";
import "./globals.css";
import AuthGate from "./components/AuthGate";
import LogoutButton from "./components/LogoutButton";
import UserNav from "./components/UserNav";

export const metadata = {
  title: "Shuka",
  description: "AI procurement control layer",
};

const navLinkStyle = {
  color: "#e5e7eb",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
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
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: "#f8fafc",
          color: "#111827",
        }}
      >
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            padding: "16px 24px",
            background: "#111827",
            borderBottom: "1px solid #1f2937",
            display: "flex",
            gap: "18px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              marginRight: "18px",
              fontSize: "20px",
              fontWeight: 800,
              color: "white",
            }}
          >
            Shuka
          </div>

          <Link href="/" style={navLinkStyle}>
            Dashboard
          </Link>
          <Link href="/requests" style={navLinkStyle}>
            Requests
          </Link>
          <Link href="/quotes" style={navLinkStyle}>
            Quotes
          </Link>
          <Link href="/approvals" style={navLinkStyle}>
            Approvals
          </Link>
          <Link href="/orders" style={navLinkStyle}>
            Orders
          </Link>
          <Link href="/shipments" style={navLinkStyle}>
            Shipments
          </Link>
          <Link href="/vendors" style={navLinkStyle}>
            Vendors
          </Link>
          <Link href="/assistant" style={navLinkStyle}>
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

        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "24px",
          }}
        >
          <AuthGate>{children}</AuthGate>
        </div>
      </body>
    </html>
  );
}
