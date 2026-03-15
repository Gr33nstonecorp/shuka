export default function VendorsPage() {
  const vendors = [
    {
      name: "Amazon Business",
      type: "Marketplace",
      integration: "API",
      categories: "General Supplies, PPE, Labels, Packaging",
      status: "Connected",
      role: "Primary Sourcing Channel",
    },
    {
      name: "Uline",
      type: "Direct Supplier",
      integration: "Manual / Future API",
      categories: "Packaging, Shipping, Warehouse Supplies",
      status: "Approved",
      role: "Packaging Supplier",
    },
    {
      name: "Grainger",
      type: "Industrial Supplier",
      integration: "Manual / PunchOut Later",
      categories: "Safety, Tools, Maintenance",
      status: "Approved",
      role: "Industrial Supplier",
    },
    {
      name: "Shopify Vendor Network",
      type: "Commerce Platform",
      integration: "Planned",
      categories: "Specialty Vendors",
      status: "Planned",
      role: "Future Vendor Expansion",
    },
  ];

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Vendor Sources</h1>
      <p>Connected supplier channels the AI can use to source products and compare offers.</p>

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
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Type</th>
              <th style={{ padding: "12px" }}>Integration</th>
              <th style={{ padding: "12px" }}>Categories</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.name} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{vendor.name}</td>
                <td style={{ padding: "12px" }}>{vendor.type}</td>
                <td style={{ padding: "12px" }}>{vendor.integration}</td>
                <td style={{ padding: "12px" }}>{vendor.categories}</td>
                <td style={{ padding: "12px" }}>{vendor.status}</td>
                <td style={{ padding: "12px" }}>{vendor.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
