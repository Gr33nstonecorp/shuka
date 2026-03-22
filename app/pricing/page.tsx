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
  const [authUser, setAuthUser] = useState<{
    id: string;
    email: string | null;
  } | null>(null);

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

        const { data } = await supabase
          .from("profiles")
          .select("id, email, plan")
          .eq("id", user.id)
          .maybeSingle();

        if (isMounted) {
          setProfile(
            data || {
              id: user.id,
              email: user.email ?? null,
              plan: "trial",
            }
          );
          setLoadingProfile(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoadingProfile(false);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function startCheckout(plan: "starter" | "premium") {
    if (loadingProfile) {
      setMessage("Loading your account...");
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
      setMessage(data.error || "Checkout failed.");
      setLoadingPlan(null);
      return;
    }

    window.location.href = data.url;
  }

  if (loadingProfile) {
    return (
      <main style={{ padding: "24px", textAlign: "center" }}>
        <h1>Pricing</h1>
        <p>Loading account...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1>Pricing</h1>

      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "12px" }}>
          <h2>Starter — $9/mo</h2>
          <button
            onClick={() => startCheckout("starter")}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === "starter" ? "Starting..." : "Start Trial"}
          </button>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "12px" }}>
          <h2>Premium — $25/mo</h2>
          <button
            onClick={() => startCheckout("premium")}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === "premium" ? "Starting..." : "Start Trial"}
          </button>
        </div>
      </div>

      {message && (
        <p style={{ marginTop: "20px", color: "red" }}>{message}</p>
      )}
    </main>
  );
}
