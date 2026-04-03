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
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#f3f4f6",
          color: "#111827",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>{children}</div>

        <footer
          style={{
            borderTop: "1px solid #e5e7eb",
            background: "#ffffff",
            marginTop: "48px",
          }}
        >
          <div
            style={{
              maxWidth: "1180px",
              margin: "0 auto",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                color: "#111827",
              }}
            >
              ShukAI
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/terms"
                style={{
                  textDecoration: "none",
                  color: "#4b5563",
                  fontWeight: 600,
                }}
              >
                Terms
              </Link>

              <Link
                href="/privacy"
                style={{
                  textDecoration: "none",
                  color: "#4b5563",
                  fontWeight: 600,
                }}
              >
                Privacy
              </Link>

              <Link
                href="/msa"
                style={{
                  textDecoration: "none",
                  color: "#4b5563",
                  fontWeight: 600,
                }}
              >
                Agreement
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
