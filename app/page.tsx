import Link from "next/link";

export default function Home() {
  const tabs = [
    { name: "Buy", href: "/buy" },
    { name: "Sell", href: "/sell" },
    { name: "Link Wallet", href: "/wallet" },
    { name: "Chat", href: "/chat" },
  ];

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>Shuka 🚀</h1>
      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        AI marketplace home page
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: "12px 20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              textDecoration: "none",
              color: "black",
              fontWeight: "bold",
            }}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
