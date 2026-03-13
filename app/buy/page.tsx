import Link from "next/link";

export default function BuyPage() {
  const tools = [
    {
      name: "Shuka Writer AI",
      description: "AI agent for writing ads, emails, and product pages.",
      price: "$19/mo",
      slug: "writer-ai",
    },
    {
      name: "Flight Tutor AI",
      description: "Study assistant for pilot training and checkride prep.",
      price: "$29/mo",
      slug: "flight-tutor",
    },
    {
      name: "Crypto Research AI",
      description: "Analyze tokens, trends, and market narratives faster.",
      price: "$39/mo",
      slug: "crypto-research",
    },
  ];

  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>Buy AI Tools</h1>
      <p style={{ marginBottom: "30px", fontSize: "18px" }}>
        Explore AI tools built by the community.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {tools.map((tool) => (
          <div
            key={tool.slug}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              background: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{tool.name}</h2>
            <p>{tool.description}</p>
            <p style={{ fontWeight: "bold" }}>{tool.price}</p>

            <Link
              href="/wallet"
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "10px 16px",
                background: "#111",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Buy with Phantom
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
