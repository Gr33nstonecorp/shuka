import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Shuka 🚀</h1>
      <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
        <Link href="/buy">Buy</Link>
        <Link href="/sell">Sell</Link>
        <Link href="/chat">Chat</Link>
        <Link href="/wallet">Wallet</Link>
      </div>
    </main>
  );
}
