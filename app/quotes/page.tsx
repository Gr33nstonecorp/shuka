import { createClient } from "@supabase/supabase-js";

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
      <main style={{ padding: "32px" }}>
        <h1>Quotes</h1>
        <p>Error loading quotes: {error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>Quotes</h1>

      {!quotes || quotes.length === 0 ? (
        <p>No quotes found.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
          {quotes.map((quote: any) => (
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
              <p>AI score: {quote.ai_score}</p>
              <p>Status: {quote.status}</p>
              {quote.recommendation && <p>Recommendation: {quote.recommendation}</p>}

              {quote.product_url && (
                <a
                  href={quote.product_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    padding: "8px 12px",
                    background: "#2563eb",
                    color: "white",
                    borderRadius: "6px",
                    textDecoration: "none",
                  }}
                >
                  Open Vendor
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
