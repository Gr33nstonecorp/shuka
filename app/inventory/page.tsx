export default function InventoryPage() {
  const items = [
    {
      name: "Packing Tape",
      sku: "PT-223",
      quantity: 12,
      reorderPoint: 25,
      vendor: "Uline",
      cost: "$4.20",
    },
    {
      name: "Nitrile Gloves",
      sku: "GL-884",
      quantity: 310,
      reorderPoint: 200,
      vendor: "Grainger",
      cost: "$12.50",
    },
    {
      name: "Barcode Labels",
      sku: "LB-992",
      quantity: 5,
      reorderPoint: 50,
      vendor: "Amazon Business",
      cost: "$8.10",
    },
    {
      name: "Stretch Wrap",
      sku: "SW-441",
      quantity: 40,
      reorderPoint: 30,
      vendor: "Staples Business",
      cost: "$15.75",
    },
  ];

  function getStatus(quantity: number, reorderPoint: number) {
    if (quantity <= reorderPoint / 2) return "Critical";
    if (quantity <= reorderPoint) return "Low";
    return "OK";
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Inventory</h1>
      <p>Track stock levels, reorder points, and preferred vendors.</p>

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
              <th style={{ padding: "12px" }}>Qty</th>
              <th style={{ padding: "12px" }}>Reorder Point</th>
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Unit Cost</th>
              <th style={{ padding: "12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const status = getStatus(item.quantity, item.reorderPoint);

              return (
                <tr key={item.sku} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{item.name}</td>
                  <td style={{ padding: "12px" }}>{item.sku}</td>
                  <td style={{ padding: "12px" }}>{item.quantity}</td>
                  <td style={{ padding: "12px" }}>{item.reorderPoint}</td>
                  <td style={{ padding: "12px" }}>{item.vendor}</td>
                  <td style={{ padding: "12px" }}>{item.cost}</td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    {status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
