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

    // Calculate scores
    const evaluated = quotes.map((q) => {
      const total =
        Number(q.unit_price || 0) + Number(q.shipping_cost || 0);

      const score =
        (100 - total) +               // cheaper = better
        (100 - q.lead_time_days * 5) + // faster = better
        (q.ai_score || 0);             // existing AI score

      return { ...q, total, score };
    });

    // Sort best first
    evaluated.sort((a, b) => b.score - a.score);

    const best = evaluated[0];

    setResponse(
      `Recommended Vendor: ${best.vendor_name}

Total Cost: $${best.total}
Lead Time: ${best.lead_time_days} days
AI Score: ${best.ai_score}

Reason:
- Optimized for price + delivery speed
- Highest combined score among vendors
`
    );
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>AI Assistant</h1>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Ask Shuka (e.g. best supplier for tape)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "10px", width: "320px" }}
        />

        <button
          onClick={handleAsk}
          style={{
            marginLeft: "10px",
            padding: "10px 16px",
            background: "black",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
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
            whiteSpace: "pre-line",
          }}
        >
          {response}
        </div>
      )}
    </main>
  );
}
