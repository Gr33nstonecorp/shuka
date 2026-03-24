"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type WorkspacePageProps = {
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
};

type UserState = {
  email: string | null;
};

export default function WorkspacePage({
  title,
  subtitle,
  primaryCtaLabel,
  primaryCtaHref,
}: WorkspacePageProps) {
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
        if (mounted) setLoading(false);
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

      <section style={sectionWrap}>
        <div style={container}>
          <div style={heroCard}>
            <div style={eyebrow}>Workspace</div>
            <h1 style={titleStyle}>{title}</h1>
            <p style={subtitleStyle}>{subtitle}</p>

            <div style={buttonRow}>
              <Link href={primaryCtaHref} style={primaryButtonDark}>
                {primaryCtaLabel}
              </Link>
              <Link href="/assistant" style={secondaryButton}>
                Open AI Assistant
              </Link>
              <Link href="/pricing" style={secondaryButton}>
                Pricing
              </Link>
            </div>
          </div>

          <div style={grid}>
            <InfoCard
              title="Requests"
              text="Start procurement with structured requests and route work into sourcing."
              href="/requests"
            />
            <InfoCard
              title="Quotes"
              text="Review vendors and compare pricing options side by side."
              href="/quotes"
            />
            <InfoCard
              title="Orders"
              text="Track approved work and manage what is actively moving."
              href="/orders"
            />
            <InfoCard
              title="Vendors"
              text="Keep supplier relationships and options organized."
              href="/vendors"
            />
            <InfoCard
              title="Saved Items"
              text="Keep shortlisted products available for future decisions."
              href="/saved-items"
            />
            <InfoCard
              title="Profile"
              text="Manage plan, billing, and subscription settings."
              href="/profile"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link href={href} style={card}>
      <div style={cardTitle}>{title}</div>
      <div style={cardText}>{text}</div>
      <div style={cardAction}>Open →</div>
    </Link>
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

const sectionWrap: React.CSSProperties = {
  padding: "28px 0 80px",
};

const container: React.CSSProperties = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "0 20px",
};

const heroCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
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

const titleStyle: React.CSSProperties = {
  margin: "18px 0 0",
  fontSize: "clamp(34px, 6vw, 58px)",
  lineHeight: 1.02,
  fontWeight: 900,
  letterSpacing: "-0.04em",
};

const subtitleStyle: React.CSSProperties = {
  marginTop: "16px",
  maxWidth: "820px",
  fontSize: "20px",
  lineHeight: 1.7,
  color: "#4b5563",
};

const buttonRow: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "22px",
};

const primaryButtonDark: React.CSSProperties = {
  textDecoration: "none",
  background: "#111827",
  color: "white",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 800,
};

const secondaryButton: React.CSSProperties = {
  textDecoration: "none",
  background: "white",
  color: "#111827",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 800,
  border: "1px solid #d1d5db",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
  marginTop: "24px",
};

const card: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "20px",
  textDecoration: "none",
  color: "#111827",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const cardTitle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
};

const cardText: React.CSSProperties = {
  marginTop: "10px",
  color: "#6b7280",
  lineHeight: 1.7,
};

const cardAction: React.CSSProperties = {
  marginTop: "14px",
  color: "#2563eb",
  fontWeight: 800,
};
