"use client";

import { useState } from "react";

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate-quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: input,
          quantity: 1,
        }),
      });

      const data = await res.json();

      let aiResponse = "";

      if (data?.quotes?.length > 0) {
        aiResponse =
          "Here are the best supplier options:\n\n" +
          data.quotes
            .map(
              (q: any) =>
                `• ${q.vendor_name} — $${q.price}\n${q.product_url}`
            )
            .join("\n\n");
      } else {
        aiResponse = "No quotes found. Try a different product.";
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: aiResponse },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Something went wrong while fetching quotes.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "16px" }}>
        <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 800 }}>
          AI Assistant
        </h1>
        <p style={{ color: "#6b7280", marginTop: "6px" }}>
          Ask Shuka to find suppliers, compare prices, and optimize purchases.
        </p>
      </div>

      {/* CHAT BOX */}
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
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: "#6b7280" }}>
            Try: "Find cheapest packing tape" or "bulk gloves supplier"
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              background:
                msg.role === "user" ? "#111827" : "#f3f4f6",
              color: msg.role === "user" ? "white" : "#111827",
              padding: "12px 14px",
              borderRadius: "12px",
              whiteSpace: "pre-wrap",
              fontSize: "14px",
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{ color: "#6b7280", fontSize: "14px" }}>
            AI is thinking...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a product request..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
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
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}
