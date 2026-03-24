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
      setLoading(false);
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
    await supabase.auth.signOut();
    window.location.href = "/";
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
