import { createClient } from "@supabase/supabase-js";

export default async function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [{ count: requestsCount }, { count: quotesCount }, { count: approvalsCount }, { count: ordersCount }] =
    await Promise.all([
      supabase.from("purchase_requests").select("*", { count: "exact", head: true }),
      supabase.from("quote_options").select("*", { count: "exact", head: true }),
      supabase.from("quote_options").select("*", { count: "exact", head: true }).eq("status", "generated"),
      supabase.from("purchase_orders").select("*", { count: "exact", head: true }),
    ]);

  return (
    <main style={{ padding: "32px" }}>
      <h1>AI Assistant</h1>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginTop: "20px",
        }}
      >
        <p><strong>Open Requests:</strong> {requestsCount ?? 0}</p>
        <p><strong>Total Quotes:</strong> {quotesCount ?? 0}</p>
        <p><strong>Pending Approvals:</strong> {approvalsCount ?? 0}</p>
        <p><strong>Orders Created:</strong> {ordersCount ?? 0}</p>

        <hr style={{ margin: "20px 0" }} />

        <p>
          Shuka AI summary: monitor incoming requests, compare vendor quotes,
          route quote options for approval, and convert approved quotes into orders.
        </p>
      </div>
    </main>
  );
}
