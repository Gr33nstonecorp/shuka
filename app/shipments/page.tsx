import { createClient } from "@supabase/supabase-js";

export default async function ShipmentsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: shipments, error } = await supabase
    .from("purchase_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: "32px" }}>
        <h1>Shipments</h1>
        <p>Error loading shipments: {error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>Shipments</h1>

      {!shipments || shipments.length === 0 ? (
        <p>No shipments found.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
          {shipments.map((order: any) => (
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
              <p>Total: ${Number(order.total_amount).toFixed(2)}</p>
              <p>Order Status: {order.status}</p>
              <p>Shipment Status: {order.shipment_status}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
