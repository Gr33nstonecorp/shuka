"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DemoTab = "sourcing" | "quotes" | "orders";

export default function HomePage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DemoTab>("sourcing");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUserEmail(session?.user?.email ?? null);
    }

    loadSession();

    const url = new URL(window.location.href);
    if (url.searchParams.get("checkout") === "success") {
      setShowSuccess(true);
      url.searchParams.delete("checkout");
      window.history.replaceState({}, "", url.toString());
    }
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <header
        style={{
          background: "#06122b",
          color: "white",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: 800 }}>Shuka</div>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <a href="#demo" style={navLink}>
              Demo
            </a>
            <a href="#features" style={navLink}>
              Features
            </a>
            <a href="/pricing" style={navLink}>
              Pricing
            </a>

            {userEmail ? (
              <>
                <span
                  style={{
                    color: "#cbd5e1",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {userEmail}
                </span>
                <a href="/profile" style={ghostButton}>
                  Profile
                </a>
                <button onClick={handleLogout} style={ghostButtonButton}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" style={ghostButton}>
                  Log in
                </a>
                <a href="/login?next=/pricing" style={primaryButton}>
                  Start free trial
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      {showSuccess && (
        <div
          style={{
            maxWidth: "1180px",
            margin: "18px auto 0",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              border: "1px solid #86efac",
              borderRadius: "14px",
              padding: "14px 16px",
              fontWeight: 700,
            }}
          >
            Subscription started successfully. Your account is active.
          </div>
        </div>
      )}

      <section
        style={{
          background:
            "linear-gradient(180deg, #06122b 0%, #0b1b3d 58%, #f8fafc 58%, #f8fafc 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "56px 20px 72px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "28px",
              alignItems: "center",
            }}
          >
            <div>
              <div style={pill}>
                AI procurement for modern teams
              </div>

              <h1
                style={{
                  margin: "18px 0 0",
                  fontSize: "clamp(38px, 8vw, 66px)",
                  lineHeight: 1.02,
                  color: "white",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                }}
              >
                Source vendors, compare quotes, and manage purchasing in one place.
              </h1>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "20px",
                  lineHeight: 1.65,
                  color: "#cbd5e1",
                  maxWidth: "700px",
                }}
              >
                Shuka helps teams move faster with sourcing, quote comparison,
                approvals, saved items, and order workflows — without spreadsheets
                and messy inbox chains.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginTop: "26px",
                }}
              >
                {userEmail ? (
                  <>
                    <a href="/pricing" style={heroPrimary}>
                      Upgrade or start trial
                    </a>
                    <a href="/profile" style={heroSecondary}>
                      Manage account
                    </a>
                  </>
                ) : (
                  <>
                    <a href="/login?next=/pricing" style={heroPrimary}>
                      Start free trial
                    </a>
                    <a href="#demo" style={heroSecondary}>
                      See live demo
                    </a>
                  </>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  flexWrap: "wrap",
                  marginTop: "24px",
                  color: "#cbd5e1",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                <span>7-day free trial</span>
                <span>No setup headache</span>
                <span>Built for real workflows</span>
              </div>
            </div>

            <div>
              <div
                style={{
                  background: "white",
                  borderRadius: "24px",
                  padding: "22px",
                  boxShadow: "0 25px 60px rgba(2,6,23,0.28)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                  }}
                >
                  <MiniCard
                    title="AI sourcing"
                    big="Faster"
                    text="Generate vendor options from one request."
                    bg="#eff6ff"
                    border="#bfdbfe"
                    titleColor="#1d4ed8"
                  />
                  <MiniCard
                    title="Quote comparison"
                    big="Clearer"
                    text="See pricing and fit side by side."
                    bg="#f8fafc"
                    border="#e2e8f0"
                    titleColor="#334155"
                  />
                  <MiniCard
                    title="Approvals"
                    big="Simpler"
                    text="Keep decisions and requests together."
                    bg="#f8fafc"
                    border="#e2e8f0"
                    titleColor="#334155"
                  />
                  <MiniCard
                    title="Orders"
                    big="Centralized"
                    text="Track saved items and purchasing flow."
                    bg="#ecfeff"
                    border="#a5f3fc"
                    titleColor="#0f766e"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="demo"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "22px 20px 12px",
        }}
      >
        <div style={{ maxWidth: "760px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            Try the product feel before you sign up
          </h2>
          <p
            style={{
              marginTop: "14px",
              color: "#475569",
              fontSize: "18px",
              lineHeight: 1.7,
            }}
          >
            These tabs are public so visitors can understand the workflow right away.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "22px",
          }}
        >
          <DemoTabButton
            label="Sourcing"
            active={activeTab === "sourcing"}
            onClick={() => setActiveTab("sourcing")}
          />
          <DemoTabButton
            label="Quote Compare"
            active={activeTab === "quotes"}
            onClick={() => setActiveTab("quotes")}
          />
          <DemoTabButton
            label="Orders"
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "22px",
            padding: "24px",
            marginTop: "18px",
            boxShadow: "0 8px 22px rgba(15,23,42,0.04)",
          }}
        >
          {activeTab === "sourcing" && (
            <div>
              <h3 style={demoTitle}>AI Sourcing Demo</h3>
              <p style={demoText}>
                Request: “Need stainless prep tables and commercial storage racks for a small food operation.”
              </p>
              <div style={demoGrid}>
                <DemoResult
                  title="Vendor A"
                  subtitle="Fast ship • strong reviews"
                  lines={["Prep tables", "Storage racks", "Good lead time"]}
                />
                <DemoResult
                  title="Vendor B"
                  subtitle="Lower pricing"
                  lines={["Bulk discount", "Mid-range quality", "Longer delivery"]}
                />
                <DemoResult
                  title="Vendor C"
                  subtitle="Premium option"
                  lines={["Best materials", "Higher cost", "Strong support"]}
                />
              </div>
            </div>
          )}

          {activeTab === "quotes" && (
            <div>
              <h3 style={demoTitle}>Quote Comparison Demo</h3>
              <div style={compareWrap}>
                <CompareCol
                  title="Vendor A"
                  price="$2,980"
                  note="Best delivery speed"
                />
                <CompareCol
                  title="Vendor B"
                  price="$2,640"
                  note="Lowest price"
                />
                <CompareCol
                  title="Vendor C"
                  price="$3,220"
                  note="Best quality"
                />
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h3 style={demoTitle}>Order Workflow Demo</h3>
              <div style={orderList}>
                <OrderRow title="Prep tables" status="Approved" />
                <OrderRow title="Storage racks" status="Quoted" />
                <OrderRow title="Receiving bins" status="Saved item" />
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        id="features"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "54px 20px 80px",
        }}
      >
        <div style={{ maxWidth: "760px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            Everything your team needs to move from request to purchase
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
            marginTop: "28px",
          }}
        >
          {[
            "AI vendor sourcing",
            "Quote comparison",
            "Approval workflow",
            "Saved items and orders",
            "Vendor ranking",
            "Shipment visibility",
          ].map((title) => (
            <div
              key={title}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "20px",
                boxShadow: "0 8px 22px rgba(15,23,42,0.04)",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 800 }}>{title}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function MiniCard({
  title,
  big,
  text,
  bg,
  border,
  titleColor,
}: {
  title: string;
  big: string;
  text: string;
  bg: string;
  border: string;
  titleColor: string;
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "18px",
        padding: "16px",
      }}
    >
      <div style={{ color: titleColor, fontWeight: 800, fontSize: "14px" }}>
        {title}
      </div>
      <div
        style={{
          marginTop: "8px",
          fontSize: "26px",
          fontWeight: 900,
          color: "#0f172a",
        }}
      >
        {big}
      </div>
      <div style={{ marginTop: "6px", color: "#475569", lineHeight: 1.6 }}>
        {text}
      </div>
    </div>
  );
}

function DemoTabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: "12px",
        border: active ? "1px solid #111827" : "1px solid #d1d5db",
        background: active ? "#111827" : "white",
        color: active ? "white" : "#111827",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      {label}
    </button>
  );
}

function DemoResult({
  title,
  subtitle,
  lines,
}: {
  title: string;
  subtitle: string;
  lines: string[];
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "16px",
      }}
    >
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div style={{ color: "#64748b", marginTop: "4px" }}>{subtitle}</div>
      <ul style={{ margin: "12px 0 0", paddingLeft: "18px", color: "#334155", lineHeight: 1.8 }}>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function CompareCol({
  title,
  price,
  note,
}: {
  title: string;
  price: string;
  note: string;
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "16px",
        minWidth: "180px",
        flex: 1,
      }}
    >
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: "32px", fontWeight: 900, marginTop: "8px" }}>{price}</div>
      <div style={{ color: "#64748b", marginTop: "6px" }}>{note}</div>
    </div>
  );
}

function OrderRow({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
        padding: "14px 0",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ color: "#2563eb", fontWeight: 700 }}>{status}</div>
    </div>
  );
}

const navLink: React.CSSProperties = {
  color: "#cbd5e1",
  textDecoration: "none",
  fontWeight: 600,
};

const ghostButton: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  fontWeight: 700,
};

const ghostButtonButton: React.CSSProperties = {
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};

const primaryButton: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "#2563eb",
  fontWeight: 700,
};

const heroPrimary: React.CSSProperties = {
  textDecoration: "none",
  background: "#2563eb",
  color: "white",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 800,
  boxShadow: "0 10px 25px rgba(37,99,235,0.25)",
};

const heroSecondary: React.CSSProperties = {
  textDecoration: "none",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 800,
  border: "1px solid rgba(255,255,255,0.1)",
};

const pill: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(37,99,235,0.15)",
  color: "#93c5fd",
  border: "1px solid rgba(147,197,253,0.25)",
  borderRadius: "999px",
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: "14px",
};

const demoTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "24px",
  fontWeight: 900,
};

const demoText: React.CSSProperties = {
  marginTop: "10px",
  color: "#475569",
  lineHeight: 1.7,
};

const demoGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginTop: "18px",
};

const compareWrap: React.CSSProperties = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const orderList: React.CSSProperties = {
  marginTop: "16px",
};
