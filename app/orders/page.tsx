import { getSupabaseServer } from "../../lib/supabaseServer";

export default async function OrdersPage() {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("purchase_orders")
    .select(`
      id,
      vendor_name,
      total_amount,
      status,
      shipment_status,
      created_at,
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

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0 }}>Orders</h1>
      <p>Approved purchase orders ready for vendor execution.</p>

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
              <th style={{ padding: "12px" }}>Total</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Shipment</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((order) => {
              const request = Array.isArray(order.purchase_requests)
                ? order.purchase_requests[0]
                : order.purchase_requests;

              return (
                <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{request?.id}</td>
                  <td style={{ padding: "12px" }}>{request?.product}</td>
                  <td style={{ padding: "12px" }}>{order.vendor_name}</td>
                  <td style={{ padding: "12px" }}>${Number(order.total_amount).toFixed(2)}</td>
                  <td style={{ padding: "12px" }}>{order.status}</td>
                  <td style={{ padding: "12px" }}>{order.shipment_status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
