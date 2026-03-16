"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function ApprovalsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [quotes, setQuotes] = useState<any[]>([]);

  async function loadData() {
    const { data } = await supabase
      .from("quote_options")
      .select("*")
      .eq("status", "generated");

    setQuotes(data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function approveQuote(quote: any) {
    // 1. update quote status
    await supabase
      .from("quote_options")
      .update({ status: "approved" })
      .eq("id", quote.id);

    // 2. create order
    await supabase.from("purchase_orders").insert({
      vendor_name: quote.vendor_name,
      total_amount:
        (quote.unit_price || 0) + (quote.shipping_cost || 0),
      status: "created",
      shipment_status: "pending",
    });

    // reload
    loadData();
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>Approvals</h1>

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

              <button
                onClick={() => approveQuote(quote)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  background: "black",
                  color: "white",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ✅ Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
