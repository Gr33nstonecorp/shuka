"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function ApprovalsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadQuotes() {
    const { data } = await supabase
      .from("quote_options")
      .select("*")
      .eq("status", "generated")
      .order("price", { ascending: true });

    setQuotes(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  async function approveQuote(quote: any) {
    await supabase
      .from("quote_options")
      .update({ status: "approved" })
      .eq("id", quote.id);

    await supabase.from("purchase_orders").insert({
      request_id: quote.request_id,
      vendor_name: quote.vendor_name,
      product_name: quote.product_name,
      price: quote.price,
      quantity: quote.quantity,
      product_url: quote.product_url,
      status: "ordered",
    });

    loadQuotes();
  }

  async function rejectQuote(id: string) {
    await supabase
      .from("quote_options")
      .update({ status: "rejected" })
      .eq("id", id);

    loadQuotes();
  }

  return (
    <main>
      {/* HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>
          Approvals
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Review AI-generated supplier quotes and approve purchases.
        </p>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div>Loading quotes...</div>
      ) : quotes.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {quotes.map((q) => (
            <QuoteCard
              key={q.id}
              quote={q}
              onApprove={() => approveQuote(q)}
              onReject={() => rejectQuote(q.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

/* ===================== COMPONENTS ===================== */

function QuoteCard({
  quote,
  onApprove,
  onReject,
}: {
  quote: any;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
      }}
    >
      {/* TOP */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: "18px" }}>
            {quote.product_name}
          </div>
          <div style={{ color: "#6b7280", fontSize: "14px" }}>
            Vendor: {quote.vendor_name}
          </div>
        </div>

        <div
          style={{
            fontSize: "20px",
            fontWeight: 800,
          }}
        >
          ${quote.price}
        </div>
      </div>

      {/* DETAILS */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          fontSize: "14px",
          color: "#4b5563",
        }}
      >
        <span>Qty: {quote.quantity}</span>
        <span>Total: ${quote.price * quote.quantity}</span>
      </div>

      {/* LINK */}
      {quote.product_url && (
        <a
          href={quote.product_url}
          target="_blank"
          style={{
            display: "inline-block",
            marginTop: "12px",
            color: "#2563eb",
            fontSize: "14px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          View Supplier →
        </a>
      )}

      {/* ACTIONS */}
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={onApprove}
          style={{
            padding: "10px 14px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Approve
        </button>

        <button
          onClick={onReject}
          style={{
            padding: "10px 14px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        textAlign: "center",
        color: "#6b7280",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: 700 }}>
        No quotes pending approval
      </div>
      <p style={{ marginTop: "6px" }}>
        Submit a request and let AI generate supplier quotes.
      </p>
    </div>
  );
}
