export default function VendorsPage() {
  const vendors = [
    {
      name: "Amazon Business",
      type: "Marketplace",
      integration: "Connected Target",
      categories: "General Supplies, PPE, Labels, Packaging",
      status: "Preferred",
    },
    {
      name: "Uline",
      type: "Direct Supplier",
      integration: "Manual / Planned API",
      categories: "Packaging, Shipping, Warehouse Supplies",
      status: "Approved",
    },
    {
      name: "Grainger",
      type: "Industrial Supplier",
      integration: "Manual / Planned PunchOut",
      categories: "Safety, Tools, Maintenance",
      status: "Approved",
    },
  ];

  return (
    <main style={{ padding: "32px" }}>
      <h1>Vendor Sources</h1>

      <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
        {vendors.map((vendor) => (
          <div
            key={vendor.name}
            style={{
              background: "white",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          >
            <strong>{vendor.name}</strong>
            <p>Type: {vendor.type}</p>
            <p>Integration: {vendor.integration}</p>
            <p>Categories: {vendor.categories}</p>
            <p>Status: {vendor.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
