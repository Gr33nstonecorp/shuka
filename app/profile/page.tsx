"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

export default function ProfilePage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [authUser, setAuthUser] = useState<{ id: string; email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user ?? null;

        if (!user) {
          if (!cancelled) {
            window.location.href = "/login";
          }
          return;
        }

        if (!cancelled) {
          setAuthUser({
            id: user.id,
            email: user.email ?? null,
          });
        }

        const { data } = await supabase
          .from("profiles")
          .select("id, email, plan, stripe_customer_id, stripe_subscription_id")
          .eq("email", user.email ?? "")
          .maybeSingle();

        if (!cancelled) {
          setProfile(
            data || {
              id: user.id,
              email: user.email ?? null,
              plan: "trial",
              stripe_customer_id: null,
              stripe_subscription_id: null,
            }
          );
          setLoading(false);
        }
      } catch (err) {
        console.error("Profile load failed:", err);
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function openPortal() {
    const userId = profile?.id || authUser?.id;
    const email = profile?.email || authUser?.email || null;

    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, email }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.error || "Could not open billing portal.");
      return;
    }

    window.location.href = data.url;
  }

  if (loading) {
    return (
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        <h1 style={{ marginTop: 0 }}>Profile</h1>
        <p>Loading account...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginTop: 0 }}>Profile</h1>

      <button
        onClick={openPortal}
        style={{
          marginTop: "20px",
          padding: "12px 16px",
          background: "#111827",
          color: "white",
          borderRadius: "10px",
          border: "none",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        Manage Subscription
      </button>

      <p style={{ color: "#6b7280", marginTop: "16px" }}>
        View your current plan and manage billing.
      </p>

      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "18px",
          marginTop: "20px",
        }}
      >
        <div style={{ fontWeight: 800 }}>
          {profile?.email || authUser?.email || "No email"}
        </div>
        <div style={{ color: "#6b7280", marginTop: "6px", fontSize: "14px" }}>
          Plan: {profile?.plan || "trial"}
        </div>
        <div style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
          Stripe Customer: {profile?.stripe_customer_id || "—"}
        </div>
        <div style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
          Stripe Subscription: {profile?.stripe_subscription_id || "—"}
        </div>
      </div>
    </main>
  );
}
