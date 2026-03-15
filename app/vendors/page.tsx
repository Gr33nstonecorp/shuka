export default function VendorsPage() {
  const vendors = [
    {
      name: "Amazon Business",
      type: "Marketplace",
      categories: "General Supplies, Packaging, Labels, PPE",
      leadTime: "1-3 days",
      rating: "9.5/10",
      approved: "Yes",
      integration: "Amazon Business API",
      paymentTerms: "Net 30",
      status: "Primary Procurement Channel",
    },
    {
      name: "Uline",
      type: "Direct Supplier",
      categories: "Packaging, Warehouse Supplies, Shipping Materials",
      leadTime: "2-5 days",
      rating: "9.0/10",
      approved: "Yes",
      integration: "Manual / Future API",
      paymentTerms: "Net 30",
      status: "Approved",
    },
    {
      name: "Grainger",
      type: "Industrial Supplier",
      categories: "Safety, Tools, Maintenance, PPE",
      leadTime: "2-4 days",
      rating: "8.8/10",
      approved: "Yes",
      integration: "Manual / PunchOut Later",
      paymentTerms: "Net 45",
      status: "Approved",
    },
    {
      name: "Staples Business",
      type: "Office & Warehouse Supplier",
      categories: "Labels, Office Supplies, Shipping Accessories",
      leadTime: "2-4 days",
      rating: "8.3/10",
      approved: "Pending",
      integration: "Manual",
      paymentTerms: "Net 15",
      status: "Under Review",
    },
  ];

  function getStatusColor(status: string) {
    if (status === "Primary Procurement Channel") return "#1d4ed8";
    if (status === "Approved") return "#166534";
    if (status === "Under Review") return "#b45309";
    return "#444";
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Vendors</h1>
      <p>
        Manage approved suppliers, integration methods, lead times, and purchasing terms.
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
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Type</th>
              <th style={{ padding: "12px" }}>Categories</th>
              <th style={{ padding: "12px" }}>Lead Time</th>
              <th style={{ padding: "12px" }}>Rating</th>
              <th style={{ padding: "12px" }}>Approved</th>
              <th style={{ padding: "12px" }}>Integration</th>
              <th style={{ padding: "12px" }}>Payment Terms</th>
              <th style={{ padding: "12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.name} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{vendor.name}</td>
                <td style={{ padding: "12px" }}>{vendor.type}</td>
                <td style={{ padding: "12px" }}>{vendor.categories}</td>
                <td style={{ padding: "12px" }}>{vendor.leadTime}</td>
                <td style={{ padding: "12px" }}>{vendor.rating}</td>
                <td style={{ padding: "12px" }}>{vendor.approved}</td>
                <td style={{ padding: "12px" }}>{vendor.integration}</td>
                <td style={{ padding: "12px" }}>{vendor.paymentTerms}</td>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    color: getStatusColor(vendor.status),
                  }}
                >
                  {vendor.status}
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
        <h2 style={{ marginTop: 0 }}>AI Vendor Policy</h2>
        <p style={{ marginBottom: "12px" }}>
          Shuka may recommend purchases only from approved vendors. Amazon Business is the
          preferred procurement source for general supplies and consumables.
        </p>
        <p style={{ marginBottom: 0 }}>
          Orders above approval thresholds must be reviewed by a human before submission.
        </p>
      </div>
    </main>
  );
}
