"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [stats, setStats] = useState({
    requests: 0,
    quotes: 0,
    approvals: 0,
    orders: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const { count: requests } = await supabase
        .from("purchase_requests")
        .select("*", { count: "exact", head: true });

      const { count: quotes } = await supabase
        .from("quote_options")
        .select("*", { count: "exact", head: true });

      const { count: approvals } = await supabase
        .from("quote_options")
        .select("*", { count: "exact", head: true })
        .eq("status", "generated");

      const { count: orders } = await supabase
        .from("purchase_orders")
        .select("*", { count: "exact", head: true });

      setStats({
        requests: requests || 0,
        quotes: quotes || 0,
        approvals: approvals || 0,
        orders: orders || 0,
      });
    }

    loadStats();
  }, []);

  return (
    <main>
      {/* HEADER */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ margin: 0, fontSize: "34px", fontWeight: 800 }}>
          Dashboard
        </h1>
        <p style={{ color: "#6b7280", marginTop: "6px" }}>
          Your AI-powered procurement command center.
        </p>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
        }}
      >
        <StatCard title="Requests" value={stats.requests} />
        <StatCard title="Quotes" value={stats.quotes} />
        <StatCard title="Pending Approvals" value={stats.approvals} />
        <StatCard title="Orders" value={stats.orders} />
      </div>

      {/* ACTIONS */}
      <div
        style={{
          marginTop: "28px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "18px",
        }}
      >
        <ActionCard
          title="Create Request"
          description="Start a new procurement request"
          href="/requests"
        />
        <ActionCard
          title="Review Quotes"
          description="Compare vendor pricing and options"
          href="/quotes"
        />
        <ActionCard
          title="Approvals"
          description="Approve or reject vendor quotes"
          href="/approvals"
        />
        <ActionCard
          title="Orders"
          description="Track all purchase orders"
          href="/orders"
        />
      </div>

      {/* AI PANEL */}
      <div
        style={{
          marginTop: "28px",
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>AI Assistant</h2>
        <p style={{ color: "#4b5563" }}>
          Ask Shuka to find suppliers, compare quotes, and recommend the best
          purchasing decisions.
        </p>

        <a
          href="/assistant"
          style={{
            display: "inline-block",
            marginTop: "12px",
            padding: "10px 16px",
            background: "#111827",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Open AI Assistant
        </a>
      </div>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div style={{ color: "#6b7280", fontSize: "13px" }}>{title}</div>
      <div style={{ fontSize: "32px", fontWeight: 800, marginTop: "6px" }}>
        {value}
      </div>
    </div>
  );
}

function ActionCard({
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
        padding: "22px",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        textDecoration: "none",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
        transition: "0.2s",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: "18px", color: "#111827" }}>
        {title}
      </div>
      <div style={{ marginTop: "6px", color: "#6b7280" }}>{description}</div>
    </a>
  );
}
