import { createClient } from "@supabase/supabase-js";

export default async function ApprovalsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: approvals } = await supabase
    .from("quote_options")
    .select("*")
    .eq("status", "generated");

  return (
    <main style={{ padding: "32px" }}>
      <h1>Approvals</h1>

      {!approvals || approvals.length === 0 ? (
        <p>No approvals pending.</p>
      ) : (
        approvals.map((quote: any) => (
          <div key={quote.id} style={{ marginBottom: "16px" }}>
            <strong>{quote.vendor_name}</strong>
            <p>Unit price: ${quote.unit_price}</p>
          </div>
        ))
      )}
    </main>
  );
}
