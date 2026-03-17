"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Stats = {
  requests: number;
  quotes: number;
  approvals: number;
  orders: number;
  savedItems: number;
};

type ActivityItem = {
  label: string;
  value: string;
};

export default function DashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [stats, setStats] = useState<Stats>({
    requests: 0,
    quotes: 0,
    approvals: 0,
    orders: 0,
    savedItems: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userEmail = session?.user?.email || "";

      const [
        { count: requests },
        { count: quotes },
        { count: approvals },
        { count: orders },
        { count: savedItems },
        { data: ordersData },
      ] = await Promise.all([
        supabase
          .from("purchase_requests")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("quote_options")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("quote_options")
          .select("*", { count: "exact", head: true })
          .eq("status", "generated"),
        supabase
          .from("purchase_orders")
          .select("*", { count: "exact", head: true }),
        userEmail
          ? supabase
              .from("saved_items")
              .select("*", { count: "exact", head: true })
              .eq("user_email", userEmail)
          : supabase
              .from("saved_items")
              .select("*", { count: "exact", head: true }),
        supabase
          .from("purchase_orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        requests: requests || 0,
        quotes: quotes || 0,
        approvals: approvals || 0,
        orders: orders || 0,
        savedItems: savedItems || 0,
      });

      setRecentOrders(ordersData || []);

      setActivity([
        {
          label: "Open requests ready for sourcing",
          value: String(requests || 0),
        },
        {
          label: "Quotes waiting for a decision",
          value: String(approvals || 0),
        },
        {
          label: "Orders currently in your system",
          value: String(orders || 0),
        },
      ]);

      setLoading(false);
    }

    loadDashboard();
  }, [supabase]);

  return (
    <main>
      <section
        style={{
          background:
            "linear-gradient(135deg, #111827 0%, #1f2937 50%, #0f172a 100%)",
          borderRadius: "24px",
          padding: "28px",
          color: "white",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "24px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.12)",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "14px",
              }}
            >
              AI Procurement Workspace
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "40px",
                lineHeight: 1.05,
                fontWeight: 800,
              }}
            >
              Procurement
              <br />
              Command Center
            </h1>

            <p
              style={{
                marginTop: "14px",
                marginBottom: 0,
                color: "#d1d5db",
                fontSize: "16px",
                lineHeight: 1.6,
                maxWidth: "700px",
              }}
            >
              Create requests, compare suppliers, approve purchases, save repeat
              buys, and let Shuka guide your sourcing workflow.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "20px",
              }}
            >
              <a
                href="/requests"
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  background: "white",
                  color: "#111827",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                New Request
              </a>
              <a
                href="/assistant"
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 700,
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                Open AI Assistant
              </a>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "18px",
              padding: "18px",
              alignSelf: "start",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: "12px" }}>
              Workspace Snapshot
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              {activity.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "10px",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "#d1d5db" }}>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
        }}
      >
        <StatCard
          title="Requests"
          value={stats.requests}
          subtitle="Items submitted for sourcing"
        />
        <StatCard
          title="Quotes"
          value={stats.quotes}
          subtitle="Supplier options created"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.approvals}
          subtitle="Quotes needing review"
        />
        <StatCard
          title="Orders"
          value={stats.orders}
          subtitle="Approved purchase orders"
        />
        <StatCard
          title="Saved Items"
          value={stats.savedItems}
          subtitle="Reusable reorder templates"
        />
      </section>

      <section
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "18px",
        }}
      >
        <QuickLinkCard
          title="Create Request"
          description="Start a new purchasing request and let Shuka source quotes."
          href="/requests"
        />
        <QuickLinkCard
          title="Review Quotes"
          description="Compare supplier options and open vendor links."
          href="/quotes"
        />
        <QuickLinkCard
          title="Approvals"
          description="Approve, reject, and move quotes into orders."
          href="/approvals"
        />
        <QuickLinkCard
          title="Saved Items"
          description="Reorder repeat purchases in one click."
          href="/saved-items"
        />
      </section>

      <section
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "18px",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              alignItems: "center",
              marginBottom: "14px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: "20px" }}>Recent Orders</h2>
              <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "14px" }}>
                Latest purchase orders flowing through Shuka.
              </p>
            </div>
            <a
              href="/orders"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              View all →
            </a>
          </div>

          {loading ? (
            <div style={{ color: "#6b7280" }}>Loading recent orders...</div>
          ) : recentOrders.length === 0 ? (
            <div
              style={{
                padding: "18px",
                background: "#f9fafb",
                borderRadius: "12px",
                color: "#6b7280",
              }}
            >
              No orders yet.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "14px",
                    padding: "14px",
                    background: "#f9fafb",
                    borderRadius: "12px",
                    border: "1px solid #eef2f7",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800 }}>{order.vendor_name}</div>
                    <div style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>
                      Status: {order.status} · Shipment: {order.shipment_status}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800 }}>
                      ${Number(order.total_amount || 0).toFixed(2)}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>
                      Order
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "20px" }}>AI Actions</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.6 }}>
            Let Shuka create requests, source suppliers, and recommend the best
            option for one or multiple items.
          </p>

          <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
            <MiniAction
              title="Ask AI for suppliers"
              href="/assistant"
            />
            <MiniAction
              title="Review pending approvals"
              href="/approvals"
            />
            <MiniAction
              title="Reorder saved items"
              href="/saved-items"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "20px",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div style={{ color: "#6b7280", fontSize: "13px", fontWeight: 700 }}>
        {title}
      </div>
      <div style={{ fontSize: "34px", fontWeight: 800, marginTop: "8px" }}>
        {value}
      </div>
      <div style={{ color: "#6b7280", fontSize: "13px", marginTop: "8px" }}>
        {subtitle}
      </div>
    </div>
  );
}

function QuickLinkCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "20px",
        textDecoration: "none",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div style={{ color: "#111827", fontWeight: 800, fontSize: "18px" }}>
        {title}
      </div>
      <div style={{ color: "#6b7280", marginTop: "8px", lineHeight: 1.6 }}>
        {description}
      </div>
    </a>
  );
}

function MiniAction({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        padding: "12px 14px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        textDecoration: "none",
        color: "#111827",
        fontWeight: 700,
      }}
    >
      {title}
    </a>
  );
}
