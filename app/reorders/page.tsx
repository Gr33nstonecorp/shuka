import { inventoryItems } from "../data/mockData";

function calculateReorders() {
  return inventoryItems
    .filter((item) => item.quantity <= item.reorderPoint)
    .map((item) => {
      const suggestedQty = item.reorderPoint * 2 - item.quantity;

      return {
        name: item.name,
        vendor: item.vendor,
        current: item.quantity,
        reorderPoint: item.reorderPoint,
        suggested: suggestedQty,
      };
    });
}

export default function ReordersPage() {
  const reorders = calculateReorders();

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Reorder Suggestions</h1>
      <p>
        Shuka AI monitors inventory levels and recommends replenishment orders
        when stock drops below thresholds.
      </p>

      <div
        style={{
          marginTop: "24px",
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid #ddd",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Item</th>
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Current Qty</th>
              <th style={{ padding: "12px" }}>Reorder Point</th>
              <th style={{ padding: "12px" }}>Suggested Order</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {reorders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "16px" }}>
                  No reorder suggestions at this time.
                </td>
              </tr>
            )}

            {reorders.map((item) => (
              <tr key={item.name} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>
                  {item.name}
                </td>
                <td style={{ padding: "12px" }}>{item.vendor}</td>
                <td style={{ padding: "12px" }}>{item.current}</td>
                <td style={{ padding: "12px" }}>{item.reorderPoint}</td>
                <td style={{ padding: "12px" }}>{item.suggested}</td>

                <td style={{ padding: "12px" }}>
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
                    Draft PO
                  </button>
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
          border: "1px solid #ddd",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>AI Procurement Insight</h2>
        <p style={{ marginBottom: 0 }}>
          Reorder quantities are calculated automatically based on reorder
          points and current inventory levels. Purchase orders can be drafted
          for approval before sending to vendors.
        </p>
      </div>
    </main>
  );
}
