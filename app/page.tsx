export default function DashboardPage() {
  const cards = [
    { title: "Low Stock Items", value: "12", note: "Needs review" },
    { title: "Pending Reorders", value: "5", note: "Awaiting approval" },
    { title: "Open Purchase Orders", value: "8", note: "In progress" },
    { title: "Vendors Active", value: "14", note: "Approved suppliers" },
  ];

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0, fontSize: "36px" }}>Warehouse Dashboard</h1>
      <p style={{ fontSize: "18px", color: "#444" }}>
        AI-powered purchasing and inventory control for warehouses and stock rooms.
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
          Reorder packing tape, nitrile gloves, and barcode labels within 48 hours based on low stock thresholds.
        </p>
      </div>
    </main>
  );
}
