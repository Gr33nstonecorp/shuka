import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type VendorSource = {
  id: string;
  name: string | null;
  vendor_type: string | null;
  category: string | null;
  default_ai_score: number | null;
  active: boolean | null;
};

function scoreLabel(score: number | null | undefined) {
  if (score == null) return "—";
  return String(score);
}

export default async function VendorsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("vendor_sources")
    .select("*")
    .eq("active", true)
    .order("default_ai_score", { ascending: false });

  const vendors = (data || []) as VendorSource[];

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
            <Link href="/quotes" style={navLink}>
              Quotes
            </Link>
            <Link href="/orders" style={navLink}>
              Orders
            </Link>
            <Link href="/vendors" style={navLinkActive}>
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
              <h1 style={pageTitle}>Vendor Sources</h1>
              <p style={pageSubtitle}>
                Supplier sources currently available to ShukAI.
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
              <div style={errorTitle}>Could not load vendor sources</div>
              <div style={errorText}>{error.message}</div>
            </div>
          ) : vendors.length === 0 ? (
            <div style={emptyCard}>
              <div style={emptyTitle}>No active vendors found</div>
              <div style={emptyText}>
                Add or activate vendor sources in the database and they will appear here.
              </div>
            </div>
          ) : (
            <div style={vendorsGrid}>
              {vendors.map((vendor) => (
                <article key={vendor.id} style={vendorCard}>
                  <div style={vendorHeader}>
                    <div>
                      <div style={vendorName}>
                        {vendor.name || "Unnamed Vendor"}
                      </div>
                      <div style={vendorCategoryText}>
                        {vendor.category || "Uncategorized"}
                      </div>
                    </div>

                    <span style={typeBadge}>
                      {vendor.vendor_type || "Unknown Type"}
                    </span>
                  </div>

                  <div style={metricsGrid}>
                    <Metric label="Category" value={vendor.category || "—"} />
                    <Metric
                      label="Default AI Score"
                      value={scoreLabel(vendor.default_ai_score)}
                    />
                    <Metric
                      label="Status"
                      value={vendor.active ? "Active" : "Inactive"}
                    />
                  </div>

                  <div style={cardActions}>
                    <Link href="/assistant" style={primaryLinkButton}>
                      Use in AI Workflow
                    </Link>
                    <Link href="/quotes" style={secondaryLinkButton}>
                      View Quotes
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

const vendorsGrid: React.CSSProperties = {
  display: "grid",
  gap: "18px",
};

const vendorCard: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
};

const vendorHeader: React.CSSProperties = {
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

const vendorCategoryText: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
  marginTop: "6px",
};

const typeBadge: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  background: "#dbeafe",
  color: "#1d4ed8",
};

const metricsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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

const cardActions: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  alignItems: "center",
  marginTop: "16px",
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
