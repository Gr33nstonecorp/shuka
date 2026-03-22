"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

export default function ProfilePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [authUser, setAuthUser] = useState<{ id: string; email: string | null } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
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
          .select("id, email, plan, stripe_customer_id, stripe_subscription_id")
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
                  stripe_customer_id: null,
                  stripe_subscription_id: null,
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

  async function openPortal() {
    const userId = profile?.id || authUser?.id;

    if (!userId) {
      alert("No user profile found.");
      return;
    }

    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.error || "Could not open billing portal.");
      return;
    }

    window.location.href = data.url;
  }

  if (loadingProfile) {
    return (
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        <h1 style={{ marginTop: 0 }}>Profile</h1>
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "18px",
            marginTop: "20px",
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

      {message && (
        <p style={{ color: "#b91c1c", marginTop: "16px" }}>{message}</p>
      )}

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
