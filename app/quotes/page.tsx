"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import StatusBadge from "../components/StatusBadge";
import { useEffect, useMemo, useState } from "react";

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
  request_id: string | null;
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

export default function QuotesPage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [quotes, setQuotes] = useState<QuoteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  async function loadQuotes() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("quote_options")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Could not load quotes: " + error.message);
      setQuotes([]);
      setLoading(false);
      return;
    }

    setQuotes((data || []) as QuoteOption[]);
    setLoading(false);
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  async function approveQuote(quoteId: string) {
    setApprovingId(quoteId);
    setMessage("");

    try {
      const res = await fetch("/api/approve-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quote_id: quoteId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.error || "Failed to approve quote.");
        setApprovingId(null);
        return;
      }

      setMessage(data.message || "Quote approved.");
      await loadQuotes();
    } catch (error) {
      console.error(error);
      setMessage("Failed to approve quote.");
    } finally {
      setApprovingId(null);
    }
  }

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
                Compare sourcing options and approve the best one.
              </p>
            </div>

            <div style={titleActions}>
              <Link href="/requests" style={secondaryLinkButton}>
                New Request
              </Link>
              <Link href="/orders" style={primaryLinkButton}>
                View Orders
              </Link>
            </div>
          </div>

          {message && <div style={infoBox}>{message}</div>}

          {loading ? (
            <div style={emptyCard}>Loading quotes...</div>
          ) : quotes.length === 0 ? (
            <div style={emptyCard}>
              <div style={emptyTitle}>No quotes found yet</div>
              <div style={emptyText}>
                Create a purchase request first, then generated quotes will show up here.
              </div>
              <div style={{ marginTop: "16px" }}>
                <Link href="/requests" style={primaryLinkButton}>
                  Create Request
                </Link>
              </div>
            </div>
          ) : (
            <div style={quotesGrid}>
              {quotes.map((quote) => {
                const total =
                  Number(quote.unit_price ?? 0) + Number(quote.shipping_cost ?? 0);

                const isApproved = quote.status === "approved";
                const isApproving = approvingId === quote.id;

                return (
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
                        value={quote.ai_score != null ? String(quote.ai_score) : "—"}
                      />
                    </div>

                    <div style={totalRow}>
                      <span style={totalLabel}>Estimated Total</span>
                      <span style={totalValue}>{formatMoney(total)}</span>
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
                          style={secondaryAnchorButton}
                        >
                          Open Vendor
                        </a>
                      ) : (
                        <div style={mutedNote}>No vendor link on this quote yet.</div>
                      )}

                      <button
                        onClick={() => approveQuote(quote.id)}
                        disabled={isApproved || isApproving}
                        style={{
                          ...primaryButton,
                          opacity: isApproved || isApproving ? 0.6 : 1,
                          cursor:
                            isApproved || isApproving ? "not-allowed" : "pointer",
                        }}
                      >
                        {isApproved
                          ? "Approved"
                          : isApproving
                          ? "Approving..."
                          : "Approve Quote"}
                      </button>
                    </div>
                  </article>
                );
              })}
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

const primaryButton: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  background: "#111827",
  color: "white",
  borderRadius: "8px",
  border: "none",
  fontWeight: 700,
};

const secondaryAnchorButton: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  background: "white",
  color: "#111827",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid #d1d5db",
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

const infoBox: React.CSSProperties = {
  marginBottom: "16px",
  background: "#eff6ff",
  color: "#1d4ed8",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #bfdbfe",
};
