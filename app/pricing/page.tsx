export default function PricingPage() {
  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>
          Pricing
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Start with a 7-day free trial, then choose the plan that fits your workflow.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "18px",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              borderRadius: "999px",
              background: "#fef3c7",
              color: "#92400e",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            Included after trial
          </div>

          <h2 style={{ marginTop: 0, marginBottom: "8px" }}>Starter</h2>
          <div style={{ fontSize: "34px", fontWeight: 800 }}>$9/mo</div>

          <ul style={{ color: "#4b5563", lineHeight: 1.8, paddingLeft: "18px" }}>
            <li>Create requests</li>
            <li>Generate quotes</li>
            <li>Compare vendors</li>
            <li>Manual approvals</li>
            <li>Orders and saved items</li>
            <li>Basic AI assistant</li>
          </ul>
        </div>

        <div
          style={{
            background: "white",
            border: "2px solid #2563eb",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              borderRadius: "999px",
              background: "#dbeafe",
              color: "#1d4ed8",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            Premium
          </div>

          <h2 style={{ marginTop: 0, marginBottom: "8px" }}>Premium</h2>
          <div style={{ fontSize: "34px", fontWeight: 800 }}>$25/mo</div>

          <ul style={{ color: "#4b5563", lineHeight: 1.8, paddingLeft: "18px" }}>
            <li>Everything in Starter</li>
            <li>AI multi-item sourcing</li>
            <li>Smarter vendor ranking</li>
            <li>Automation features</li>
            <li>Preferred vendor logic</li>
            <li>Future premium workflows</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
