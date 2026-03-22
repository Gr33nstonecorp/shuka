"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
};

export default function PricingPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [authUser, setAuthUser] = useState<{ id: string; email: string | null } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user ?? null;

        if (!user) {
          if (isMounted) {
            setAuthUser(null);
            setProfile(null);
            setLoadingProfile(false);
          }
          return;
        }

        if (isMounted) {
          setAuthUser({
            id: user.id,
            email: user.email ?? null,
          });
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, plan")
          .eq("id", user.id)
          .maybeSingle();

        if (isMounted) {
          if (error) {
            console.error("Profile fetch error:", error.message);
          }

          setProfile(
            data
              ? (data as ProfileRow)
              : {
                  id: user.id,
                  email: user.email ?? null,
                  plan: "trial",
                }
          );
          setLoadingProfile(false);
        }
      } catch (err) {
        console.error("Profile load failed:", err);
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    }

    const timeout = setTimeout(() => {
      if (isMounted) {
        setLoadingProfile(false);
      }
    }, 3000);

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function startCheckout(plan: "starter" | "premium") {
    if (loadingProfile) {
      setMessage("Still loading your account. Try again in a second.");
      return;
    }

    const userId = profile?.id || authUser?.id;
    const email = profile?.email || authUser?.email || null;

    if (!userId) {
      setMessage("Please log in first.");
      return;
    }

    setLoadingPlan(plan);
    setMessage("");

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan,
        userId,
        email,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMessage(data.error || "Could not start checkout.");
      setLoadingPlan(null);
      return;
    }

    window.location.href = data.url;
  }

  if (loadingProfile) {
    return (
      <main style={{ maxWidth: "980px", margin: "0 auto", padding: "24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>
            Pricing
          </h1>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            Start with a 7-day free trial, then continue on the plan that fits your workflow.
          </p>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
            textAlign: "center",
            fontWeight: 700,
            color: "#374151",
          }}
        >
          Loading account...
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "980px", margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>
          Pricing
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Start with a 7-day free trial, then continue on the plan that fits your workflow.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "18px",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              borderRadius: "999px",
              background: "#fef3c7",
              color: "#92400e",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            Starter
          </div>

          <h2 style={{ marginTop: 0, marginBottom: "8px" }}>$9/mo</h2>
          <p style={{ color: "#4b5563", lineHeight: 1.7 }}>
            Manual procurement workflow for solo buyers and small teams.
          </p>

          <ul style={{ color: "#4b5563", lineHeight: 1.9, paddingLeft: "18px" }}>
            <li>Create requests</li>
            <li>Generate quotes</li>
            <li>Compare vendors</li>
            <li>Manual approvals</li>
            <li>Orders and saved items</li>
            <li>Basic AI assistant</li>
          </ul>

          <button
            onClick={() => startCheckout("starter")}
            disabled={loadingPlan !== null}
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {loadingPlan === "starter" ? "Starting..." : "Start 7-Day Trial"}
          </button>
        </div>

        <div
          style={{
            background: "white",
            border: "2px solid #2563eb",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              borderRadius: "999px",
              background: "#dbeafe",
              color: "#1d4ed8",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            Premium
          </div>

          <h2 style={{ marginTop: 0, marginBottom: "8px" }}>$25/mo</h2>
          <p style={{ color: "#4b5563", lineHeight: 1.7 }}>
            Advanced AI sourcing and premium automation for faster procurement.
          </p>

          <ul style={{ color: "#4b5563", lineHeight: 1.9, paddingLeft: "18px" }}>
            <li>Everything in Starter</li>
            <li>AI multi-item sourcing</li>
            <li>Smarter vendor ranking</li>
            <li>Automation features</li>
            <li>Preferred vendor logic</li>
            <li>Premium workflows</li>
          </ul>

          <button
            onClick={() => startCheckout("premium")}
            disabled={loadingPlan !== null}
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {loadingPlan === "premium" ? "Starting..." : "Start 7-Day Trial"}
          </button>
        </div>
      </div>

      {message && (
        <p style={{ marginTop: "16px", color: "#b91c1c" }}>{message}</p>
      )}
    </main>
  );
}
