import { getSupabaseServer } from "../../lib/supabaseServer";

export default async function ApprovalsPage() {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("quote_options")
    .select(`
      id,
      vendor_name,
      unit_price,
      shipping_cost,
      recommendation,
      status,
      purchase_requests (
        id,
        product,
        quantity
      )
    `)
    .eq("status", "pending_approval")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Approvals</h1>
      <p>Approve AI-selected vendor options before creating a purchase order.</p>

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
              <th style={{ padding: "12px" }}>Product</th>
              <th style={{ padding: "12px" }}>Vendor</th>
              <th style={{ padding: "12px" }}>Total Est.</th>
              <th style={{ padding: "12px" }}>Recommendation</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((quote) => {
              const request = Array.isArray(quote.purchase_requests)
                ? quote.purchase_requests[0]
                : quote.purchase_requests;

              if (!request) return null;

              const total =
                Number(quote.unit_price) * Number(request.quantity) +
                Number(quote.shipping_cost);

              return (
                <tr key={quote.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{request.id}</td>
                  <td style={{ padding: "12px" }}>{request.product}</td>
                  <td style={{ padding: "12px" }}>{quote.vendor_name}</td>
                  <td style={{ padding: "12px" }}>${total.toFixed(2)}</td>
                  <td style={{ padding: "12px" }}>{quote.recommendation}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <form action={`/api/approvals/${quote.id}/approve`} method="post">
                        <button
                          type="submit"
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
                      </form>
                      <form action={`/api/approvals/${quote.id}/reject`} method="post">
                        <button
                          type="submit"
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
                      </form>
                    </div>
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
