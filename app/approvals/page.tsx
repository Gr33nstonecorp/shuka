import { createClient } from "@supabase/supabase-js";

export default async function ApprovalsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: approvals, error } = await supabase
    .from("quote_options")
    .select("*")
    .eq("status", "generated")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: "32px" }}>
        <h1>Approvals</h1>
        <p>Error loading approvals: {error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>Approvals</h1>

      {!approvals || approvals.length === 0 ? (
        <p>No approvals pending.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
          {approvals.map((quote: any) => (
            <div
              key={quote.id}
              style={{
                background: "white",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #ddd",
              }}
            >
              <strong>{quote.vendor_name}</strong>
              <p>Unit price: ${quote.unit_price}</p>
              <p>Shipping: ${quote.shipping_cost}</p>
              <p>Lead time: {quote.lead_time_days} day(s)</p>
              <p>Status: {quote.status}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
