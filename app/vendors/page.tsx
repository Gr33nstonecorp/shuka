export default function VendorsPage() {
  const vendors = [
    {
      name: "Amazon Business",
      type: "Marketplace",
      integration: "Search Redirect",
      categories: "General supplies, PPE, labels, packaging",
      status: "Preferred",
    },
    {
      name: "Uline",
      type: "Direct Supplier",
      integration: "Search Redirect",
      categories: "Packaging, shipping, warehouse supplies",
      status: "Approved",
    },
    {
      name: "Grainger",
      type: "Industrial Supplier",
      integration: "Search Redirect",
      categories: "Safety, tools, maintenance",
      status: "Approved",
    },
    {
      name: "Alibaba",
      type: "Wholesale Marketplace",
      integration: "Search Redirect",
      categories: "Bulk goods, industrial, packaging",
      status: "Experimental",
    },
    {
      name: "Global Industrial",
      type: "Industrial Supplier",
      integration: "Search Redirect",
      categories: "Warehouse, storage, facility supplies",
      status: "Approved",
    },
    {
      name: "Staples Business",
      type: "Office Supplier",
      integration: "Search Redirect",
      categories: "Office, labels, paper, supplies",
      status: "Approved",
    },
    {
      name: "Office Depot",
      type: "Office Supplier",
      integration: "Search Redirect",
      categories: "Office supplies, cleaning, furniture",
      status: "Approved",
    },
    {
      name: "Fastenal",
      type: "Industrial Supplier",
      integration: "Search Redirect",
      categories: "Fasteners, tools, safety, industrial",
      status: "Approved",
    },
    {
      name: "MSC Industrial",
      type: "Industrial Distributor",
      integration: "Search Redirect",
      categories: "Industrial parts, tools, maintenance",
      status: "Approved",
    },
    {
      name: "Walmart Business",
      type: "Retail / Marketplace",
      integration: "Search Redirect",
      categories: "General supplies, janitorial, bulk basics",
      status: "Experimental",
    },
  ];

  return (
    <main>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>
          Vendor Sources
        </h1>
        <p style={{ color: "#6b7280" }}>
          Supplier sources currently used by Shuka for quote generation and vendor handoff.
        </p>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {vendors.map((vendor) => (
          <div
            key={vendor.name}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <strong style={{ fontSize: "18px" }}>{vendor.name}</strong>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  background:
                    vendor.status === "Preferred"
                      ? "#dcfce7"
                      : vendor.status === "Approved"
                      ? "#dbeafe"
                      : "#fef3c7",
                  color:
                    vendor.status === "Preferred"
                      ? "#166534"
                      : vendor.status === "Approved"
                      ? "#1d4ed8"
                      : "#92400e",
                }}
              >
                {vendor.status}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginTop: "14px",
              }}
            >
              <div>
                <div style={{ color: "#6b7280", fontSize: "13px" }}>Type</div>
                <div style={{ fontWeight: 700 }}>{vendor.type}</div>
              </div>
              <div>
                <div style={{ color: "#6b7280", fontSize: "13px" }}>Integration</div>
                <div style={{ fontWeight: 700 }}>{vendor.integration}</div>
              </div>
            </div>

            <div style={{ marginTop: "14px" }}>
              <div style={{ color: "#6b7280", fontSize: "13px" }}>Categories</div>
              <div style={{ fontWeight: 700 }}>{vendor.categories}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
