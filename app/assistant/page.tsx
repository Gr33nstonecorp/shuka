"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

type Quote = {
  id: string;
  request_id: string;
  vendor_name: string;
  unit_price: number;
  shipping_cost: number;
  lead_time_days: number;
  ai_score: number;
  recommendation: string | null;
  status: string;
};

export default function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [bestQuote, setBestQuote] = useState<Quote | null>(null);

  async function handleAsk() {
    setResponse("Thinking...");
    setBestQuote(null);

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

    const evaluated = quotes.map((q: any) => {
      const total =
        Number(q.unit_price || 0) + Number(q.shipping_cost || 0);

      const score =
        (100 - total) +
        (100 - Number(q.lead_time_days || 0) * 5) +
        Number(q.ai_score || 0);

      return { ...q, total, score };
    });

    evaluated.sort((a, b) => b.score - a.score);

    const best = evaluated[0];
    setBestQuote(best);

    setResponse(
      `Recommended Vendor: ${best.vendor_name}

Total Cost: $${best.total}
Lead Time: ${best.lead_time_days} days
AI Score: ${best.ai_score}

Reason:
- Optimized for price + delivery speed
- Highest combined score among vendors`
    );
  }

  async function executeBestQuote() {
    if (!bestQuote) {
      setResponse("Ask Shuka first so I can choose the best quote.");
      return;
    }

    setResponse("Executing recommendation...");

    const totalAmount =
      Number(bestQuote.unit_price || 0) + Number(bestQuote.shipping_cost || 0);

    const { data: existingOrder, error: existingOrderError } = await supabase
      .from("purchase_orders")
      .select("id")
      .eq("quote_id", bestQuote.id)
      .maybeSingle();

    if (existingOrderError) {
      setResponse("Error checking existing order: " + existingOrderError.message);
      return;
    }

    if (existingOrder) {
      setResponse("An order already exists for this quote.");
      return;
    }

    const { error: updateError } = await supabase
      .from("quote_options")
      .update({ status: "approved" })
      .eq("id", bestQuote.id);

    if (updateError) {
      setResponse("Could not approve quote: " + updateError.message);
      return;
    }

    const { error: insertError } = await supabase
      .from("purchase_orders")
      .insert({
        request_id: bestQuote.request_id,
        quote_id: bestQuote.id,
        vendor_name: bestQuote.vendor_name,
        total_amount: totalAmount,
        status: "approved",
        shipment_status: "pending",
      });

    if (insertError) {
      setResponse("Could not create order: " + insertError.message);
      return;
    }

    setResponse(
      `Approved and created order with ${bestQuote.vendor_name} for $${totalAmount}.`
    );
    setBestQuote(null);
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

        <button
          onClick={executeBestQuote}
          style={{
            marginLeft: "10px",
            padding: "10px 16px",
            background: "#166534",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Execute Best Option
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
