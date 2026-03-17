"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type SavedItem = {
  id: string;
  user_email: string;
  product: string;
  preferred_vendor: string | null;
  last_unit_price: number | null;
  last_quantity: number | null;
  notes: string | null;
};

type SessionUser = {
  email?: string;
};

export default function SavedItemsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [items, setItems] = useState<SavedItem[]>([]);
  const [message, setMessage] = useState("");

  async function loadItems() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user as SessionUser | undefined;
    const userEmail = user?.email || "";

    if (!userEmail) {
      setMessage("You must be signed in.");
      return;
    }

    const { data, error } = await supabase
      .from("saved_items")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading saved items: " + error.message);
      return;
    }

    setItems((data as SavedItem[]) || []);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function reorderItem(item: SavedItem) {
    setMessage("");

    const { data: newRequest, error: requestError } = await supabase
      .from("purchase_requests")
      .insert({
        product: item.product,
        quantity: item.last_quantity || 1,
        category: "general",
        urgency: "normal",
        budget_cap: 0,
        preferred_vendor: item.preferred_vendor,
        notes: item.notes,
        status: "submitted",
      })
      .select()
      .single();

    if (requestError) {
      setMessage("Could not create reorder request: " + requestError.message);
      return;
    }

    const apiRes = await fetch("/api/generate-quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_id: newRequest.id,
        product_name: item.product,
        quantity: item.last_quantity || 1,
      }),
    });

    const apiJson = await apiRes.json().catch(() => ({}));

    if (!apiRes.ok) {
      setMessage("Could not generate reorder quotes: " + (apiJson.error || "Unknown error"));
      return;
    }

    setMessage(`Reorder request created for ${item.product}. Check Quotes or Approvals.`);
  }

  return (
    <main>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>Saved Items</h1>
        <p style={{ color: "#6b7280" }}>
          Reusable products you can quickly reorder through Shuka.
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

      {items.length === 0 ? (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          No saved items yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
              }}
            >
              <strong style={{ fontSize: "18px" }}>{item.product}</strong>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                  marginTop: "14px",
                }}
              >
                <div>
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>Preferred Vendor</div>
                  <div style={{ fontWeight: 700 }}>{item.preferred_vendor || "None"}</div>
                </div>
                <div>
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>Last Quantity</div>
                  <div style={{ fontWeight: 700 }}>{item.last_quantity || 1}</div>
                </div>
                <div>
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>Last Unit Price</div>
                  <div style={{ fontWeight: 700 }}>
                    ${Number(item.last_unit_price || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {item.notes && (
                <p style={{ marginTop: "12px", color: "#4b5563" }}>{item.notes}</p>
              )}

              <button
                onClick={() => reorderItem(item)}
                style={{
                  marginTop: "12px",
                  padding: "10px 14px",
                  background: "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Reorder
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
