import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import StatusBadge from "../components/StatusBadge";

type QuoteOption = {
  id: string;
  vendor_name: string | null;
  status: string | null;
  unit_price: number | null;
  shipping_cost: number | null;
  lead_time_days: number | null;
  ai_score: number | null;
  recommendation: string | null;
  product_url: string | null;
  created_at: string | null;
};

function formatMoney(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export default async function QuotesPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("quote_options")
    .select("*")
    .order("created_at", { ascending: false });

  const quotes = (data || []) as QuoteOption[];

  return (
    <main style={pageWrap}>
      <header style={headerStyle}>
        <div style={headerInner}>
          <Link href="/" style={brandLink}>
            ShukAI
          </Link>

          <nav style={topNav}>
            <Link href="/requests" style={navLink}>
              Requests
            </Link>
            <Link href="/quotes" style={navLinkActive}>
              Quotes
            </Link>
            <Link href="/orders" style={navLink}>
              Orders
            </Link>
            <Link href="/vendors" style={navLink}>
              Vendors
            </Link>
            <Link href="/saved-items" style={navLink}>
              Saved Items
            </Link>
            <Link href="/assistant" style={navLink}>
              AI Assistant
            </Link>
            <Link href="/pricing" style={navLink}>
              Pricing
            </Link>
            <Link href="/profile" style={ghostButtonLink}>
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <section style={contentWrap}>
        <div style={contentInner}>
          <div style={titleRow}>
            <div>
              <h1 style={pageTitle}>Quotes</h1>
              <p style={pageSubtitle}>
                Compare sourcing options and jump directly to suppliers.
              </p>
            </div>

            <div style={titleActions}>
              <Link href="/requests" style={secondaryLinkButton}>
                New Request
              </Link>
              <Link href="/assistant" style={primaryLinkButton}>
                Open AI Assistant
              </Link>
            </div>
          </div>

          {error ? (
            <div style={errorCard}>
              <div style={errorTitle}>Could not load quotes</div>
              <div style={errorText}>{error.message}</div>
            </div>
          ) : quotes.length === 0 ? (
            <div style={emptyCard}>
              <div style={emptyTitle}>No quotes found yet</div>
              <div style={emptyText}>
                Create a purchase request first, then generated quote options will
                show up here.
              </div>
              <div style={{ marginTop: "16px" }}>
                <Link href="/requests" style={primaryLinkButton}>
                  Create Request
                </Link>
              </div>
            </div>
          ) : (
            <div style={quotesGrid}>
              {quotes.map((quote) => (
                <article key={quote.id} style={quoteCard}>
                  <div style={quoteHeader}>
                    <div>
                      <div style={vendorName}>
                        {quote.vendor_name || "Unnamed Vendor"}
                      </div>
                      <div style={createdText}>
                        Added: {formatDate(quote.created_at)}
                      </div>
                    </div>

                    <StatusBadge label={quote.status || "unknown"} />
                  </div>

                  <div style={metricsGrid}>
                    <Metric
                      label="Unit Price"
                      value={formatMoney(quote.unit_price)}
                    />
                    <Metric
                      label="Shipping"
                      value={formatMoney(quote.shipping_cost)}
                    />
                    <Metric
                      label="Lead Time"
                      value={
                        quote.lead_time_days != null
                          ? `${quote.lead_time_days} day(s)`
                          : "—"
                      }
                    />
                    <Metric
                      label="AI Score"
                      value={
                        quote.ai_score != null ? String(quote.ai_score) : "—"
                      }
                    />
                  </div>

                  <div style={totalRow}>
                    <span style={totalLabel}>Estimated Total</span>
                    <span style={totalValue}>
                      {formatMoney(
                        Number(quote.unit_price ?? 0) +
                          Number(quote.shipping_cost ?? 0)
                      )}
                    </span>
                  </div>

                  {quote.recommendation ? (
                    <div style={recommendationBox}>
                      <div style={recommendationTitle}>Recommendation</div>
                      <div style={recommendationText}>
                        {quote.recommendation}
                      </div>
                    </div>
                  ) : null}

                  <div style={cardActions}>
                    {quote.product_url ? (
                      <a
                        href={quote.product_url}
                        target="_blank"
                        rel="noreferrer"
                        style={primaryAnchorButton}
                      >
                        Open Vendor
                      </a>
                    ) : (
                      <div style={mutedNote}>
                        No vendor link on this quote yet.
                      </div>
                    )}

                    <Link href="/requests" style={secondaryLinkButton}>
                      Back to Requests
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={metricCard}>
      <div style={metricLabel}>{label}</div>
      <div style={metricValue}>{value}</div>
    </div>
  );
}

const pageWrap: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f3f4f6",
  color: "#111827",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const headerStyle: React.CSSProperties = {
  background: "#0b1220",
  color: "white",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const headerInner: React.CSSProperties = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const brandLink: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 900,
  color: "white",
  textDecoration: "none",
};

const topNav: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const navLink: React.CSSProperties = {
  color: "#cbd5e1",
  textDecoration: "none",
  fontWeight: 600,
};

const navLinkActive: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontWeight: 700,
};

const ghostButtonLink: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  fontWeight: 700,
};

const contentWrap: React.CSSProperties = {
  padding: "28px 0 80px",
};

const contentInner: React.CSSProperties = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "0 20px",
};

const titleRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "24px",
};

const pageTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "32px",
  fontWeight: 800,
};

const pageSubtitle: React.CSSProperties = {
  color: "#6b7280",
  marginTop: "8px",
};

const titleActions: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const quotesGrid: React.CSSProperties = {
  display: "grid",
  gap: "18px",
};

const quoteCard: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
};

const quoteHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const vendorName: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 800,
};

const createdText: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
  marginTop: "6px",
};

const metricsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "12px",
  marginTop: "16px",
};

const metricCard: React.CSSProperties = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "14px",
};

const metricLabel: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
};

const metricValue: React.CSSProperties = {
  fontWeight: 700,
  marginTop: "6px",
};

const totalRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "16px",
  padding: "14px 0",
  borderTop: "1px solid #e5e7eb",
  borderBottom: "1px solid #e5e7eb",
  gap: "12px",
  flexWrap: "wrap",
};

const totalLabel: React.CSSProperties = {
  color: "#4b5563",
  fontWeight: 700,
};

const totalValue: React.CSSProperties = {
  fontWeight: 900,
  fontSize: "20px",
};

const recommendationBox: React.CSSProperties = {
  marginTop: "16px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "14px",
  padding: "14px",
};

const recommendationTitle: React.CSSProperties = {
  fontWeight: 800,
  color: "#1d4ed8",
  marginBottom: "6px",
};

const recommendationText: React.CSSProperties = {
  color: "#374151",
  lineHeight: 1.7,
};

const cardActions: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  alignItems: "center",
  marginTop: "16px",
};

const primaryAnchorButton: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  background: "#2563eb",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 700,
};

const primaryLinkButton: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  background: "#111827",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryLinkButton: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  background: "white",
  color: "#111827",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid #d1d5db",
};

const mutedNote: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "14px",
};

const emptyCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
};

const emptyTitle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 800,
};

const emptyText: React.CSSProperties = {
  color: "#6b7280",
  marginTop: "8px",
  lineHeight: 1.7,
};

const errorCard: React.CSSProperties = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "16px",
  padding: "20px",
};

const errorTitle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
  color: "#991b1b",
};

const errorText: React.CSSProperties = {
  color: "#b91c1c",
  marginTop: "8px",
  lineHeight: 1.6,
};
