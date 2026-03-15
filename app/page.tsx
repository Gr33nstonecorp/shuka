export default function DashboardPage() {
  const cards = [
    { title: "Open Requests", value: "7", note: "Awaiting sourcing" },
    { title: "Quotes Ready", value: "4", note: "AI compared vendor offers" },
    { title: "Pending Approvals", value: "3", note: "Needs manager review" },
    { title: "Orders In Progress", value: "5", note: "Submitted to vendors" },
  ];

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0, fontSize: "36px" }}>Procurement Command Center</h1>
      <p style={{ fontSize: "18px", color: "#444" }}>
        Shuka helps AI agents source products, compare vendors, and manage company purchasing approvals.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              border: "1px solid #ddd",
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: "18px" }}>{card.title}</h2>
            <div style={{ fontSize: "34px", fontWeight: "bold", margin: "10px 0" }}>
              {card.value}
            </div>
            <p style={{ marginBottom: 0, color: "#666" }}>{card.note}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "30px",
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginTop: 0 }}>AI Recommendation</h2>
        <p style={{ marginBottom: 0 }}>
          Three requests are ready for vendor comparison. Amazon Business is preferred for general consumables, while Uline remains competitive for packaging materials.
        </p>
      </div>
    </main>
  );
}
