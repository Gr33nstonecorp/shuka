"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
  subscription_status: string | null;
  current_period_end: string | null;
};

type AssistantResult = {
  item?: string;
  quantity?: number | string;
  best_quote?: {
    vendor_name?: string;
    total?: number | string;
    reason?: string;
    product_url?: string;
  };
};

function hasActivePaidPlan(profile: ProfileRow | null) {
  if (!profile) return false;

  const paidPlan = profile.plan === "starter" || profile.plan === "premium";
  const activeStatus =
    profile.subscription_status === "active" ||
    profile.subscription_status === "trialing";

  if (!paidPlan || !activeStatus) return false;

  if (!profile.current_period_end) return activeStatus;

  const end = new Date(profile.current_period_end).getTime();
  return Number.isFinite(end) && end > Date.now();
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

export default function AssistantPage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AssistantResult[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        const user = session?.user;

        if (!user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, plan, subscription_status, current_period_end")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          setMessage("Could not load subscription profile: " + error.message);
        }

        setProfile((data as ProfileRow | null) || null);
      } catch (error) {
        console.error(error);
        setMessage("Could not load assistant access.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const hasPaidAccess = hasActivePaidPlan(profile);
  const isPremium = profile?.plan === "premium" && hasPaidAccess;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRunning(true);
    setMessage("");
    setResults([]);

    if (!hasPaidAccess) {
      setMessage("An active paid subscription is required to use the AI Assistant.");
      setRunning(false);
      return;
    }

    if (!input.trim()) {
      setMessage("Please enter at least one item to source.");
      setRunning(false);
      return;
    }

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.error || "AI request failed.");
        setRunning(false);
        return;
      }

      setResults(Array.isArray(data.results) ? data.results : []);
      if (!Array.isArray(data.results) || data.results.length === 0) {
        setMessage("No sourcing results were returned.");
      }
    } catch (error) {
      console.error(error);
      setMessage("AI request failed.");
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <main style={loadingWrap}>
        <div style={loadingCard}>Loading assistant...</div>
      </main>
    );
  }

  return (
    <main style={pageWrap}>
      <header style={headerStyle}>
        <div style={headerInner}>
          <Link href="/" style={brandStyle}>
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
            <Link href="/vendors" style={navLink}>
              Vendors
            </Link>
            <Link href="/saved-items" style={navLink}>
              Saved Items
            </Link>
            <Link href="/assistant" style={navLinkActive}>
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

      <section style={heroSection}>
        <div style={container}>
          <div style={heroGrid}>
            <div>
              <div style={eyebrow}>AI sourcing</div>

              <h1 style={heroTitle}>
                Turn a simple request into vendor options fast.
              </h1>

              <p style={heroText}>
                Enter one or multiple items and let ShukAI return sourcing results
                tied to your procurement workflow.
              </p>

              <div style={statusBox}>
                <div style={statusTitle}>Subscription access</div>
                <div style={statusValue}>
                  {hasPaidAccess ? `${profile?.plan || "paid"} active` : "No active paid plan"}
                </div>
                <div style={statusMeta}>
                  Status: {profile?.subscription_status || "free"}
                </div>
                <div style={statusMeta}>
                  Period ends: {formatDate(profile?.current_period_end)}
                </div>
              </div>
            </div>

            <div style={sideCard}>
              <div style={sideTitle}>Best input format</div>
              <div style={exampleBlock}>
                gloves - 50{"\n"}
                packing tape - 20{"\n"}
                shipping labels - 10
              </div>
              <div style={sideNote}>
                {isPremium
                  ? "Premium access confirmed. Multi-item sourcing is enabled."
                  : hasPaidAccess
                  ? "Paid access confirmed. Assistant is available on your account."
                  : "Upgrade to an active paid plan to run AI sourcing."}
              </div>
            </div>
          </div>

          {!hasPaidAccess && (
            <div style={upsellCard}>
              <div>
                <div style={upsellTitle}>Active subscription required</div>
                <div style={upsellText}>
                  The AI Assistant is available only to users with an active Starter or Premium subscription.
                </div>
              </div>

              <div style={upsellActions}>
                <Link href="/pricing" style={primaryLink}>
                  View Pricing
                </Link>
                <Link href="/profile" style={secondaryLink}>
                  Open Profile
                </Link>
              </div>
            </div>
          )}

          <div style={formCard}>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
              <label style={labelStyle}>Items to source</label>

              <textarea
                placeholder="Example: gloves - 50, tape - 20"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={7}
                style={textareaStyle}
                disabled={!hasPaidAccess || running}
              />

              <div style={buttonRow}>
                <button
                  type="submit"
                  disabled={!hasPaidAccess || running}
                  style={{
                    ...primaryButton,
                    opacity: !hasPaidAccess || running ? 0.65 : 1,
                    cursor: !hasPaidAccess || running ? "not-allowed" : "pointer",
                  }}
                >
                  {running ? "Running..." : "Run AI Sourcing"}
                </button>

                <Link href="/quotes" style={secondaryLinkDark}>
                  View Quotes
                </Link>
              </div>
            </form>

            {message && <div style={messageBox}>{message}</div>}
          </div>

          <div style={resultsWrap}>
            <h2 style={resultsTitle}>Results</h2>

            {results.length === 0 ? (
              <div style={emptyState}>
                No results yet. Run the assistant to see sourcing options here.
              </div>
            ) : (
              <div style={resultsGrid}>
                {results.map((result, index) => (
                  <div key={index} style={resultCard}>
                    <div style={resultTitle}>{result.item || "Unnamed item"}</div>

                    <div style={resultMeta}>
                      Quantity: {String(result.quantity ?? "—")}
                    </div>

                    {result.best_quote ? (
                      <>
                        <div style={metricGrid}>
                          <div>
                            <div style={metricLabel}>Best Vendor</div>
                            <div style={metricValue}>
                              {result.best_quote.vendor_name || "—"}
                            </div>
                          </div>

                          <div>
                            <div style={metricLabel}>Estimated Total</div>
                            <div style={metricValue}>
                              $
                              {Number(result.best_quote.total || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {result.best_quote.reason && (
                          <div style={reasonBox}>{result.best_quote.reason}</div>
                        )}

                        {result.best_quote.product_url ? (
                          <a
                            href={result.best_quote.product_url}
                            target="_blank"
                            rel="noreferrer"
                            style={vendorLink}
                          >
                            Open supplier →
                          </a>
                        ) : (
                          <div style={mutedText}>No supplier URL available yet.</div>
                        )}
                      </>
                    ) : (
                      <div style={mutedText}>No quote data returned for this item.</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const pageWrap: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f3f4f6",
  color: "#111827",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const loadingWrap: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f3f4f6",
};

const loadingCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "20px 24px",
  fontWeight: 700,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
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

const brandStyle: React.CSSProperties = {
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
  fontWeight: 800,
};

const ghostButtonLink: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  fontWeight: 700,
};

const heroSection: React.CSSProperties = {
  padding: "32px 0 80px",
};

const container: React.CSSProperties = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "0 20px",
};

const heroGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
  alignItems: "start",
};

const eyebrow: React.CSSProperties = {
  display: "inline-block",
  background: "#dbeafe",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  borderRadius: "999px",
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: "14px",
};

const heroTitle: React.CSSProperties = {
  margin: "18px 0 0",
  fontSize: "clamp(34px, 6vw, 56px)",
  lineHeight: 1.05,
  fontWeight: 900,
  letterSpacing: "-0.04em",
};

const heroText: React.CSSProperties = {
  marginTop: "18px",
  maxWidth: "760px",
  fontSize: "20px",
  lineHeight: 1.7,
  color: "#4b5563",
};

const statusBox: React.CSSProperties = {
  marginTop: "22px",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "18px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const statusTitle: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b7280",
  fontWeight: 700,
};

const statusValue: React.CSSProperties = {
  marginTop: "8px",
  fontSize: "24px",
  fontWeight: 900,
};

const statusMeta: React.CSSProperties = {
  marginTop: "6px",
  color: "#4b5563",
  lineHeight: 1.6,
};

const sideCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const sideTitle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
};

const exampleBlock: React.CSSProperties = {
  marginTop: "12px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "14px",
  whiteSpace: "pre-wrap",
  lineHeight: 1.7,
  color: "#374151",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

const sideNote: React.CSSProperties = {
  marginTop: "12px",
  color: "#4b5563",
  lineHeight: 1.7,
};

const upsellCard: React.CSSProperties = {
  marginTop: "24px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#1d4ed8",
  borderRadius: "18px",
  padding: "18px",
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  alignItems: "center",
};

const upsellTitle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: "18px",
};

const upsellText: React.CSSProperties = {
  marginTop: "6px",
  lineHeight: 1.6,
};

const upsellActions: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const primaryLink: React.CSSProperties = {
  textDecoration: "none",
  background: "#111827",
  color: "white",
  padding: "12px 16px",
  borderRadius: "12px",
  fontWeight: 700,
};

const secondaryLink: React.CSSProperties = {
  textDecoration: "none",
  background: "white",
  color: "#111827",
  padding: "12px 16px",
  borderRadius: "12px",
  fontWeight: 700,
  border: "1px solid #d1d5db",
};

const formCard: React.CSSProperties = {
  marginTop: "24px",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  lineHeight: 1.6,
  boxSizing: "border-box",
  resize: "vertical",
};

const buttonRow: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const primaryButton: React.CSSProperties = {
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "12px 18px",
  fontWeight: 700,
};

const secondaryLinkDark: React.CSSProperties = {
  textDecoration: "none",
  background: "white",
  color: "#111827",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: 700,
  border: "1px solid #d1d5db",
};

const messageBox: React.CSSProperties = {
  marginTop: "16px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "12px 14px",
  color: "#374151",
};

const resultsWrap: React.CSSProperties = {
  marginTop: "28px",
};

const resultsTitle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 900,
  margin: 0,
};

const emptyState: React.CSSProperties = {
  marginTop: "16px",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "18px",
  color: "#6b7280",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const resultsGrid: React.CSSProperties = {
  display: "grid",
  gap: "16px",
  marginTop: "16px",
};

const resultCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "18px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const resultTitle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 800,
};

const resultMeta: React.CSSProperties = {
  marginTop: "8px",
  color: "#6b7280",
};

const metricGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginTop: "16px",
};

const metricLabel: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
};

const metricValue: React.CSSProperties = {
  fontWeight: 800,
  marginTop: "4px",
};

const reasonBox: React.CSSProperties = {
  marginTop: "14px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#1d4ed8",
  borderRadius: "12px",
  padding: "12px 14px",
  lineHeight: 1.6,
};

const vendorLink: React.CSSProperties = {
  display: "inline-block",
  marginTop: "14px",
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 700,
};

const mutedText: React.CSSProperties = {
  marginTop: "14px",
  color: "#6b7280",
};
