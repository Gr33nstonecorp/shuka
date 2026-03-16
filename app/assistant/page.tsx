"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export default function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  async function handleAsk() {
    setResponse("Thinking...");

    // Get quotes from DB
    const { data: quotes, error } = await supabase
      .from("quote_options")
      .select("*")
      .eq("status", "generated");

    if (error) {
      setResponse("Error: " + error.message);
      return;
    }

    if (!quotes || quotes.length === 0) {
      setResponse("No quotes available.");
      return;
    }

    // Find cheapest total cost
    const best = quotes.reduce((prev, curr) => {
      const prevTotal = (prev.unit_price || 0) + (prev.shipping_cost || 0);
      const currTotal = (curr.unit_price || 0) + (curr.shipping_cost || 0);
      return currTotal < prevTotal ? curr : prev;
    });

    const total =
      Number(best.unit_price || 0) + Number(best.shipping_cost || 0);

    setResponse(
      `Best option: ${best.vendor_name} - Total $${total} (Lead time: ${best.lead_time_days} days)`
    );
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>AI Assistant</h1>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Ask Shuka (e.g. cheapest supplier for tape)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "10px", width: "300px" }}
        />

        <button
          onClick={handleAsk}
          style={{
            marginLeft: "10px",
            padding: "10px 16px",
            background: "black",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Ask
        </button>
      </div>

      {response && (
        <div
          style={{
            marginTop: "20px",
            background: "#f5f5f5",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          {response}
        </div>
      )}
    </main>
  );
}
