"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function ApprovalsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [quotes, setQuotes] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  async function loadData() {
    const { data, error } = await supabase
      .from("quote_options")
      .select("*")
      .eq("status", "generated")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setQuotes(data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function approveQuote(quote: any) {
    setMessage("");

    const { error: updateError } = await supabase
      .from("quote_options")
      .update({ status: "approved" })
      .eq("id", quote.id);

    if (updateError) {
      setMessage(`Quote update failed: ${updateError.message}`);
      return;
    }

    const { error: insertError } = await supabase
      .from("purchase_orders")
      .insert({
        request_id: quote.request_id,
        quote_id: quote.id,
        vendor_name: quote.vendor_name,
        total_amount: Number(quote.unit_price || 0) + Number(quote.shipping_cost || 0),
        status: "approved",
        shipment_status: "pending",
      });

    if (insertError) {
      setMessage(`Order insert failed: ${insertError.message}`);
      return;
    }

    setMessage("Quote approved and order created.");
    loadData();
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>Approvals</h1>

      {message && <p>{message}</p>}

      {quotes.length === 0 ? (
        <p>No approvals pending.</p>
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
              <p>Lead time: {quote.lead_time_days} days</p>
              <p>Request ID: {quote.request_id}</p>

              <button
                onClick={() => approveQuote(quote)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  background: "black",
                  color: "white",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
