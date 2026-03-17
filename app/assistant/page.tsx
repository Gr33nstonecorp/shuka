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
  product_url?: string | null;
};

export default function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [bestQuote, setBestQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!input.trim()) {
      setResponse("Type an item first.");
      return;
    }

    setLoading(true);
    setResponse("Thinking...");
    setBestQuote(null);

    let { data: quotes, error } = await supabase
      .from("quote_options")
      .select("*")
      .ilike("recommendation", `%${input}%`);

    if (error) {
      setResponse("Error loading quotes: " + error.message);
      setLoading(false);
      return;
    }

    if (!quotes || quotes.length === 0) {
      const { data: newRequest, error: requestError } = await supabase
        .from("purchase_requests")
        .insert({
          product: input,
          quantity: 50,
          category: "general",
          urgency: "normal",
          budget_cap: 0,
          status: "submitted",
        })
        .select()
        .single();

      if (requestError) {
        setResponse("Could not create request: " + requestError.message);
        setLoading(false);
        return;
      }

      const apiRes = await fetch("/api/generate-quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_id: newRequest.id,
          product_name: input,
          quantity: 50,
        }),
      });

      const apiJson = await apiRes.json().catch(() => ({}));

      if (!apiRes.ok) {
        setResponse(
          "Could not generate quotes: " + (apiJson.error || "Unknown error")
        );
        setLoading(false);
        return;
      }

      const refetch = await supabase
        .from("quote_options")
        .select("*")
        .eq("request_id", newRequest.id);

      if (refetch.error) {
        setResponse("Could not load generated quotes: " + refetch.error.message);
        setLoading(false);
        return;
      }

      quotes = refetch.data || [];
    }

    if (!quotes || quotes.length === 0) {
      setResponse("No quotes available.");
      setLoading(false);
      return;
    }

    const evaluated = (quotes as Quote[]).map((q) => {
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

    setLoading(false);
  }

  async function executeBestQuote() {
    if (!bestQuote) {
      setResponse("Ask Shuka first so I can choose the best quote.");
      return;
    }

    setLoading(true);
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
      setLoading(false);
      return;
    }

    if (existingOrder) {
      setResponse("An order already exists for this quote.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("quote_options")
      .update({ status: "approved" })
      .eq("id", bestQuote.id);

    if (updateError) {
      setResponse("Could not approve quote: " + updateError.message);
      setLoading(false);
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
      setLoading(false);
      return;
    }

    setResponse(
      `Approved and created order with ${bestQuote.vendor_name} for $${totalAmount}.`
    );
    setBestQuote(null);
    setLoading(false);
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>AI Assistant</h1>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Ask Shuka (e.g. paper towels)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "10px", width: "320px" }}
        />

        <button
          onClick={handleAsk}
          disabled={loading}
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
          disabled={loading}
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
