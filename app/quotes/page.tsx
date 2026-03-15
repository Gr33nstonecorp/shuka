export default function QuotesPage() {
  const quotes = [
    {
      product: "Barcode Labels",
      vendor: "Amazon Business",
      unitPrice: "$8.10",
      shipping: "$12.00",
      leadTime: "2 days",
      recommendation: "Best Overall",
    },
    {
      product: "Barcode Labels",
      vendor: "Staples Business",
      unitPrice: "$8.80",
      shipping: "$9.00",
      leadTime: "3 days",
      recommendation: "Faster Backup",
    },
    {
      product: "Packing Tape",
      vendor: "Uline",
      unitPrice: "$4.20",
      shipping: "$18.00",
      leadTime: "2 days",
      recommendation: "Best Packaging Source",
    },
  ];

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Quote Comparison</h1>
      <p>AI-generated comparison of vendor offers before purchase approval.</p>

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
              <th style={{ padding: "12px" }}>Product</th>
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Unit Price</th>
              <th style={{ padding: "12px" }}>Shipping</th>
              <th style={{ padding: "12px" }}>Lead Time</th>
              <th style={{ padding: "12px" }}>AI Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{quote.product}</td>
                <td style={{ padding: "12px" }}>{quote.vendor}</td>
                <td style={{ padding: "12px" }}>{quote.unitPrice}</td>
                <td style={{ padding: "12px" }}>{quote.shipping}</td>
                <td style={{ padding: "12px" }}>{quote.leadTime}</td>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{quote.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
