"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

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

export default function ApprovalsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [message, setMessage] = useState("");

  async function loadQuotes() {
    setMessage("");

    const { data, error } = await supabase
      .from("quote_options")
      .select("*")
      .eq("status", "generated")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading approvals: " + error.message);
      return;
    }

    setQuotes((data as Quote[]) || []);
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  async function approveQuote(quote: Quote) {
    setMessage("");

    const totalAmount =
      Number(quote.unit_price || 0) + Number(quote.shipping_cost || 0);

    // Prevent duplicate order creation for same quote
    const { data: existingOrder, error: existingOrderError } = await supabase
      .from("purchase_orders")
      .select("id")
      .eq("quote_id", quote.id)
      .maybeSingle();

    if (existingOrderError) {
      setMessage("Error checking existing order: " + existingOrderError.message);
      return;
    }

    if (existingOrder) {
      setMessage("Order already exists for this quote.");
      return;
    }

    // Create order first
    const { error: insertError } = await supabase.from("purchase_orders").insert({
      request_id: quote.request_id,
      quote_id: quote.id,
      vendor_name: quote.vendor_name,
      total_amount: totalAmount,
      status: "approved",
      shipment_status: "pending",
    });

    if (insertError) {
      setMessage("Error creating order: " + insertError.message);
      return;
    }

    // Mark quote approved
    const { error: updateError } = await supabase
      .from("quote_options")
      .update({ status: "approved" })
      .eq("id", quote.id);

    if (updateError) {
      setMessage("Order created, but quote update failed: " + updateError.message);
      return;
    }

    setMessage("Approved and order created.");
    loadQuotes();
  }

  async function rejectQuote(quote: Quote) {
    setMessage("");

    const { error } = await supabase
      .from("quote_options")
      .update({ status: "rejected" })
      .eq("id", quote.id);

    if (error) {
      setMessage("Error rejecting quote: " + error.message);
      return;
    }

    setMessage("Quote rejected.");
    loadQuotes();
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>Approvals</h1>

      {message && <p style={{ marginTop: "12px" }}>{message}</p>}

      {quotes.length === 0 ? (
        <p style={{ marginTop: "20px" }}>No approvals pending.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
          {quotes.map((quote) => (
            <div
              key={quote.id}
              style={{
                background: "white",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #ddd",
              }}
            >
              <strong>{quote.vendor_name}</strong>
              <p>Unit price: ${quote.unit_price}</p>
              <p>Shipping: ${quote.shipping_cost}</p>
              <p>Lead time: {quote.lead_time_days} day(s)</p>
              <p>AI score: {quote.ai_score}</p>
              <p>Status: {quote.status}</p>
              {quote.recommendation && <p>Recommendation: {quote.recommendation}</p>}

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  onClick={() => approveQuote(quote)}
                  style={{
                    padding: "10px 14px",
                    background: "black",
                    color: "white",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectQuote(quote)}
                  style={{
                    padding: "10px 14px",
                    background: "#ddd",
                    color: "black",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
