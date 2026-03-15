export default function ShipmentsPage() {
  const shipments = [
    {
      order: "PO-1003",
      vendor: "Grainger",
      tracking: "1Z94837X00023412",
      status: "In Transit",
      eta: "Tomorrow",
    },
    {
      order: "PO-1004",
      vendor: "Amazon Business",
      tracking: "TBA839483928",
      status: "Delivered",
      eta: "Arrived Today",
    },
  ];

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Shipments</h1>
      <p>Track vendor fulfillment and delivery progress after an order is placed.</p>

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
              <th style={{ padding: "12px" }}>Order</th>
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Tracking</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>ETA</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.order} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{shipment.order}</td>
                <td style={{ padding: "12px" }}>{shipment.vendor}</td>
                <td style={{ padding: "12px" }}>{shipment.tracking}</td>
                <td style={{ padding: "12px" }}>{shipment.status}</td>
                <td style={{ padding: "12px" }}>{shipment.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
