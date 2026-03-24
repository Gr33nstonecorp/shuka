"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  request_id: string;
  quote_id: string;
  vendor_name: string | null;
  total_amount: number | null;
  status: string;
  shipment_status: string;
  created_at?: string | null;
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

function formatMoney(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

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

    const requestIds = [
      ...new Set(typedOrders.map((o) => o.request_id).filter(Boolean)),
    ];

    const { data: requestRows } = await supabase
      .from("purchase_requests")
      .select("id, product, quantity, notes")
      .in("id", requestIds);

    const requestMap = new Map<string, RequestRow>();
    (requestRows || []).forEach((r: any) => requestMap.set(r.id, r));

    const enriched = typedOrders.map((order) => {
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

  async function saveItem(order: EnrichedOrder) {
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const email = session?.user?.email;

    if (!email) {
      setMessage("Login required to save items.");
      return;
    }

    const qty = Number(order.quantity || 1);
    const total = Number(order.total_amount || 0);
    const unit = qty > 0 ? total / qty : total;

    const { error } = await supabase.from("saved_items").insert({
      user_email: email,
      product: order.product || "Unnamed product",
      preferred_vendor: order.vendor_name,
      last_unit_price: unit,
      last_quantity: qty,
      notes: order.notes || null,
    });

    if (error) {
      setMessage("Save failed: " + error.message);
      return;
    }

    setMessage("Item saved for quick reorder.");
  }

  return (
    <main style={pageWrap}>
      {/* HEADER */}
      <header style={headerStyle}>
        <div style={headerInner}>
          <Link href="/" style={brand}>
            ShukAI
          </Link>

          <nav style={nav}>
            <Link href="/requests">Requests</Link>
            <Link href="/quotes">Quotes</Link>
            <Link href="/orders" style={{ fontWeight: 800 }}>
              Orders
            </Link>
            <Link href="/vendors">Vendors</Link>
            <Link href="/assistant">AI Assistant</Link>
            <Link href="/profile">Profile</Link>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <div style={container}>
        <h1 style={title}>Orders</h1>
        <p style={subtitle}>
          Track purchase orders and save repeat buys.
        </p>

        {message && <div style={infoBox}>{message}</div>}

        {loading ? (
          <div style={card}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {orders.map((order) => (
              <div key={order.id} style={card}>
                <div style={rowBetween}>
                  <div>
                    <div style={product}>
                      {order.product || "Order Item"}
                    </div>
                    <div style={meta}>
                      Vendor: {order.vendor_name || "Unknown"}
                    </div>
                    <div style={meta}>
                      Created: {formatDate(order.created_at)}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <Badge label={order.status} kind="success" />
                    <Badge label={order.shipment_status} kind="info" />
                  </div>
                </div>

                <div style={grid}>
                  <Metric label="Total" value={formatMoney(order.total_amount)} />
                  <Metric label="Qty" value={String(order.quantity || 1)} />
                  <Metric label="Request" value={order.request_id} />
                </div>

                {order.notes && (
                  <p style={notes}>{order.notes}</p>
                )}

                <div style={{ marginTop: "12px" }}>
                  <button style={button} onClick={() => saveItem(order)}>
                    Save Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- UI ---------- */

function Metric({ label, value }: any) {
  return (
    <div>
      <div style={{ color: "#6b7280", fontSize: "12px" }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function Badge({ label, kind }: any) {
  const styles =
    kind === "success"
      ? { background: "#dcfce7", color: "#166534" }
      : { background: "#dbeafe", color: "#1d4ed8" };

  return (
    <span style={{ ...badge, ...styles }}>{label}</span>
  );
}

function EmptyState() {
  return (
    <div style={card}>
      <h3>No orders yet</h3>
      <p>Create requests → generate quotes → approve → orders appear here.</p>
      <Link href="/requests">Create Request</Link>
    </div>
  );
}

/* ---------- STYLES ---------- */

const pageWrap = { minHeight: "100vh", background: "#f3f4f6" };

const headerStyle = {
  background: "#0b1220",
  color: "white",
  padding: "16px",
};

const headerInner = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
};

const brand = { fontWeight: 900, fontSize: "22px", color: "white" };

const nav = { display: "flex", gap: "12px", alignItems: "center" };

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "24px",
};

const title = { fontSize: "28px", fontWeight: 800 };

const subtitle = { color: "#6b7280", marginBottom: "16px" };

const card = {
  background: "white",
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: "12px",
  marginTop: "12px",
};

const product = { fontWeight: 800, fontSize: "16px" };

const meta = { color: "#6b7280", fontSize: "13px" };

const notes = { marginTop: "10px", color: "#4b5563" };

const button = {
  padding: "10px 14px",
  background: "#111827",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const badge = {
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
};

const infoBox = {
  marginBottom: "12px",
  background: "#eff6ff",
  padding: "10px",
  borderRadius: "8px",
};
