"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

type Profile = {
  email: string | null;
  plan: string | null;
  subscription_status: string | null;
  current_period_end: string | null;
};

function isCancelable(profile: Profile | null) {
  if (!profile) return false;

  return (
    profile.plan !== "free" &&
    profile.subscription_status !== "canceled" &&
    profile.subscription_status !== "inactive"
  );
}

export default function ProfilePage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/login?next=/profile";
        return;
      }

      const user = session.user;

      const { data, error } = await supabase
        .from("profiles")
        .select("plan, subscription_status, current_period_end")
        .eq("id", user.id)
        .single();

      if (error) {
        alert("Could not load profile.");
        setLoading(false);
        return;
      }

      setProfile({
        email: user.email ?? null,
        plan: data?.plan ?? "free",
        subscription_status: data?.subscription_status ?? "inactive",
        current_period_end: data?.current_period_end ?? null,
      });

      setLoading(false);
    }

    loadProfile();
  }, [supabase]);

  async function cancelSubscription() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user || !session.access_token) {
      window.location.href = "/login?next=/profile";
      return;
    }

    const confirmed = window.confirm(
      "This will cancel your subscription immediately and stop future charges. Continue?"
    );

    if (!confirmed) return;

    const res = await fetch("/api/stripe/cancel-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.error || "Could not cancel subscription.");
      return;
    }

    alert(data.message || "Subscription canceled.");
    window.location.reload();
  }

  if (loading) {
    return (
      <main style={wrap}>
        <div style={card}>Loading...</div>
      </main>
    );
  }

  return (
    <main style={wrap}>
      <div style={card}>
        <h1 style={{ marginTop: 0 }}>Profile</h1>

        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Plan:</strong> {profile?.plan}</p>
        <p><strong>Status:</strong> {profile?.subscription_status}</p>

        {profile?.current_period_end && (
          <p>
            <strong>Current period ends:</strong>{" "}
            {new Date(profile.current_period_end).toLocaleDateString()}
          </p>
        )}

        {isCancelable(profile) ? (
          <button onClick={cancelSubscription} style={button}>
            Cancel Subscription
          </button>
        ) : (
          <div style={mutedBox}>
            No active subscription to cancel.
          </div>
        )}
      </div>
    </main>
  );
}

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f3f4f6",
};

const card: React.CSSProperties = {
  background: "white",
  padding: "28px",
  borderRadius: "16px",
  border: "1px solid #ddd",
  width: "100%",
  maxWidth: "500px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const button: React.CSSProperties = {
  marginTop: "20px",
  padding: "12px 16px",
  borderRadius: "10px",
  background: "#111827",
  color: "white",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const mutedBox: React.CSSProperties = {
  marginTop: "20px",
  padding: "12px 16px",
  borderRadius: "10px",
  background: "#f3f4f6",
  color: "#4b5563",
  border: "1px solid #e5e7eb",
  fontWeight: 600,
};
