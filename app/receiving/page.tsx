export default function ReceivingPage() {
  const shipments = [
    {
      po: "PO-1003",
      vendor: "Grainger",
      items: "Safety Gloves, Tool Kit",
      tracking: "1Z94837X00023412",
      status: "In Transit",
      eta: "Tomorrow",
    },
    {
      po: "PO-1002",
      vendor: "Uline",
      items: "Packing Tape, Stretch Wrap",
      tracking: "940551120255524939",
      status: "Delivered",
      eta: "Arrived Today",
    },
    {
      po: "PO-1001",
      vendor: "Amazon Business",
      items: "Barcode Labels",
      tracking: "TBA839483928",
      status: "Delivered",
      eta: "Arrived Today",
    },
  ];

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Receiving</h1>
      <p>Confirm deliveries and update warehouse inventory.</p>

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
            <tr style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>PO</th>
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Items</th>
              <th style={{ padding: "12px" }}>Tracking</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>ETA</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.po} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>
                  {shipment.po}
                </td>
                <td style={{ padding: "12px" }}>{shipment.vendor}</td>
                <td style={{ padding: "12px" }}>{shipment.items}</td>
                <td style={{ padding: "12px" }}>{shipment.tracking}</td>
                <td style={{ padding: "12px" }}>{shipment.status}</td>
                <td style={{ padding: "12px" }}>{shipment.eta}</td>

                <td style={{ padding: "12px" }}>
                  {shipment.status === "Delivered" ? (
                    <button
                      style={{
                        padding: "8px 14px",
                        background: "#166534",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Confirm Received
                    </button>
                  ) : (
                    <span style={{ color: "#555" }}>Waiting</span>
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
          border: "1px solid #ddd",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>AI Receiving Assistant</h2>
        <p style={{ marginBottom: 0 }}>
          Two shipments arrived today. Confirm receipt to update warehouse
          inventory automatically.
        </p>
      </div>
    </main>
  );
}
