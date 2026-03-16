import { getSupabaseServer } from "../../lib/supabaseServer";

export default async function QuotesPage() {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("quote_options")
    .select(`
      id,
      vendor_name,
      unit_price,
      shipping_cost,
      lead_time_days,
      ai_score,
      recommendation,
      status,
      purchase_requests (
        id,
        product,
        quantity
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const groups = new Map<string, any[]>();

  for (const row of data || []) {
    const request = Array.isArray(row.purchase_requests)
      ? row.purchase_requests[0]
      : row.purchase_requests;

    if (!request) continue;

    if (!groups.has(request.id)) groups.set(request.id, []);
    groups.get(request.id)!.push({ ...row, request });
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>AI Quote Comparison</h1>
      <p>Generated vendor options for submitted requests.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "24px" }}>
        {[...groups.entries()].map(([requestId, rows]) => (
          <div
            key={requestId}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #ddd",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {rows[0].request.product}{" "}
              <span style={{ color: "#666", fontSize: "16px" }}>({requestId})</span>
            </h2>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Vendor</th>
                  <th style={{ padding: "12px" }}>Unit Price</th>
                  <th style={{ padding: "12px" }}>Shipping</th>
                  <th style={{ padding: "12px" }}>Lead Time</th>
                  <th style={{ padding: "12px" }}>AI Score</th>
                  <th style={{ padding: "12px" }}>Recommendation</th>
                  <th style={{ padding: "12px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((quote) => (
                  <tr key={quote.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>{quote.vendor_name}</td>
                    <td style={{ padding: "12px" }}>${Number(quote.unit_price).toFixed(2)}</td>
                    <td style={{ padding: "12px" }}>${Number(quote.shipping_cost).toFixed(2)}</td>
                    <td style={{ padding: "12px" }}>{quote.lead_time_days} days</td>
                    <td style={{ padding: "12px" }}>{quote.ai_score}</td>
                    <td style={{ padding: "12px" }}>{quote.recommendation}</td>
                    <td style={{ padding: "12px" }}>
                      <form action={`/api/quotes/${quote.id}/send-to-approval`} method="post">
                        <button
                          type="submit"
                          style={{
                            padding: "8px 14px",
                            background: "#111827",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                        >
                          Send to Approval
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </main>
  );
}
