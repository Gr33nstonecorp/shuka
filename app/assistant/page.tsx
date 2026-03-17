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

type ChatMessage =
  | { role: "user"; content: string }
  | { role: "ai"; results: AssistantResult[] }
  | { role: "ai"; content: string };

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

      setMessages((prev) => [...prev, { role: "ai", results: data.results || [] }]);
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
          Type multiple items separated by commas or one item per line.
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
            {"\n"}packing tape, nitrile gloves, barcode labels
            {"\n\n"}or
            {"\n"}packing tape
            {"\n"}nitrile gloves
            {"\n"}barcode labels
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <div
              key={i}
              style={{
                alignSelf: "flex-end",
                maxWidth: "85%",
                background: "#111827",
                color: "white",
                padding: "12px 14px",
                borderRadius: "12px",
                whiteSpace: "pre-wrap",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {msg.content}
            </div>
          ) : "results" in msg ? (
            <div
              key={i}
              style={{
                alignSelf: "flex-start",
                width: "100%",
                display: "grid",
                gap: "12px",
              }}
            >
              {msg.results.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#f3f4f6",
                    borderRadius: "14px",
                    padding: "14px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "8px" }}>
                    {r.item}
                  </div>

                  {r.error ? (
                    <div style={{ color: "#b91c1c" }}>{r.error}</div>
                  ) : r.best_quote ? (
                    <>
                      <div style={{ color: "#374151", lineHeight: 1.7 }}>
                        <div><strong>Best Vendor:</strong> {r.best_quote.vendor_name}</div>
                        <div><strong>Total:</strong> ${r.best_quote.total}</div>
                        <div><strong>Lead Time:</strong> {r.best_quote.lead_time_days} day(s)</div>
                        <div><strong>AI Score:</strong> {r.best_quote.ai_score}</div>
                        <div><strong>Status:</strong> {r.best_quote.status}</div>
                      </div>

                      <a
                        href={r.best_quote.product_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: "10px",
                          padding: "10px 14px",
                          background: "#2563eb",
                          color: "white",
                          borderRadius: "8px",
                          textDecoration: "none",
                          fontWeight: 700,
                        }}
                      >
                        Open Vendor
                      </a>
                    </>
                  ) : (
                    <div>No quote found.</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              key={i}
              style={{
                alignSelf: "flex-start",
                maxWidth: "85%",
                background: "#f3f4f6",
                color: "#111827",
                padding: "12px 14px",
                borderRadius: "12px",
                whiteSpace: "pre-wrap",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {msg.content}
            </div>
          )
        )}

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
          alignItems: "stretch",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Type multiple items...\npacking tape, nitrile gloves, barcode scanner"}
          rows={5}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            resize: "vertical",
            fontFamily: "inherit",
            fontSize: "16px",
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
            minWidth: "90px",
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}
