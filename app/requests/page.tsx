"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SessionUser = {
  id: string;
  email: string | null;
};

export default function RequestsPage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [user, setUser] = useState<SessionUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("general");
  const [urgency, setUrgency] = useState("normal");

  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("#374151");
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session?.user) {
          window.location.href = "/login?next=/requests";
          return;
        }

        setUser({
          id: session.user.id,
          email: session.user.email ?? null,
        });
      } catch (error) {
        console.error("Failed to load session:", error);
        if (mounted) {
          setMessageColor("#b91c1c");
          setMessage("Could not verify your session. Please log in again.");
        }
      } finally {
        if (mounted) setSessionLoading(false);
      }
    }

    loadSession();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanProduct = product.trim();

    if (!cleanProduct) {
      setMessageColor("#b91c1c");
      setMessage("Enter a product name.");
      return;
    }

    if (!quantity || quantity < 1) {
      setMessageColor("#b91c1c");
      setMessage("Quantity must be at least 1.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const { data: newRequest, error } = await supabase
        .from("purchase_requests")
        .insert({
          product: cleanProduct,
          quantity,
          category,
          urgency,
          budget_cap: 0,
          status: "submitted",
        })
        .select()
        .single();

      if (error) {
        setMessageColor("#b91c1c");
        setMessage("Error creating request: " + error.message);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/generate-quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_id: newRequest.id,
          product_name: cleanProduct,
          quantity,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessageColor("#b91c1c");
        setMessage(
          "Request created, but quote generation failed: " +
            (result.error || "Unknown error")
        );
        setLoading(false);
        return;
      }

      setMessageColor("#166534");
      setMessage("Request submitted and quotes generated.");
      setProduct("");
      setQuantity(1);
      setCategory("general");
      setUrgency("normal");
    } catch (error) {
      console.error(error);
      setMessageColor("#b91c1c");
      setMessage("Something went wrong while submitting the request.");
    } finally {
      setLoading(false);
    }
  }

  if (sessionLoading) {
    return (
      <main style={loadingWrap}>
        <div style={loadingCard}>Loading requests...</div>
      </main>
    );
  }

  return (
    <main style={pageWrap}>
      <header style={headerStyle}>
        <div style={headerInner}>
          <Link href="/" style={brandLink}>
            ShukAI
          </Link>

          <nav style={topNav}>
            <Link href="/requests" style={navLinkActive}>
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
            <Link href="/assistant" style={navLink}>
              AI Assistant
            </Link>
            <Link href="/profile" style={ghostButtonLink}>
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <section style={contentWrap}>
        <div style={contentInner}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={pageTitle}>Create Purchase Request</h1>
            <p style={pageSubtitle}>
              Submit a new item request and let ShukAI generate vendor quotes automatically.
            </p>
            {user?.email && <p style={userText}>Signed in as {user.email}</p>}
          </div>

          <div style={gridWrap}>
            <form onSubmit={handleSubmit} style={formCard}>
              <div>
                <label style={labelStyle}>Product</label>
                <input
                  type="text"
                  placeholder="e.g. packing tape, nitrile gloves, shipping labels"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={twoColGrid}>
                <div>
                  <label style={labelStyle}>Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    min={1}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="general">General</option>
                    <option value="packaging">Packaging</option>
                    <option value="office">Office Supplies</option>
                    <option value="industrial">Industrial</option>
                    <option value="janitorial">Janitorial</option>
                    <option value="safety">Safety</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Urgency</label>
                <div style={pillRow}>
                  {["low", "normal", "high", "critical"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      style={{
                        ...pillButton,
                        background: urgency === level ? "#111827" : "white",
                        color: urgency === level ? "white" : "#111827",
                        border:
                          urgency === level
                            ? "1px solid #111827"
                            : "1px solid #d1d5db",
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div style={actionRow}>
                <button type="submit" disabled={loading} style={submitButton}>
                  {loading ? "Submitting..." : "Submit Request"}
                </button>

                <Link href="/quotes" style={secondaryLinkButton}>
                  View Quotes
                </Link>
              </div>

              {message && (
                <div style={{ color: messageColor, fontSize: "14px", fontWeight: 600 }}>
                  {message}
                </div>
              )}
            </form>

            <aside style={helpCard}>
              <div style={helpHeader}>
                <h2 style={helpTitle}>How it works</h2>

                {!showHelp && (
                  <button onClick={() => setShowHelp(true)} style={smallButton}>
                    Show
                  </button>
                )}
              </div>

              {showHelp && (
                <div style={helpPanel}>
                  <button onClick={() => setShowHelp(false)} style={closeButton}>
                    ✕
                  </button>

                  <div style={helpList}>
                    <div>
                      <strong style={helpStepTitle}>1. Submit</strong>
                      Create a request for the product your team needs.
                    </div>
                    <div>
                      <strong style={helpStepTitle}>2. Source</strong>
                      ShukAI generates supplier options and quote links automatically.
                    </div>
                    <div>
                      <strong style={helpStepTitle}>3. Decide</strong>
                      Review quotes, compare vendors, and move into approvals or orders.
                    </div>
                  </div>
                </div>
              )}
            </aside>
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

const pageTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "32px",
  fontWeight: 800,
};

const pageSubtitle: React.CSSProperties = {
  color: "#6b7280",
  marginTop: "8px",
};

const userText: React.CSSProperties = {
  color: "#374151",
  marginTop: "8px",
  fontSize: "14px",
};

const gridWrap: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 760px) minmax(280px, 320px)",
  gap: "20px",
  alignItems: "start",
};

const formCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
  display: "grid",
  gap: "18px",
};

const helpCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
  position: "relative",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
};

const twoColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
};

const pillRow: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const pillButton: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: 700,
  textTransform: "capitalize",
};

const actionRow: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const submitButton: React.CSSProperties = {
  padding: "12px 18px",
  background: "#111827",
  color: "white",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
};

const secondaryLinkButton: React.CSSProperties = {
  display: "inline-block",
  textDecoration: "none",
  padding: "12px 18px",
  background: "white",
  color: "#111827",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontWeight: 700,
};

const helpHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const helpTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "18px",
};

const smallButton: React.CSSProperties = {
  background: "#f3f4f6",
  border: "1px solid #e5e7eb",
  padding: "6px 10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
};

const helpPanel: React.CSSProperties = {
  position: "relative",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "16px",
};

const closeButton: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "#6b7280",
};

const helpList: React.CSSProperties = {
  display: "grid",
  gap: "14px",
  color: "#4b5563",
  paddingRight: "24px",
};

const helpStepTitle: React.CSSProperties = {
  display: "block",
  color: "#111827",
};
