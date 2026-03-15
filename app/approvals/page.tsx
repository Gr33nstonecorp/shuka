export default function ApprovalsPage() {
  const approvals = [
    {
      request: "REQ-2001",
      item: "Barcode Labels",
      vendor: "Amazon Business",
      amount: "$810.00",
      reason: "Low stock and preferred supplier",
      status: "Pending",
    },
    {
      request: "REQ-2002",
      item: "Packing Tape",
      vendor: "Uline",
      amount: "$210.00",
      reason: "Packaging replenishment",
      status: "Pending",
    },
  ];

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Approvals</h1>
      <p>Human review step before AI-submitted purchases are sent to external vendors.</p>

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
              <th style={{ padding: "12px" }}>Request</th>
              <th style={{ padding: "12px" }}>Item</th>
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Amount</th>
              <th style={{ padding: "12px" }}>Reason</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((approval) => (
              <tr key={approval.request} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{approval.request}</td>
                <td style={{ padding: "12px" }}>{approval.item}</td>
                <td style={{ padding: "12px" }}>{approval.vendor}</td>
                <td style={{ padding: "12px" }}>{approval.amount}</td>
                <td style={{ padding: "12px" }}>{approval.reason}</td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
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
                      Approve
                    </button>
                    <button
                      style={{
                        padding: "8px 14px",
                        background: "#b91c1c",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
