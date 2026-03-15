"use client";

import { useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

const starterMessages: Message[] = [
  {
    role: "ai",
    text: "Hi, I’m Shuka AI. I can help monitor stock, suggest reorders, compare vendors, and draft purchase orders for approval.",
  },
];

function getAiResponse(input: string): string {
  const text = input.toLowerCase();

  if (text.includes("low stock") || text.includes("what is low")) {
    return "Low-stock items detected: Packing Tape (12 units, reorder point 25) and Barcode Labels (5 units, reorder point 50). I recommend prioritizing Barcode Labels first because they are below 10% of target.";
  }

  if (text.includes("reorder") || text.includes("what should we reorder")) {
    return "Recommended reorders: 50 units of Packing Tape from Uline and 100 units of Barcode Labels from Amazon Business. Both orders should go to approval before submission.";
  }

  if (text.includes("vendor") || text.includes("best supplier")) {
    return "For general consumables, Amazon Business is the preferred procurement channel. For packaging materials, Uline is a strong approved vendor with reliable lead times.";
  }

  if (text.includes("purchase order") || text.includes("po")) {
    return "I can draft purchase orders based on low-stock thresholds. Current draft candidates: PO for Barcode Labels and PO for Packing Tape. Both are awaiting approval.";
  }

  if (text.includes("receiving") || text.includes("shipment")) {
    return "Two shipments are marked as delivered and ready for warehouse confirmation. Once confirmed, inventory should be updated automatically.";
  }

  if (text.includes("approval") || text.includes("approve")) {
    return "Approval policy is active. Orders above company thresholds or from non-primary vendors require human review before submission.";
  }

  return "I can help with low stock analysis, reorder suggestions, vendor selection, purchase order drafts, receiving updates, and approval workflows. Try asking: 'What should we reorder?'";
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    const aiMessage: Message = { role: "ai", text: getAiResponse(input) };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  }

  return (
    <main style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>AI Assistant</h1>
      <p>
        Ask Shuka AI about stock levels, reorder suggestions, vendors, purchase
        orders, shipments, and approval rules.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #ddd",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            minHeight: "420px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Conversation</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: msg.role === "user" ? "#111827" : "#f3f4f6",
                  color: msg.role === "user" ? "white" : "black",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "12px 18px",
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #ddd",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Suggested Prompts</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "What items are low on stock?",
                "What should we reorder today?",
                "Which vendor is best for labels?",
                "What purchase orders need approval?",
                "What shipments arrived today?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    background: "#f9fafb",
                    cursor: "pointer",
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #ddd",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>AI Capabilities</h3>
            <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
              <li>Low-stock analysis</li>
              <li>Reorder recommendations</li>
              <li>Vendor guidance</li>
              <li>PO drafting support</li>
              <li>Shipment visibility</li>
              <li>Approval rule reminders</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
