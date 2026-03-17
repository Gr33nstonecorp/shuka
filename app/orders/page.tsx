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

type RequestRow = {
  id: string;
  product: string;
  quantity: number;
  notes?: string | null;
};

type EnrichedOrder = Order & {
  product?: string;
  quantity?: number;
  notes?: string | null;
};

type SessionUser = {
  email?: string;
};

export default function OrdersPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    setLoading(true);
    setMessage("");

    const { data: orderRows, error: ordersError } = await supabase
      .from("purchase_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) {
      setMessage("Error loading orders: " + ordersError.message);
      setLoading(false);
      return;
    }

    const typedOrders = (orderRows as Order[]) || [];

    if (typedOrders.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const requestIds = [...new Set(typedOrders.map((o) => o.request_id).filter(Boolean))];

    const { data: requestRows, error: requestsError } = await supabase
      .from("purchase_requests")
      .select("id, product, quantity, notes")
      .in("id", requestIds);

    if (requestsError) {
      setMessage("Orders loaded, but request details failed: " + requestsError.message);
    }

    const requestMap = new Map<string, RequestRow>();
    ((requestRows as RequestRow[]) || []).forEach((r) => requestMap.set(r.id, r));

    const enriched: EnrichedOrder[] = typedOrders.map((order) => {
      const request = requestMap.get(order.request_id);
      return {
        ...order,
        product: request?.product,
        quantity: request?.quantity,
        notes: request?.notes,
      };
    });

    setOrders(enriched);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function saveItemFromOrder(order: EnrichedOrder) {
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

    const quantity = Number(order.quantity || 1);
    const total = Number(order.total_amount || 0);
    const unitPrice = quantity > 0 ? total / quantity : total;

    const { error: saveError } = await supabase.from("saved_items").insert({
      user_email: userEmail,
      product: order.product || "Unnamed product",
      preferred_vendor: order.vendor_name || null,
      last_unit_price: unitPrice,
      last_quantity: quantity,
      notes: order.notes || null,
    });

    if (saveError) {
      setMessage("Could not save item: " + saveError.message);
      return;
    }

    setMessage(`Saved "${order.product || "item"}" for quick reorder.`);
  }

  return (
    <main>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>Orders</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Track approved purchase orders and save repeat buys for faster reordering.
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

      {loading ? (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onSave={() => saveItemFromOrder(order)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function OrderCard({
  order,
  onSave,
}: {
  order: EnrichedOrder;
  onSave: () => void;
}) {
  return (
    <div
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
          alignItems: "start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: "18px" }}>
            {order.product || "Order Item"}
          </div>
          <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
            Vendor: {order.vendor_name}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Badge label={order.status} kind="success" />
          <Badge label={order.shipment_status} kind="info" />
        </div>
      </div>

      <div
        style={{
          marginTop: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
        }}
      >
        <Metric label="Total" value={`$${Number(order.total_amount || 0).toFixed(2)}`} />
        <Metric label="Quantity" value={String(order.quantity || 1)} />
        <Metric label="Request ID" value={order.request_id} />
        <Metric label="Quote ID" value={order.quote_id} />
      </div>

      {order.notes && (
        <p style={{ marginTop: "14px", color: "#4b5563" }}>{order.notes}</p>
      )}

      <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={onSave}
          style={{
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
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: "#6b7280", fontSize: "13px" }}>{label}</div>
      <div
        style={{
          fontWeight: 700,
          marginTop: "4px",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Badge({
  label,
  kind,
}: {
  label: string;
  kind: "success" | "info" | "warning";
}) {
  const styles =
    kind === "success"
      ? { background: "#dcfce7", color: "#166534" }
      : kind === "info"
      ? { background: "#dbeafe", color: "#1d4ed8" }
      : { background: "#fef3c7", color: "#92400e" };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        ...styles,
      }}
    >
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        textAlign: "center",
        color: "#6b7280",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: 700 }}>
        No orders created yet
      </div>
      <p style={{ marginTop: "6px" }}>
        Approve a quote or let Shuka auto-approve one to create your first order.
      </p>
    </div>
  );
}
