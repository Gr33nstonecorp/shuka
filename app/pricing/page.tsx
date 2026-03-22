"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
};

export default function PricingPage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
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
    let cancelled = false;

    async function loadProfile() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled) return;

        const user = session?.user ?? null;

        if (!user) {
          setAuthUser(null);
          setProfile(null);
          setLoadingProfile(false);
          return;
        }

        setAuthUser({
          id: user.id,
          email: user.email ?? null,
        });

        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, plan")
          .eq("id", user.id)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error("Profile fetch error:", error.message);
        }

        setProfile(
          data || {
            id: user.id,
            email: user.email ?? null,
            plan: "trial",
          }
        );
      } catch (err) {
        console.error("Pricing load failed:", err);
      } finally {
        if (!cancelled) {
          setLoadingProfile(false);
        }
      }
    }

    const timeout = setTimeout(() => {
      if (!cancelled) {
        setLoadingProfile(false);
      }
    }, 2500);

    loadProfile();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [supabase]);

  async function startCheckout(plan: "starter" | "premium") {
    const userId = profile?.id || authUser?.id;
    const email = profile?.email || authUser?.email || null;

    if (!userId) {
      setMessage("Please log in first.");
      return;
    }

    setLoadingPlan(plan);
    setMessage("");

    try {
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
    } catch (err) {
      console.error(err);
      setMessage("Checkout failed.");
      setLoadingPlan(null);
    }
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1>Pricing</h1>

      {loadingProfile ? (
        <p>Loading account...</p>
      ) : (
        <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h2>Starter — $9/mo</h2>
            <button
              onClick={() => startCheckout("starter")}
              disabled={loadingPlan !== null}
            >
              {loadingPlan === "starter" ? "Starting..." : "Start Trial"}
            </button>
          </div>

          <div
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h2>Premium — $25/mo</h2>
            <button
              onClick={() => startCheckout("premium")}
              disabled={loadingPlan !== null}
            >
              {loadingPlan === "premium" ? "Starting..." : "Start Trial"}
            </button>
          </div>
        </div>
      )}

      {message && (
        <p style={{ marginTop: "20px", color: "red" }}>{message}</p>
      )}
    </main>
  );
}
