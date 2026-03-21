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
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) {
        setMessage("You are not logged in.");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, plan, stripe_customer_id, stripe_subscription_id")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setMessage(error.message);
        return;
      }

      setProfile((data as ProfileRow | null) || null);
    }

    loadProfile();
  }, [supabase]);

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginTop: 0 }}>Profile</h1>

      <button
        onClick={async () => {
          if (!profile?.id) {
            alert("No user profile found.");
            return;
          }

          const res = await fetch("/api/stripe/portal", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: profile.id }),
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            alert(data.error || "Could not open billing portal.");
            return;
          }

          window.location.href = data.url;
        }}
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

      {profile && (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "18px",
            marginTop: "20px",
          }}
        >
          <div style={{ fontWeight: 800 }}>{profile.email || "No email"}</div>
          <div style={{ color: "#6b7280", marginTop: "6px", fontSize: "14px" }}>
            Plan: {profile.plan || "starter"}
          </div>
          <div style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
            Stripe Customer: {profile.stripe_customer_id || "—"}
          </div>
          <div style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
            Stripe Subscription: {profile.stripe_subscription_id || "—"}
          </div>
        </div>
      )}
    </main>
  );
}
