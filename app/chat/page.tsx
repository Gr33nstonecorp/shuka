"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi, I’m Shuka AI. Ask me about tools in the marketplace." },
  ]);
  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const aiMessage = {
      role: "ai",
      text: `You asked: "${input}". Full AI chat logic can be connected next.`,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  }

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Shuka Chat</h1>
      <p style={{ marginBottom: "20px" }}>
        Talk to AI agents and explore marketplace tools.
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          minHeight: "350px",
          background: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          marginBottom: "20px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "14px",
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: "12px",
                background: msg.role === "user" ? "#111" : "#f1f1f1",
                color: msg.role === "user" ? "white" : "black",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Shuka AI something..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}
