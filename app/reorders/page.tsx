export default function ReordersPage() {
  const reorders = [
    {
      item: "Packing Tape",
      sku: "PT-223",
      currentQty: 12,
      reorderPoint: 25,
      suggestedQty: 50,
      vendor: "Uline",
      estimatedCost: "$210.00",
      priority: "High",
      status: "Awaiting Approval",
    },
    {
      item: "Barcode Labels",
      sku: "LB-992",
      currentQty: 5,
      reorderPoint: 50,
      suggestedQty: 100,
      vendor: "Amazon Business",
      estimatedCost: "$810.00",
      priority: "Critical",
      status: "Awaiting Approval",
    },
    {
      item: "Nitrile Gloves",
      sku: "GL-884",
      currentQty: 310,
      reorderPoint: 200,
      suggestedQty: 0,
      vendor: "Grainger",
      estimatedCost: "$0.00",
      priority: "Normal",
      status: "No Action Needed",
    },
  ];

  function getPriorityColor(priority: string) {
    if (priority === "Critical") return "#b91c1c";
    if (priority === "High") return "#d97706";
    return "#166534";
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Reorders</h1>
      <p>AI-generated reorder recommendations based on stock thresholds.</p>

      <div
        style={{
          marginTop: "24px",
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid #ddd",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th style={{ padding: "12px" }}>Item</th>
              <th style={{ padding: "12px" }}>SKU</th>
              <th style={{ padding: "12px" }}>Current Qty</th>
              <th style={{ padding: "12px" }}>Reorder Point</th>
              <th style={{ padding: "12px" }}>Suggested Qty</th>
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Estimated Cost</th>
              <th style={{ padding: "12px" }}>Priority</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reorders.map((order) => (
              <tr key={order.sku} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{order.item}</td>
                <td style={{ padding: "12px" }}>{order.sku}</td>
                <td style={{ padding: "12px" }}>{order.currentQty}</td>
                <td style={{ padding: "12px" }}>{order.reorderPoint}</td>
                <td style={{ padding: "12px" }}>{order.suggestedQty}</td>
                <td style={{ padding: "12px" }}>{order.vendor}</td>
                <td style={{ padding: "12px" }}>{order.estimatedCost}</td>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    color: getPriorityColor(order.priority),
                  }}
                >
                  {order.priority}
                </td>
                <td style={{ padding: "12px" }}>{order.status}</td>
                <td style={{ padding: "12px" }}>
                  {order.suggestedQty > 0 ? (
                    <button
                      style={{
                        padding: "8px 14px",
                        background: "#111827",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </button>
                  ) : (
                    <span style={{ color: "#666" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "24px",
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginTop: 0 }}>AI Recommendation Summary</h2>
        <p style={{ marginBottom: 0 }}>
          Approve immediate reorder for Barcode Labels and Packing Tape. No reorder
          needed for Nitrile Gloves at this time.
        </p>
      </div>
    </main>
  );
}
