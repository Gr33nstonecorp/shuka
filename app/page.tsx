import { createClient } from "@supabase/supabase-js";

function MetricCard({
  title,
  value,
  note,
}: {
  title: string;
  value: number;
  note: string;
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ fontSize: "34px", fontWeight: 800, marginTop: "10px" }}>
        {value}
      </div>
      <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px" }}>
        {note}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { count: requestsCount },
    { count: quotesCount },
    { count: approvalsCount },
    { count: ordersCount },
  ] = await Promise.all([
    supabase.from("purchase_requests").select("*", { count: "exact", head: true }),
    supabase.from("quote_options").select("*", { count: "exact", head: true }),
    supabase
      .from("quote_options")
      .select("*", { count: "exact", head: true })
      .eq("status", "generated"),
    supabase.from("purchase_orders").select("*", { count: "exact", head: true }),
  ]);

  return (
    <main>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "34px", fontWeight: 800 }}>
          Procurement Command Center
        </h1>
        <p style={{ color: "#6b7280", fontSize: "16px", marginTop: "8px" }}>
          AI-powered sourcing, approvals, and order orchestration.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
        }}
      >
        <MetricCard
          title="Open Requests"
          value={requestsCount ?? 0}
          note="Requests waiting for sourcing"
        />
        <MetricCard
          title="Total Quotes"
          value={quotesCount ?? 0}
          note="Vendor options generated"
        />
        <MetricCard
          title="Pending Approvals"
          value={approvalsCount ?? 0}
          note="Needs human review"
        />
        <MetricCard
          title="Orders Created"
          value={ordersCount ?? 0}
          note="Approved procurement orders"
        />
      </div>

      <div
        style={{
          marginTop: "24px",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "22px",
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "10px" }}>What to do next</h2>
        <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
          Review pending approvals, compare live vendor links, and let Shuka
          recommend the strongest supplier based on cost, lead time, and AI score.
        </p>
      </div>
    </main>
  );
}
