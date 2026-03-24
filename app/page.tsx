"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

type Tab =
  | "requests"
  | "quotes"
  | "orders"
  | "vendors"
  | "ai"
  | "saved";

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
  const [activeTab, setActiveTab] = useState<Tab>("requests");
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
        background: "#f3f4f6",
        color: "#111827",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <header
        style={{
          background: "#0b1220",
          color: "white",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 900 }}>Shuka</div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
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
                  <a href="/pricing" style={topButton}>
                    Pricing
                  </a>
                  <a href="/profile" style={topButton}>
                    Profile
                  </a>
                  <button onClick={handleLogout} style={topButtonButton}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/pricing" style={topButton}>
                    Pricing
                  </a>
                  <a href="/login" style={topButton}>
                    Log in
                  </a>
                  <a href="/login?next=/pricing" style={topPrimaryButton}>
                    Start free trial
                  </a>
                </>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              overflowX: "auto",
              paddingTop: "18px",
            }}
          >
            <TabButton
              label="Requests"
              active={activeTab === "requests"}
              onClick={() => setActiveTab("requests")}
            />
            <TabButton
              label="Quotes"
              active={activeTab === "quotes"}
              onClick={() => setActiveTab("quotes")}
            />
            <TabButton
              label="Orders"
              active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />
            <TabButton
              label="Vendors"
              active={activeTab === "vendors"}
              onClick={() => setActiveTab("vendors")}
            />
            <TabButton
              label="AI Assistant"
              active={activeTab === "ai"}
              onClick={() => setActiveTab("ai")}
            />
            <TabButton
              label="Saved Items"
              active={activeTab === "saved"}
              onClick={() => setActiveTab("saved")}
            />
          </div>
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
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "28px 20px 80px",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(34px, 6vw, 58px)",
              lineHeight: 1.02,
              fontWeight: 900,
              letterSpacing: "-0.04em",
            }}
          >
            Procurement that actually feels organized.
          </h1>

          <p
            style={{
              marginTop: "16px",
              maxWidth: "820px",
              fontSize: "20px",
              lineHeight: 1.7,
              color: "#4b5563",
            }}
          >
            Use the tabs above to preview sourcing, quote comparison, vendors,
            orders, and workflow structure without getting blocked every two
            clicks.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "22px",
            }}
          >
            {userEmail ? (
              <>
                <a href="/pricing" style={heroPrimary}>
                  Upgrade plan
                </a>
                <a href="/profile" style={heroSecondary}>
                  Open profile
                </a>
              </>
            ) : (
              <>
                <a href="/login?next=/pricing" style={heroPrimary}>
                  Start free trial
                </a>
                <a href="/login" style={heroSecondary}>
                  Log in
                </a>
              </>
            )}
          </div>
        </div>

        <div style={{ marginTop: "22px" }}>
          {activeTab === "requests" && <RequestsPanel />}
          {activeTab === "quotes" && <QuotesPanel />}
          {activeTab === "orders" && <OrdersPanel />}
          {activeTab === "vendors" && <VendorsPanel />}
          {activeTab === "ai" && <AIPanel />}
          {activeTab === "saved" && <SavedPanel />}
        </div>
      </section>
    </main>
  );
}

function TabButton({
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
        padding: "12px 16px",
        borderRadius: "12px",
        border: active ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.12)",
        background: active ? "#2563eb" : "rgba(255,255,255,0.06)",
        color: "white",
        cursor: "pointer",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function PanelShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "30px",
          fontWeight: 900,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          marginTop: "10px",
          color: "#6b7280",
          fontSize: "17px",
          lineHeight: 1.7,
        }}
      >
        {subtitle}
      </p>
      <div style={{ marginTop: "20px" }}>{children}</div>
    </div>
  );
}

function RequestsPanel() {
  return (
    <PanelShell
      title="Requests"
      subtitle="Start procurement with a simple structured request instead of scattered messages."
    >
      <div style={twoCol}>
        <Card>
          <FieldLabel>Request title</FieldLabel>
          <FakeInput>Commercial prep tables for new kitchen setup</FakeInput>

          <FieldLabel>Category</FieldLabel>
          <FakeInput>Food service equipment</FakeInput>

          <FieldLabel>Requirements</FieldLabel>
          <FakeTextArea>
            Stainless steel, easy to clean, 48–72 inch size range, commercial-grade durability.
          </FakeTextArea>

          <div style={{ marginTop: "16px" }}>
            <ActionButton>Create request</ActionButton>
          </div>
        </Card>

        <Card>
          <SectionTitle>Why this helps</SectionTitle>
          <Bullet>Centralizes buying requests</Bullet>
          <Bullet>Makes sourcing easier to delegate</Bullet>
          <Bullet>Keeps vendor searches tied to a real request</Bullet>
          <Bullet>Gives buyers a repeatable workflow</Bullet>
        </Card>
      </div>
    </PanelShell>
  );
}

function QuotesPanel() {
  return (
    <PanelShell
      title="Quote comparison"
      subtitle="Compare vendors side by side so decisions are faster and more defensible."
    >
      <div style={threeCol}>
        <QuoteCard vendor="Vendor A" price="$2,980" lead="5 days" quality="High" />
        <QuoteCard vendor="Vendor B" price="$2,640" lead="12 days" quality="Medium" />
        <QuoteCard vendor="Vendor C" price="$3,220" lead="6 days" quality="Premium" />
      </div>
    </PanelShell>
  );
}

