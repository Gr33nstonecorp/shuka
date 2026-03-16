"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export default function RequestPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setMessage("");

    // 1. Create request
    const { data: newRequest, error } = await supabase
      .from("purchase_requests")
      .insert({
        product_name: productName,
        quantity: quantity,
        status: "submitted",
      })
      .select()
      .single();

    if (error) {
      setMessage("Error creating request: " + error.message);
      return;
    }

    // 2. Trigger AI quote generation
    await fetch("/api/generate-quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_id: newRequest.id,
        product_name: productName,
        quantity: quantity,
      }),
    });

    setMessage("Request submitted and quotes generated!");

    // reset form
    setProductName("");
    setQuantity(1);
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>Create Purchase Request</h1>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "20px", display: "grid", gap: "12px" }}
      >
        <input
          type="text"
          placeholder="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          style={{ padding: "10px" }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "black",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Submit Request
        </button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </main>
  );
}
