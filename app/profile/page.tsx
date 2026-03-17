"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type SessionUser = {
  email?: string;
};

export default function ProfilePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user as SessionUser | undefined;
      const userEmail = user?.email || "";
      setEmail(userEmail);

      const { count: saved } = await supabase
        .from("saved_items")
        .select("*", { count: "exact", head: true })
        .eq("user_email", userEmail);

      const { count: orders } = await supabase
        .from("purchase_orders")
        .select("*", { count: "exact", head: true });

      setSavedCount(saved || 0);
      setOrderCount(orders || 0);
    }

    loadProfile();
  }, [supabase]);

  return (
    <main>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>Profile</h1>
        <p style={{ color: "#6b7280" }}>
          Your Shuka workspace profile and procurement history summary.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div style={{ color: "#6b7280", fontSize: "13px" }}>Signed in as</div>
          <div style={{ fontWeight: 800, fontSize: "18px", marginTop: "8px" }}>
            {email || "Loading..."}
          </div>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div style={{ color: "#6b7280", fontSize: "13px" }}>Saved items</div>
          <div style={{ fontWeight: 800, fontSize: "30px", marginTop: "8px" }}>
            {savedCount}
          </div>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div style={{ color: "#6b7280", fontSize: "13px" }}>Orders created</div>
          <div style={{ fontWeight: 800, fontSize: "30px", marginTop: "8px" }}>
            {orderCount}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "22px",
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
        }}
      >
        <RecentOrders />
      </div>
    </main>
  );
}
function RecentOrders() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("purchase_orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setOrders(data || []);
    }

    load();
  }, []);

  return (
    <div
      style={{
        marginTop: "24px",
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "22px",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Recent Orders</h2>

      {orders.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No recent orders.</p>
      ) : (
        <div style={{ display: "grid", gap: "10px" }}>
          {orders.map((o) => (
            <div
              key={o.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "#f9fafb",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontWeight: 600 }}>{o.vendor_name}</span>
              <span>${Number(o.total_amount).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
