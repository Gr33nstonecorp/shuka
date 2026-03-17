"use client";

import { useState } from "react";

type AssistantResult = {
  item: string;
  request_id?: string;
  error?: string;
  best_quote?: {
    vendor_name: string;
    total: number;
    lead_time_days: number;
    ai_score: number;
    product_url: string;
    status: string;
  };
};

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: data.error || "Something went wrong." },
        ]);
        setLoading(false);
        return;
      }

      const results: AssistantResult[] = data.results || [];

      if (results.length === 0) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "No items were processed." },
        ]);
        setLoading(false);
        return;
      }

      const response = results
        .map((r) => {
          if (r.error) {
            return `• ${r.item}\n  Error: ${r.error}`;
          }

          if (!r.best_quote) {
            return `• ${r.item}\n  No quote found.`;
          }

          return `• ${r.item}
  Best Vendor: ${r.best_quote.vendor_name}
  Total: $${r.best_quote.total}
  Lead Time: ${r.best_quote.lead_time_days} day(s)
  AI Score: ${r.best_quote.ai_score}
  Status: ${r.best_quote.status}
  Link: ${r.best_quote.product_url}`;
        })
        .join("\n\n");

      setMessages((prev) => [...prev, { role: "ai", content: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Something went wrong while processing your request.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: "16px" }}>
        <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 800 }}>
          AI Assistant
        </h1>
        <p style={{ color: "#6b7280", marginTop: "6px" }}>
          Enter one item per line and Shuka will create requests and source suppliers automatically.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          minHeight: "420px",
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: "#6b7280", whiteSpace: "pre-line" }}>
            Try:
            {"\n"}packing tape
            {"\n"}nitrile gloves
            {"\n"}barcode labels
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              background: msg.role === "user" ? "#111827" : "#f3f4f6",
              color: msg.role === "user" ? "white" : "#111827",
              padding: "12px 14px",
              borderRadius: "12px",
              whiteSpace: "pre-wrap",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{ color: "#6b7280", fontSize: "14px" }}>
            AI is creating requests and sourcing quotes...
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "10px",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Type one item per line...\npacking tape\nnitrile gloves\nbarcode labels"}
          rows={5}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: "12px 16px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 700,
            height: "fit-content",
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}
