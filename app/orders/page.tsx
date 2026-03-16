import { createClient } from "@supabase/supabase-js";

export default async function OrdersPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: orders, error } = await supabase
    .from("purchase_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: "32px" }}>
        <h1>Orders</h1>
        <p>Error loading orders: {error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>Orders</h1>

      {!orders || orders.length === 0 ? (
        <p>No orders created yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
          {orders.map((order: any) => (
            <div
              key={order.id}
              style={{
                background: "white",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #ddd",
              }}
            >
              <strong>{order.vendor_name}</strong>
              <p>Total: ${order.total_amount}</p>
              <p>Status: {order.status}</p>
              <p>Shipment Status: {order.shipment_status}</p>
              <p>Request ID: {order.request_id}</p>
              <p>Quote ID: {order.quote_id}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
