import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Shuka",
  description: "AI marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: "20px", background: "#eeeeee" }}>
          <Link href="/" style={{ marginRight: "20px" }}>Home</Link>
          <Link href="/buy" style={{ marginRight: "20px" }}>Buy</Link>
          <Link href="/sell" style={{ marginRight: "20px" }}>Sell</Link>
          <Link href="/wallet" style={{ marginRight: "20px" }}>Link Wallet</Link>
          <Link href="/chat">Chat</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}
import WalletContextProvider from "./providers/WalletProvider";
<body>
  <WalletContextProvider>
    {children}
  </WalletContextProvider>
</body>
