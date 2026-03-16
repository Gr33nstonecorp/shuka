import { getSupabaseServer } from "../lib/supabaseServer";

export default async function DashboardPage() {
  const supabase = getSupabaseServer();

  const [{ count: requestsCount }, { count: quotesCount }, { count: approvalsCount }, { count: ordersCount }] =
    await Promise.all([
      supabase.from("purchase_requests").select("*", { count: "exact", head: true }),
      supabase.from("quote_options").select("*", { count: "exact", head: true }),
      supabase.from("quote_options").select("*", { count: "exact", head: true }).eq("status", "pending_approval"),
      supabase.from("purchase_orders").select("*", { count: "exact", head: true }),
    ]);

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0, fontSize: "36px" }}>Procurement Command Center</h1>
      <p style={{ fontSize: "18px", color: "#444" }}>
        Shuka helps AI agents source products, compare vendors, route approvals, and create purchase orders.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {[
          { title: "Requests", value: requestsCount ?? 0, note: "Open sourcing requests" },
          { title: "Quotes", value: quotesCount ?? 0, note: "Vendor options generated" },
          { title: "Pending Approvals", value: approvalsCount ?? 0, note: "Needs manager decision" },
          { title: "Orders", value: ordersCount ?? 0, note: "Approved purchase orders" },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              border: "1px solid #ddd",
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: "18px" }}>{card.title}</h2>
            <div style={{ fontSize: "34px", fontWeight: "bold", margin: "10px 0" }}>
              {card.value}
            </div>
            <p style={{ marginBottom: 0, color: "#666" }}>{card.note}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
