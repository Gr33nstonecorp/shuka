export default function BuyPage() {
  const tools = [
    {
      name: "Shuka Writer AI",
      description: "AI agent for writing ads, emails, and product pages.",
      price: "$19/mo",
    },
    {
      name: "Flight Tutor AI",
      description: "Study assistant for pilot training and checkride prep.",
      price: "$29/mo",
    },
    {
      name: "Crypto Research AI",
      description: "Analyze tokens, trends, and market narratives faster.",
      price: "$39/mo",
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
            key={tool.name}
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
            <button
              style={{
                marginTop: "10px",
                padding: "10px 16px",
                background: "#111",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              View Tool
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
