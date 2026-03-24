"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type UserState = {
  email: string | null;
};

type AppTab = {
  label: string;
  href: string;
  description: string;
};

const TABS: AppTab[] = [
  {
    label: "Requests",
    href: "/requests",
    description: "Create and manage purchasing requests.",
  },
  {
    label: "Quotes",
    href: "/quotes",
    description: "Review and compare vendor quotes.",
  },
  {
    label: "Orders",
    href: "/orders",
    description: "Track approved and active orders.",
  },
  {
    label: "Vendors",
    href: "/vendors",
    description: "Browse and manage supplier options.",
  },
  {
    label: "AI Assistant",
    href: "/assistant",
    description: "Use the sourcing assistant workflow.",
  },
  {
    label: "Saved Items",
    href: "/saved-items",
    description: "Keep shortlisted products and options.",
  },
];

export default function HomePage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setUser(
          session?.user
            ? {
                email: session.user.email ?? null,
              }
            : null
        );
      } catch (error) {
        console.error("Failed to load session:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user
          ? {
              email: session.user.email ?? null,
            }
          : null
      );
    });

    const url = new URL(window.location.href);
    if (url.searchParams.get("checkout") === "success") {
      setShowCheckoutSuccess(true);
      url.searchParams.delete("checkout");
      window.history.replaceState({}, "", url.toString());
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      window.location.href = "/";
    }
  }

  if (loading) {
    return (
      <main style={loadingWrap}>
        <div style={loadingCard}>Loading...</div>
      </main>
    );
  }

  return (
    <main style={pageWrap}>
      <header style={headerStyle}>
        <div style={headerInner}>
          <div style={brandStyle}>ShukAI</div>

          <nav style={topNav}>
            <a href="#workspace" style={navLink}>
              Workspace
            </a>
            <a href="#features" style={navLink}>
              Features
            </a>
            <a href="/pricing" style={navLink}>
              Pricing
            </a>

            {user ? (
              <>
                <span style={emailText}>{user.email}</span>
                <Link href="/profile" style={ghostButtonLink}>
                  Profile
                </Link>
                <button onClick={handleLogout} style={ghostButton}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={ghostButtonLink}>
                  Log in
                </Link>
                <Link href="/login?next=/pricing" style={primaryButtonLink}>
                  Start free trial
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {showCheckoutSuccess && (
        <section style={bannerWrap}>
          <div style={successBanner}>
            Subscription started successfully. Your account is active.
          </div>
        </section>
      )}

      <section style={heroSection}>
        <div style={container}>
          <div style={heroGrid}>
            <div>
              <div style={eyebrow}>AI procurement for modern teams</div>

              <h1 style={heroTitle}>
                Source vendors, compare quotes, and manage purchasing in one
                place.
              </h1>

              <p style={heroText}>
                ShukAI is the front door to your procurement workflow. Create
                requests, compare suppliers, manage orders, keep saved items,
                and use AI where it actually helps.
              </p>

              <div style={heroButtons}>
                {user ? (
                  <>
                    <Link href="/pricing" style={heroPrimary}>
                      Manage plan
                    </Link>
                    <Link href="/assistant" style={heroSecondaryDark}>
                      Open AI Assistant
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login?next=/pricing" style={heroPrimary}>
                      Start free trial
                    </Link>
                    <Link href="/login" style={heroSecondaryDark}>
                      Log in
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div style={heroCard}>
              <div style={statGrid}>
                <StatCard title="Requests" value="Structured" />
                <StatCard title="Quotes" value="Comparable" />
                <StatCard title="Orders" value="Trackable" />
                <StatCard title="AI" value="Actionable" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workspace" style={sectionStyle}>
        <div style={container}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Workspace</h2>
            <p style={sectionText}>
              These are real links to your app routes. No fake tab content.
            </p>
          </div>

          <div style={tabGrid}>
            {TABS.map((tab) => (
              <Link key={tab.href} href={tab.href} style={tabCard}>
                <div style={tabLabel}>{tab.label}</div>
                <div style={tabDescription}>{tab.description}</div>
                <div style={tabAction}>Open →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="features" style={sectionStyleAlt}>
        <div style={container}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>What this app should do</h2>
            <p style={sectionText}>
              Clean routing, real workflows, and less friction.
            </p>
          </div>

          <div style={featureGrid}>
            <FeatureCard
              title="Requests"
              text="Start procurement with a structured request instead of a messy message."
            />
            <FeatureCard
              title="Quotes"
              text="Compare suppliers without flipping between tabs and screenshots."
            />
            <FeatureCard
              title="Orders"
              text="Track what has been quoted, approved, and purchased."
            />
            <FeatureCard
              title="AI Assistant"
              text="Use AI where it improves sourcing and decision support."
            />
          </div>
        </div>
      </section>

      <section style={ctaSection}>
        <div style={container}>
          <div style={ctaCard}>
            <div>
              <h2 style={ctaTitle}>Ready to use ShukAI for real?</h2>
              <p style={ctaText}>
                Start with the trial, then move straight into your actual
                workflow.
              </p>
            </div>

            <div style={ctaButtons}>
              {user ? (
                <>
                  <Link href="/pricing" style={heroPrimary}>
                    Go to pricing
                  </Link>
                  <Link href="/profile" style={heroSecondaryLight}>
                    Open profile
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login?next=/pricing" style={heroPrimary}>
                    Start free trial
                  </Link>
                  <Link href="/login" style={heroSecondaryLight}>
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div style={statCard}>
      <div style={statTitle}>{title}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div style={featureCard}>
      <div style={featureTitle}>{title}</div>
      <div style={featureText}>{text}</div>
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

const emailText: React.CSSProperties = {
  color: "#cbd5e1",
  fontWeight: 600,
  fontSize: "14px",
};

const ghostButtonLink: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  fontWeight: 700,
};

const ghostButton: React.CSSProperties = {
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.08)",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};

const primaryButtonLink: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "#2563eb",
  fontWeight: 700,
};

const bannerWrap: React.CSSProperties = {
  maxWidth: "1180px",
  margin: "18px auto 0",
  padding: "0 20px",
};

const successBanner: React.CSSProperties = {
  background: "#dcfce7",
  color: "#166534",
  border: "1px solid #86efac",
  borderRadius: "14px",
  padding: "14px 16px",
  fontWeight: 700,
};

const heroSection: React.CSSProperties = {
  background: "#f3f4f6",
};

const container: React.CSSProperties = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "0 20px",
};

const heroGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "24px",
  alignItems: "center",
  padding: "36px 0 12px",
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
  fontSize: "clamp(36px, 7vw, 62px)",
  lineHeight: 1.02,
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

const heroButtons: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "24px",
};

const heroPrimary: React.CSSProperties = {
  textDecoration: "none",
  background: "#111827",
  color: "white",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 800,
};

const heroSecondaryDark: React.CSSProperties = {
  textDecoration: "none",
  background: "white",
  color: "#111827",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 800,
  border: "1px solid #d1d5db",
};

const heroSecondaryLight: React.CSSProperties = {
  textDecoration: "none",
  background: "rgba(255,255,255,0.12)",
  color: "white",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 800,
  border: "1px solid rgba(255,255,255,0.15)",
};

const heroCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const statGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
};

const statCard: React.CSSProperties = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "18px",
};

const statTitle: React.CSSProperties = {
  color: "#6b7280",
  fontWeight: 700,
  fontSize: "14px",
};

const statValue: React.CSSProperties = {
  marginTop: "8px",
  fontWeight: 900,
  fontSize: "28px",
};

const sectionStyle: React.CSSProperties = {
  padding: "28px 0 12px",
};

const sectionStyleAlt: React.CSSProperties = {
  padding: "20px 0 12px",
};

const sectionHeader: React.CSSProperties = {
  maxWidth: "760px",
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(28px, 4vw, 44px)",
  lineHeight: 1.1,
  fontWeight: 900,
  letterSpacing: "-0.03em",
};

const sectionText: React.CSSProperties = {
  marginTop: "12px",
  color: "#6b7280",
  fontSize: "18px",
  lineHeight: 1.7,
};

const tabGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
  marginTop: "24px",
};

const tabCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "20px",
  textDecoration: "none",
  color: "#111827",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const tabLabel: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
};

const tabDescription: React.CSSProperties = {
  marginTop: "10px",
  color: "#6b7280",
  lineHeight: 1.7,
};

const tabAction: React.CSSProperties = {
  marginTop: "14px",
  color: "#2563eb",
  fontWeight: 800,
};

const featureGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
  marginTop: "24px",
};

const featureCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const featureTitle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
};

const featureText: React.CSSProperties = {
  marginTop: "10px",
  color: "#6b7280",
  lineHeight: 1.7,
};

const ctaSection: React.CSSProperties = {
  padding: "28px 0 80px",
};

const ctaCard: React.CSSProperties = {
  background: "#0b1220",
  color: "white",
  borderRadius: "24px",
  padding: "28px",
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  flexWrap: "wrap",
};

const ctaTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(28px, 4vw, 42px)",
  lineHeight: 1.1,
  fontWeight: 900,
  letterSpacing: "-0.03em",
};

const ctaText: React.CSSProperties = {
  marginTop: "12px",
  color: "#cbd5e1",
  lineHeight: 1.7,
  fontSize: "17px",
  maxWidth: "700px",
};

const ctaButtons: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  alignItems: "center",
};
