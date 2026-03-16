"use client";

import { useState } from "react";

type FormState = {
  product: string;
  quantity: string;
  category: string;
  urgency: string;
  budgetCap: string;
  preferredVendor: string;
  deadline: string;
  notes: string;
};

const initialState: FormState = {
  product: "",
  quantity: "",
  category: "Warehouse Supplies",
  urgency: "Normal",
  budgetCap: "",
  preferredVendor: "",
  deadline: "",
  notes: "",
};

export default function RequestsPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: form.product,
        quantity: Number(form.quantity),
        category: form.category,
        urgency: form.urgency,
        budget_cap: Number(form.budgetCap || 0),
        preferred_vendor: form.preferredVendor || null,
        deadline: form.deadline || null,
        notes: form.notes || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setStatus(data?.error || "Failed to create request.");
      return;
    }

    setForm(initialState);
    setStatus("Request submitted.");
  }

  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Purchase Requests</h1>
      <p>Submit a company request and let Shuka generate vendor options.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "24px",
          display: "grid",
          gap: "18px",
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <input
          value={form.product}
          onChange={(e) => setForm({ ...form, product: e.target.value })}
          placeholder="Product Needed"
          required
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <input
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="Quantity"
          required
          min={1}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <option>Warehouse Supplies</option>
          <option>Packaging</option>
          <option>Safety Equipment</option>
          <option>Labels & Printing</option>
          <option>Maintenance</option>
          <option>Other</option>
        </select>

        <select
          value={form.urgency}
          onChange={(e) => setForm({ ...form, urgency: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <option>Low</option>
          <option>Normal</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <input
          type="number"
          value={form.budgetCap}
          onChange={(e) => setForm({ ...form, budgetCap: e.target.value })}
          placeholder="Budget Cap"
          min={0}
          step="0.01"
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <input
          value={form.preferredVendor}
          onChange={(e) => setForm({ ...form, preferredVendor: e.target.value })}
          placeholder="Preferred Vendor"
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={5}
          placeholder="Notes"
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <button
          type="submit"
          style={{
            padding: "14px 20px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Submit Request
        </button>

        {status && <p style={{ margin: 0 }}>{status}</p>}
      </form>
    </main>
  );
}
