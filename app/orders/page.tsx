export default function OrdersPage() {
  const orders = [
    {
      po: "PO-1001",
      vendor: "Amazon Business",
      items: 3,
      total: "$210.00",
      status: "Awaiting Approval",
      shipment: "Not Shipped",
    },
    {
      po: "PO-1002",
      vendor: "Uline",
      items: 2,
      total: "$480.00",
      status: "Approved",
      shipment: "Preparing Shipment",
    },
    {
      po: "PO-1003",
      vendor: "Grainger",
      items: 5,
      total: "$1,120.00",
      status: "Ordered",
      shipment: "In Transit",
    },
    {
      po: "PO-1004",
      vendor: "Amazon Business",
      items: 1,
      total: "$85.00",
      status: "Delivered",
      shipment: "Completed",
    },
  ];

  function getStatusColor(status: string) {
    if (status === "Awaiting Approval") return "#b45309";
    if (status === "Approved") return "#2563eb";
    if (status === "Ordered") return "#9333ea";
    if (status === "Delivered") return "#166534";
    return "#444";
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Purchase Orders</h1>
      <p>
        Track procurement orders created by Shuka and monitor vendor fulfillment.
      </p>

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
              <th style={{ padding: "12px" }}>PO Number</th>
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Items</th>
              <th style={{ padding: "12px" }}>Total</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Shipment</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.po} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{order.po}</td>
                <td style={{ padding: "12px" }}>{order.vendor}</td>
                <td style={{ padding: "12px" }}>{order.items}</td>
                <td style={{ padding: "12px" }}>{order.total}</td>

                <td
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    color: getStatusColor(order.status),
                  }}
                >
                  {order.status}
                </td>

                <td style={{ padding: "12px" }}>{order.shipment}</td>

                <td style={{ padding: "12px" }}>
                  {order.status === "Awaiting Approval" && (
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
        <h2 style={{ marginTop: 0 }}>AI Procurement Note</h2>
        <p style={{ marginBottom: 0 }}>
          The AI assistant has generated two new reorder drafts based on inventory
          thresholds. Review and approve them before submission to vendors.
        </p>
      </div>
    </main>
  );
}