function OrdersPanel() {
  return (
    <PanelShell
      title="Orders"
      subtitle="Track what’s approved, quoted, and purchased without losing context."
    >
      <Card>
        <OrderRow title="Prep tables" status="Approved" />
        <OrderRow title="Storage racks" status="Quoted" />
        <OrderRow title="Receiving bins" status="Saved item" />
        <OrderRow title="Shelving kit" status="Ordered" />
      </Card>
    </PanelShell>
  );
}

function VendorsPanel() {
  return (
    <PanelShell
      title="Vendors"
      subtitle="Keep supplier options organized so your team can actually compare and decide."
    >
      <div style={threeCol}>
        <VendorCard
          name="Vendor A"
          note="Fast shipping"
          tags={["Reliable", "Strong reviews", "Kitchen equipment"]}
        />
        <VendorCard
          name="Vendor B"
          note="Budget option"
          tags={["Lower price", "Longer lead time", "Bulk discount"]}
        />
        <VendorCard
          name="Vendor C"
          note="Premium quality"
          tags={["Best materials", "Higher price", "Great support"]}
        />
      </div>
    </PanelShell>
  );
}

function AIPanel() {
  return (
    <PanelShell
      title="AI Assistant"
      subtitle="Preview how Shuka can guide sourcing and comparison workflows."
    >
      <Card>
        <div style={{ fontWeight: 700 }}>You:</div>
        <div style={chatBubbleUser}>
          Find vendors for stainless prep tables and compare likely tradeoffs.
        </div>

        <div style={{ fontWeight: 700, marginTop: "14px" }}>Shuka AI:</div>
        <div style={chatBubbleAI}>
          I found three vendor directions: one faster shipping option, one lower
          price option, and one premium option with stronger materials. Open the
          Quotes tab to compare them side by side.
        </div>
      </Card>
    </PanelShell>
  );
}

function SavedPanel() {
  return (
    <PanelShell
      title="Saved items"
      subtitle="Keep promising items and supplier options in one place for later review."
    >
      <div style={twoCol}>
        <Card>
          <SectionTitle>Saved items</SectionTitle>
          <Bullet>Stainless prep table 60"</Bullet>
          <Bullet>Commercial wall shelf kit</Bullet>
          <Bullet>Heavy-duty storage rack</Bullet>
        </Card>

        <Card>
          <SectionTitle>Why teams use this</SectionTitle>
          <Bullet>Prevents re-searching the same products</Bullet>
          <Bullet>Keeps shortlisted options visible</Bullet>
          <Bullet>Makes future orders faster</Bullet>
        </Card>
      </div>
    </PanelShell>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "18px",
      }}
    >
      {children}
    </div>
  );
}

function QuoteCard({
  vendor,
  price,
  lead,
  quality,
}: {
  vendor: string;
  price: string;
  lead: string;
  quality: string;
}) {
  return (
    <Card>
      <SectionTitle>{vendor}</SectionTitle>
      <InfoLine label="Price" value={price} />
      <InfoLine label="Lead time" value={lead} />
      <InfoLine label="Quality" value={quality} />
    </Card>
  );
}

function VendorCard({
  name,
  note,
  tags,
}: {
  name: string;
  note: string;
  tags: string[];
}) {
  return (
    <Card>
      <SectionTitle>{name}</SectionTitle>
      <p style={{ color: "#6b7280", marginTop: "8px" }}>{note}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
        {tags.map((tag) => (
          <span key={tag} style={tagStyle}>
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}

function OrderRow({ title, status }: { title: string; status: string }) {
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

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginTop: "10px", color: "#374151" }}>
      <strong>{label}:</strong> {value}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: "12px",
        marginBottom: "6px",
        fontWeight: 700,
        fontSize: "14px",
      }}
    >
      {children}
    </div>
  );
}

function FakeInput({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        background: "white",
        color: "#374151",
      }}
    >
      {children}
    </div>
  );
}

function FakeTextArea({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100px",
        padding: "12px 14px",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        background: "white",
        color: "#374151",
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "20px", fontWeight: 800 }}>{children}</div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "10px", color: "#374151" }}>• {children}</div>
  );
}

function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        padding: "12px 16px",
        borderRadius: "12px",
        border: "none",
        background: "#111827",
        color: "white",
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}

const topButton: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  fontWeight: 700,
};

const topButtonButton: React.CSSProperties = {
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};

const topPrimaryButton: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "#2563eb",
  fontWeight: 700,
};

const heroPrimary: React.CSSProperties = {
  textDecoration: "none",
  background: "#111827",
  color: "white",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 800,
};

const heroSecondary: React.CSSProperties = {
  textDecoration: "none",
  background: "white",
  color: "#111827",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 800,
  border: "1px solid #d1d5db",
};

const twoCol: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "16px",
};

const threeCol: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const chatBubbleUser: React.CSSProperties = {
  marginTop: "8px",
  background: "#dbeafe",
  border: "1px solid #bfdbfe",
  borderRadius: "14px",
  padding: "12px 14px",
  color: "#1e3a8a",
};

const chatBubbleAI: React.CSSProperties = {
  marginTop: "8px",
  background: "#f3f4f6",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "12px 14px",
  color: "#374151",
  lineHeight: 1.7,
};

const tagStyle: React.CSSProperties = {
  background: "#e5e7eb",
  color: "#374151",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: 700,
};
