"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

export default function HomePage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled) return;

        if (session?.user) {
          window.location.href = "/pricing";
          return;
        }

        setCheckingAuth(false);
      } catch (err) {
        console.error("Home auth check failed:", err);
        if (!cancelled) setCheckingAuth(false);
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  if (checkingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#06122b",
          color: "white",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div>Loading...</div>
      </main>
    );
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
            <a
              href="#features"
              style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}
            >
              How it works
            </a>
            <a
              href="/pricing"
              style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}
            >
              Pricing
            </a>
            <a
              href="/login"
              style={{
                textDecoration: "none",
                color: "white",
                padding: "10px 16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.08)",
                fontWeight: 700,
              }}
            >
              Log in
            </a>
            <a
              href="/login?next=/pricing"
              style={{
                textDecoration: "none",
                color: "white",
                padding: "10px 16px",
                borderRadius: "12px",
                background: "#2563eb",
                fontWeight: 700,
              }}
            >
              Start free trial
            </a>
          </nav>
        </div>
      </header>

      <section
        style={{
          background:
            "linear-gradient(180deg, #06122b 0%, #0b1b3d 55%, #f8fafc 55%, #f8fafc 100%)",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "28px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(37,99,235,0.15)",
                  color: "#93c5fd",
                  border: "1px solid rgba(147,197,253,0.25)",
                  borderRadius: "999px",
                  padding: "8px 12px",
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: "18px",
                }}
              >
                AI procurement for modern teams
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(38px, 7vw, 64px)",
                  lineHeight: 1.02,
                  color: "white",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
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
                Shuka helps teams move faster with AI-powered sourcing, vendor
                comparison, approvals, saved items, and order workflows without
                juggling spreadsheets, inbox threads, and disconnected tools.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginTop: "26px",
                }}
              >
                <a
                  href="/login?next=/pricing"
                  style={{
                    textDecoration: "none",
                    background: "#2563eb",
                    color: "white",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    fontWeight: 800,
                    boxShadow: "0 10px 25px rgba(37,99,235,0.25)",
                  }}
                >
                  Start free trial
                </a>

                <a
                  href="/pricing"
                  style={{
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    fontWeight: 800,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  View pricing
                </a>
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
                  <FeatureCard
                    title="AI sourcing"
                    big="Faster"
                    text="Generate vendor options from a single request."
                    bg="#eff6ff"
                    border="#bfdbfe"
                    titleColor="#1d4ed8"
                  />
                  <FeatureCard
                    title="Quote comparison"
                    big="Clearer"
                    text="Compare vendors, pricing, and fit side by side."
                    bg="#f8fafc"
                    border="#e2e8f0"
                    titleColor="#334155"
                  />
                  <FeatureCard
                    title="Approvals"
                    big="Simpler"
                    text="Keep requests, decisions, and order context together."
                    bg="#f8fafc"
                    border="#e2e8f0"
                    titleColor="#334155"
                  />
                  <FeatureCard
                    title="Purchasing flow"
                    big="Centralized"
                    text="Manage saved items, orders, and shipments in one workspace."
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
        id="features"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "26px 20px 20px",
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
            Everything your team needs to move from request to purchase.
          </h2>
          <p
            style={{
              marginTop: "14px",
              color: "#475569",
              fontSize: "18px",
              lineHeight: 1.7,
            }}
          >
            Built for teams that need structure, speed, and visibility across the
            purchasing process.
          </p>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
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
