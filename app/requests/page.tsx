"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export default function RequestsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("general");
  const [urgency, setUrgency] = useState("normal");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { data: newRequest, error } = await supabase
      .from("purchase_requests")
      .insert({
        product,
        quantity,
        category,
        urgency,
        budget_cap: 0,
        status: "submitted",
      })
      .select()
      .single();

    if (error) {
      setMessage("Error creating request: " + error.message);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/generate-quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_id: newRequest.id,
        product_name: product,
        quantity,
      }),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMessage("Quote generation failed: " + (result.error || "Unknown error"));
      setLoading(false);
      return;
    }

    setMessage("Request submitted and quotes generated.");
    setProduct("");
    setQuantity(1);
    setCategory("general");
    setUrgency("normal");
    setLoading(false);
  }

  return (
    <main>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>
          Create Purchase Request
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Submit a new item request and let Shuka generate vendor quotes automatically.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 760px) 320px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
            display: "grid",
            gap: "18px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Product
            </label>
            <input
              type="text"
              placeholder="e.g. packing tape, nitrile gloves, shipping labels"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                min={1}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="general">General</option>
                <option value="packaging">Packaging</option>
                <option value="office">Office Supplies</option>
                <option value="industrial">Industrial</option>
                <option value="janitorial">Janitorial</option>
                <option value="safety">Safety</option>
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Urgency
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["low", "normal", "high", "critical"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "999px",
                    border:
                      urgency === level
                        ? "1px solid #111827"
                        : "1px solid #d1d5db",
                    background: urgency === level ? "#111827" : "white",
                    color: urgency === level ? "white" : "#111827",
                    cursor: "pointer",
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 18px",
                background: "#111827",
                color: "white",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

            {message && (
              <span style={{ color: "#374151", fontSize: "14px" }}>{message}</span>
            )}
          </div>
        </form>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "18px" }}>How it works</h2>
          <div style={{ display: "grid", gap: "14px", color: "#4b5563" }}>
            <div>
              <strong style={{ display: "block", color: "#111827" }}>1. Submit</strong>
              Create a request for the product your team needs.
            </div>
            <div>
              <strong style={{ display: "block", color: "#111827" }}>2. Source</strong>
              Shuka generates supplier options and quote links automatically.
            </div>
            <div>
              <strong style={{ display: "block", color: "#111827" }}>3. Decide</strong>
              AI can recommend the best vendor or send it to approvals.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
