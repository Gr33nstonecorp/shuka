"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

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
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function OrdersPage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
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
      <header style={headerStyle}>
        <div style={headerInner}>
          <Link href="/" style={brand}>
            ShukAI
          </Link>

          <nav style={nav}>
            <Link href="/requests" style={navLink}>
              Requests
            </Link>
            <Link href="/quotes" style={navLink}>
              Quotes
            </Link>
            <Link href="/orders" style={navLinkActive}>
              Orders
            </Link>
            <Link href="/vendors" style={navLink}>
              Vendors
            </Link>
            <Link href="/assistant" style={navLink}>
              AI Assistant
            </Link>
            <Link href="/profile" style={ghostButtonLink}>
              Profile
            </Link>
          </nav>
        </div>
      </header>

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
          <div style={ordersGrid}>
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

                  <div style={badgeRow}>
                    <Badge label={order.status} kind="success" />
                    <Badge label={order.shipment_status} kind="info" />
                  </div>
                </div>

                <div style={grid}>
                  <Metric label="Total" value={formatMoney(order.total_amount)} />
                  <Metric label="Qty" value={String(order.quantity || 1)} />
                  <Metric label="Request" value={order.request_id} />
                </div>

                {order.notes && <p style={notes}>{order.notes}</p>}

                <div style={actionRow}>
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

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div style={metricLabel}>{label}</div>
      <div style={metricValue}>{value}</div>
    </div>
  );
}

function Badge({
  label,
  kind,
}: {
  label: string;
  kind: "success" | "info";
}) {
  const styles: React.CSSProperties =
    kind === "success"
      ? { background: "#dcfce7", color: "#166534" }
      : { background: "#dbeafe", color: "#1d4ed8" };

  return <span style={{ ...badge, ...styles }}>{label}</span>;
}

function EmptyState() {
  return (
    <div style={card}>
      <h3 style={emptyTitle}>No orders yet</h3>
      <p style={emptyText}>
        Create requests, generate quotes, and approve one to see orders here.
      </p>
      <Link href="/requests" style={primaryLink}>
        Create Request
      </Link>
    </div>
  );
}

const pageWrap: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f3f4f6",
};

const headerStyle: React.CSSProperties = {
  background: "#0b1220",
  color: "white",
  padding: "16px",
};

const headerInner: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
};

const brand: React.CSSProperties = {
  fontWeight: 900,
  fontSize: "22px",
  color: "white",
  textDecoration: "none",
};

const nav: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const navLink: React.CSSProperties = {
  color: "#cbd5e1",
  textDecoration: "none",
  fontWeight: 600,
};

const navLinkActive: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
};

const ghostButtonLink: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  fontWeight: 700,
};

const container: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "24px",
};

const title: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 800,
};

const subtitle: React.CSSProperties = {
  color: "#6b7280",
  marginBottom: "16px",
};

const ordersGrid: React.CSSProperties = {
  display: "grid",
  gap: "16px",
};

const card: React.CSSProperties = {
  background: "white",
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const rowBetween: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const badgeRow: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "12px",
  marginTop: "12px",
};

const product: React.CSSProperties = {
  fontWeight: 800,
  fontSize: "16px",
};

const meta: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
};

const notes: React.CSSProperties = {
  marginTop: "10px",
  color: "#4b5563",
};

const actionRow: React.CSSProperties = {
  marginTop: "12px",
};

const button: React.CSSProperties = {
  padding: "10px 14px",
  background: "#111827",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const badge: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
};

const metricLabel: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "12px",
};

const metricValue: React.CSSProperties = {
  fontWeight: 700,
};

const infoBox: React.CSSProperties = {
  marginBottom: "12px",
  background: "#eff6ff",
  padding: "10px",
  borderRadius: "8px",
};

const emptyTitle: React.CSSProperties = {
  marginTop: 0,
};

const emptyText: React.CSSProperties = {
  color: "#6b7280",
};

const primaryLink: React.CSSProperties = {
  display: "inline-block",
  marginTop: "12px",
  padding: "10px 14px",
  background: "#111827",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 700,
};
