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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { data: newRequest, error } = await supabase
      .from("purchase_requests")
      .insert({
        product: product,
        quantity: quantity,
        category: category,
        urgency: urgency,
        budget_cap: 0,
        status: "submitted",
      })
      .select()
      .single();

    if (error) {
      setMessage("Error creating request: " + error.message);
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
        quantity: quantity,
      }),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMessage("Quote generation failed: " + (result.error || "Unknown error"));
      return;
    }

    setMessage("Request submitted and quotes generated.");
    setProduct("");
    setQuantity(1);
    setCategory("general");
    setUrgency("normal");
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>Create Purchase Request</h1>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "20px", display: "grid", gap: "12px", maxWidth: "700px" }}
      >
        <input
          type="text"
          placeholder="Product name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          min={1}
          style={{ padding: "10px" }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option value="general">General</option>
          <option value="packaging">Packaging</option>
          <option value="office">Office Supplies</option>
          <option value="industrial">Industrial</option>
        </select>

        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "black",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Submit Request
        </button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </main>
  );
}
