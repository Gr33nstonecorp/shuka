"use client";

import { useState } from "react";
import { inventoryItems, vendors, purchaseOrders, shipments } from "../data/mockData";

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

function buildAiResponse(input: string): string {
  const text = input.toLowerCase();

  const lowStock = inventoryItems.filter(
    (item) => item.quantity <= item.reorderPoint
  );

  const criticalStock = inventoryItems.filter(
    (item) => item.quantity <= item.reorderPoint / 2
  );

  const awaitingApproval = purchaseOrders.filter(
    (order) => order.status === "Awaiting Approval"
  );

  const deliveredShipments = shipments.filter(
    (shipment) => shipment.status === "Delivered"
  );

  if (text.includes("low stock") || text.includes("what is low")) {
    if (lowStock.length === 0) return "No low-stock items detected right now.";

    return `Low-stock items: ${lowStock
      .map((item) => `${item.name} (${item.quantity} on hand, reorder point ${item.reorderPoint})`)
      .join("; ")}.`;
  }

  if (text.includes("critical")) {
    if (criticalStock.length === 0) return "No critical inventory items right now.";

    return `Critical items: ${criticalStock
      .map((item) => `${item.name} (${item.quantity} units)`)
      .join("; ")}.`;
  }

  if (text.includes("reorder")) {
    if (lowStock.length === 0) return "No reorder action needed right now.";

    return `Recommended reorders: ${lowStock
      .map((item) => {
        const suggestedQty = Math.max(item.reorderPoint * 2 - item.quantity, item.reorderPoint);
        return `${suggestedQty} units of ${item.name} from ${item.vendor}`;
      })
      .join("; ")}.`;
  }

  if (text.includes("vendor") || text.includes("supplier")) {
    const approvedVendors = vendors.filter((vendor) => vendor.approved === "Yes");
    return `Approved vendors: ${approvedVendors
      .map((vendor) => `${vendor.name} (${vendor.integration})`)
      .join("; ")}.`;
  }

  if (text.includes("approval") || text.includes("approve") || text.includes("purchase order") || text.includes("po")) {
    if (awaitingApproval.length === 0) return "There are no purchase orders awaiting approval.";

    return `Purchase orders awaiting approval: ${awaitingApproval
      .map((order) => `${order.po} with ${order.vendor} for $${order.total.toFixed(2)}`)
      .join("; ")}.`;
  }

  if (text.includes("shipment") || text.includes("receiving") || text.includes("delivered")) {
    if (deliveredShipments.length === 0) return "No delivered shipments are waiting for receiving.";

    return `Delivered shipments ready for receiving: ${deliveredShipments
      .map((shipment) => `${shipment.po} from ${shipment.vendor}`)
      .join("; ")}.`;
  }

  return "I can answer questions about low stock, critical items, reorder suggestions, vendors, approvals, and receiving. Try asking: What should we reorder today?";
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    const aiMessage: Message = { role: "ai", text: buildAiResponse(input) };

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

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                "What items are critical?",
                "What should we reorder today?",
                "Which vendors are approved?",
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
            <h3 style={{ marginTop: 0 }}>Live Data Sources</h3>
            <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
              <li>Inventory items</li>
              <li>Vendor list</li>
              <li>Purchase orders</li>
              <li>Receiving shipments</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
