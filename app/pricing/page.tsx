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

type SessionUser = {
  id: string;
  email: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

function isPaidProfile(profile: ProfileRow | null) {
  if (!profile) return false;

  const paidPlan = profile.plan === "starter" || profile.plan === "premium";
  const activeStatus =
    profile.subscription_status === "active" ||
    profile.subscription_status === "trialing";

  if (!paidPlan || !activeStatus) return false;

  if (!profile.current_period_end) return true;

  const end = new Date(profile.current_period_end).getTime();
  return Number.isFinite(end) && end > Date.now();
}

export default function PricingPage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<"starter" | "premium" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadPricingData() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        const currentUser = session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? null,
            }
          : null;

        setUser(currentUser);

        if (currentUser) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, email, plan, subscription_status, current_period_end")
            .eq("id", currentUser.id)
            .maybeSingle();

          if (error) {
            setMessage("Could not load subscription profile: " + error.message);
          } else {
            setProfile((data as ProfileRow | null) || null);
          }
        }

        const url = new URL(window.location.href);
        const checkoutStatus = url.searchParams.get("checkout");

        if (checkoutStatus === "success") {
          setMessage("Checkout completed. Your subscription is being activated.");
        }

        if (checkoutStatus === "cancel") {
          setMessage("Checkout canceled. No changes were made.");
        }
      } catch (error) {
        console.error(error);
        if (mounted) {
          setMessage("Could not load pricing page.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPricingData();

    return () => {
      mounted = false;
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

  async function startCheckout(plan: "starter" | "premium") {
    setMessage("");
    setCheckoutLoading(plan);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/login?next=/pricing";
        return;
      }

      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
          plan,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        setMessage(data.error || "Could not start checkout.");
        setCheckoutLoading(null);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      setMessage("Could not start checkout.");
      setCheckoutLoading(null);
    }
  }

  const hasPaidPlan = isPaidProfile(profile);

  return (
    <main style={pageWrap}>
      <header style={headerStyle}>
        <div style={headerInner}>
          <Link href="/" style={brandLink}>
            ShukAI
          </Link>

          <nav style={topNav}>
            <Link href="/" style={navLink}>
              Home
            </Link>
            <Link href="/requests" style={navLink}>
              Requests
            </Link>
            <Link href="/quotes" style={navLink}>
              Quotes
            </Link>
            <Link href="/orders" style={navLink}>
              Orders
            </Link>
            <Link href="/assistant" style={navLink}>
              AI Assistant
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
              <Link href="/login?next=/pricing" style={ghostButtonLink}>
                Log in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <section style={heroSection}>
        <div style={container}>
          <div style={heroHeader}>
            <div>
              <div style={eyebrow}>Pricing</div>
              <h1 style={heroTitle}>Choose the plan that fits your workflow.</h1>
              <p style={heroText}>
                Start simple, unlock paid access, and keep your procurement flow in one place.
              </p>
            </div>

            <div style={statusCard}>
              <div style={statusTitle}>Your current access</div>
              {loading ? (
                <div style={statusValue}>Loading...</div>
              ) : user ? (
                <>
                  <div style={statusValue}>
                    {hasPaidPlan
                      ? `${profile?.plan || "paid"} plan`
                      : "Free access"}
                  </div>
                  <div style={statusMeta}>
                    Status: {profile?.subscription_status || "free"}
                  </div>
                  <div style={statusMeta}>
                    Renews / ends: {formatDate(profile?.current_period_end)}
                  </div>
                </>
              ) : (
                <>
                  <div style={statusValue}>Not logged in</div>
                  <div style={statusMeta}>Log in to start a subscription.</div>
                </>
              )}
            </div>
          </div>

          {message && <div style={infoBanner}>{message}</div>}

          <div style={pricingGrid}>
            <PlanCard
              title="Starter"
              price="$29/mo"
              description="For small teams getting organized."
              features={[
                "Requests workflow",
                "Quotes and vendor tracking",
                "Orders visibility",
                "Saved items",
                "Basic account access",
              ]}
              ctaLabel={
                checkoutLoading === "starter" ? "Starting..." : "Start Starter"
              }
              onClick={() => startCheckout("starter")}
              disabled={checkoutLoading !== null}
              highlighted={false}
              note={
                profile?.plan === "starter" && hasPaidPlan
                  ? "You are currently on Starter."
                  : null
              }
            />

            <PlanCard
              title="Premium"
              price="$79/mo"
              description="For teams using AI-powered sourcing workflows."
              features={[
                "Everything in Starter",
                "AI sourcing assistant",
                "Advanced vendor comparison",
                "Priority workflow access",
                "Higher-value automation flow",
              ]}
              ctaLabel={
                checkoutLoading === "premium" ? "Starting..." : "Start Premium"
              }
              onClick={() => startCheckout("premium")}
              disabled={checkoutLoading !== null}
              highlighted
              note={
                profile?.plan === "premium" && hasPaidPlan
                  ? "You are currently on Premium."
                  : "Best for real procurement usage."
              }
            />
          </div>

          <div style={legalBox}>
            <div style={legalTitle}>By subscribing, you agree to our legal terms.</div>
            <div style={legalLinks}>
              <Link href="/terms" style={legalLink}>
                Terms
              </Link>
              <Link href="/privacy" style={legalLink}>
                Privacy Policy
              </Link>
              <Link href="/msa" style={legalLink}>
                Master Subscription Agreement
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PlanCard({
  title,
  price,
  description,
  features,
  ctaLabel,
  onClick,
  disabled,
  highlighted,
  note,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  ctaLabel: string;
  onClick: () => void;
  disabled: boolean;
  highlighted: boolean;
  note: string | null;
}) {
  return (
    <div
      style={{
        ...planCard,
        border: highlighted ? "1px solid #2563eb" : "1px solid #e5e7eb",
        boxShadow: highlighted
          ? "0 12px 30px rgba(37,99,235,0.12)"
          : "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      {highlighted && <div style={planBadge}>Recommended</div>}

      <div style={planTitle}>{title}</div>
      <div style={planPrice}>{price}</div>
      <div style={planDescription}>{description}</div>

      <div style={featureList}>
        {features.map((feature) => (
          <div key={feature} style={featureItem}>
            • {feature}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{
          ...planButton,
          opacity: disabled ? 0.7 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {ctaLabel}
      </button>

      {note && <div style={planNote}>{note}</div>}
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

const heroSection: React.CSSProperties = {
  padding: "32px 0 80px",
};

const container: React.CSSProperties = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "0 20px",
};

const heroHeader: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

const statusCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const statusTitle: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
  fontWeight: 700,
};

const statusValue: React.CSSProperties = {
  marginTop: "8px",
  fontSize: "28px",
  fontWeight: 900,
};

const statusMeta: React.CSSProperties = {
  marginTop: "8px",
  color: "#4b5563",
  lineHeight: 1.6,
};

const infoBanner: React.CSSProperties = {
  marginTop: "20px",
  background: "#eff6ff",
  color: "#1d4ed8",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #bfdbfe",
  fontWeight: 600,
};

const pricingGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
  marginTop: "28px",
};

const planCard: React.CSSProperties = {
  position: "relative",
  background: "white",
  borderRadius: "24px",
  padding: "24px",
};

const planBadge: React.CSSProperties = {
  display: "inline-block",
  marginBottom: "12px",
  background: "#dbeafe",
  color: "#1d4ed8",
  borderRadius: "999px",
  padding: "6px 10px",
  fontWeight: 700,
  fontSize: "12px",
};

const planTitle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 900,
};

const planPrice: React.CSSProperties = {
  marginTop: "10px",
  fontSize: "42px",
  fontWeight: 900,
  letterSpacing: "-0.04em",
};

const planDescription: React.CSSProperties = {
  marginTop: "12px",
  color: "#4b5563",
  lineHeight: 1.7,
};

const featureList: React.CSSProperties = {
  marginTop: "20px",
  display: "grid",
  gap: "10px",
  color: "#374151",
  lineHeight: 1.6,
};

const featureItem: React.CSSProperties = {
  fontSize: "15px",
};

const planButton: React.CSSProperties = {
  marginTop: "24px",
  width: "100%",
  padding: "14px 18px",
  background: "#111827",
  color: "white",
  borderRadius: "14px",
  border: "none",
  fontWeight: 800,
  fontSize: "15px",
};

const planNote: React.CSSProperties = {
  marginTop: "12px",
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: 1.6,
};

const legalBox: React.CSSProperties = {
  marginTop: "28px",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "18px 20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const legalTitle: React.CSSProperties = {
  fontWeight: 800,
  color: "#111827",
};

const legalLinks: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  marginTop: "10px",
};

const legalLink: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 700,
};
