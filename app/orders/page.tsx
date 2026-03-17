"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  request_id: string;
  quote_id: string;
  vendor_name: string;
  total_amount: number;
  status: string;
  shipment_status: string;
  created_at?: string;
};

type SavedItemInsert = {
  user_email: string;
  product: string;
  preferred_vendor: string | null;
  last_unit_price: number;
  last_quantity: number;
  notes: string | null;
};

type SessionUser = {
  email?: string;
};

export default function OrdersPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    const { data, error } = await supabase
      .from("purchase_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading orders: " + error.message);
      return;
    }

    setOrders((data as Order[]) || []);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function saveItemFromOrder(order: Order) {
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user as SessionUser | undefined;
    const userEmail = user?.email || "";

    if (!userEmail) {
      setMessage("You must be signed in to save items.");
      return;
    }

    const { data: requestRow, error: requestError } = await supabase
      .from("purchase_requests")
      .select("*")
      .eq("id", order.request_id)
      .maybeSingle();

    if (requestError) {
      setMessage("Could not read request: " + requestError.message);
      return;
    }

    if (!requestRow) {
      setMessage("Original request not found for this order.");
      return;
    }

    const quantity = Number(requestRow.quantity || 1);
    const total = Number(order.total_amount || 0);
    const unitPrice = quantity > 0 ? total / quantity : total;

    const savedItem: SavedItemInsert = {
      user_email: userEmail,
      product: requestRow.product || "Unnamed product",
      preferred_vendor: order.vendor_name || null,
      last_unit_price: unitPrice,
      last_quantity: quantity,
      notes: requestRow.notes || null,
    };

    const { error: saveError } = await supabase
      .from("saved_items")
      .insert(savedItem);

    if (saveError) {
      setMessage("Could not save item: " + saveError.message);
      return;
    }

    setMessage(`Saved "${savedItem.product}" for quick reorder.`);
  }

  return (
    <main>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>Orders</h1>
        <p style={{ color: "#6b7280" }}>
          Approved purchase orders and reusable reorder history.
        </p>
      </div>

      {message && (
        <div
          style={{
            marginBottom: "16px",
            background: "#eff6ff",
            color: "#1d4ed8",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #bfdbfe",
          }}
        >
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          No orders created yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
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
                <strong style={{ fontSize: "18px" }}>{order.vendor_name}</strong>
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: "#dcfce7",
                    color: "#166534",
                  }}
                >
                  {order.status}
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
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>Total</div>
                  <div style={{ fontWeight: 700 }}>
                    ${Number(order.total_amount || 0).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>
                    Shipment Status
                  </div>
                  <div style={{ fontWeight: 700 }}>{order.shipment_status}</div>
                </div>
                <div>
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>Request ID</div>
                  <div style={{ fontWeight: 700 }}>{order.request_id}</div>
                </div>
              </div>

              <button
                onClick={() => saveItemFromOrder(order)}
                style={{
                  marginTop: "14px",
                  padding: "10px 14px",
                  background: "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Save Item
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
