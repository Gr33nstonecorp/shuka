import "./globals.css";
import AuthGate from "./components/AuthGate";
import AppNavbar from "./components/AppNavbar";

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
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: "#f8fafc",
          color: "#111827",
        }}
      >
        <AppNavbar />

        <div
          style={{
            maxWidth: "1400px",
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
