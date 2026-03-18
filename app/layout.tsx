import "./globals.css";
import AuthGate from "./components/AuthGate";
import EnsureProfile from "./components/EnsureProfile";
import AppNavbar from "./components/AppNavbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppNavbar />

        <AuthGate>
          <EnsureProfile />
          {children}
        </AuthGate>
      </body>
    </html>
  );
}
