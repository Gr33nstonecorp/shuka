import { createClient } from "@supabase/supabase-js";
import StatusBadge from "../components/StatusBadge";

export default async function QuotesPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: quotes, error } = await supabase
    .from("quote_options")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: "8px" }}>
        <h1>Quotes</h1>
        <p>Error loading quotes: {error.message}</p>
      </main>
    );
  }

  return (
    <main>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>Quotes</h1>
        <p style={{ color: "#6b7280" }}>
          Compare sourcing options and jump directly to suppliers.
        </p>
      </div>

      {!quotes || quotes.length === 0 ? (
        <p>No quotes found.</p>
      ) : (
        <div style={{ display: "grid", gap: "18px" }}>
          {quotes.map((quote: any) => (
            <div
              key={quote.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <strong style={{ fontSize: "18px" }}>{quote.vendor_name}</strong>
                <StatusBadge label={quote.status} />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "12px",
                  marginTop: "16px",
                }}
              >
                <div>
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>Unit Price</div>
                  <div style={{ fontWeight: 700 }}>${quote.unit_price}</div>
                </div>
                <div>
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>Shipping</div>
                  <div style={{ fontWeight: 700 }}>${quote.shipping_cost}</div>
                </div>
                <div>
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>Lead Time</div>
                  <div style={{ fontWeight: 700 }}>{quote.lead_time_days} day(s)</div>
                </div>
                <div>
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>AI Score</div>
                  <div style={{ fontWeight: 700 }}>{quote.ai_score}</div>
                </div>
              </div>

              {quote.recommendation && (
                <p style={{ marginTop: "14px", color: "#4b5563" }}>
                  {quote.recommendation}
                </p>
              )}

              {quote.product_url ? (
                <a
                  href={quote.product_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    padding: "10px 14px",
                    background: "#2563eb",
                    color: "white",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Open Vendor
                </a>
              ) : (
                <p style={{ color: "#6b7280", marginTop: "10px" }}>
                  No vendor link on this quote yet.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
