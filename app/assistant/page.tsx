"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
};

type AssistantResult = {
  item: string;
  quantity: number;
  best_quote?: {
    vendor_name: string;
    total: number;
    reason: string;
    product_url?: string;
  } | null;
};

export default function AssistantPage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AssistantResult[]>([]);
  const [message, setMessage] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        window.location.href = "/login?next=/assistant";
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, plan")
        .eq("id", user.id)
        .maybeSingle();

      if (!cancelled) {
        if (error) {
          setMessage("Could not load account profile.");
        }

        setProfile(
          (data as ProfileRow | null) || {
            id: user.id,
            email: user.email ?? null,
            plan: "trial",
          }
        );
        setLoadingProfile(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const plan = profile?.plan || "trial";
  const isPremium = plan === "premium";
  const isStarter = plan === "starter";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setResults([]);

    const cleaned = input.trim();

    if (!cleaned) {
      setMessage("Enter at least one item before running AI sourcing.");
      return;
    }

    if (!isPremium && !isStarter) {
      setMessage(
        "AI sourcing is available on paid plans. Upgrade to use the assistant."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: cleaned,
          plan,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.error || "AI request failed.");
        setLoading(false);
        return;
      }

      setResults(Array.isArray(data.results) ? data.results : []);
      setMessage(data.message || "");
    } catch (err) {
      setMessage("AI request failed.");
    }

    setLoading(false);
  }

  if (loadingProfile) {
    return (
      <main style={wrapStyle}>
        <div style={panelStyle}>
          <h1 style={titleStyle}>AI Assistant</h1>
          <p style={mutedStyle}>Loading account...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={wrapStyle}>
      <div style={panelStyle}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={titleStyle}>AI Assistant</h1>
          <p style={mutedStyle}>
            Use AI sourcing to turn a rough item list into supplier suggestions.
          </p>
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontWeight: 800 }}>Current plan: {plan}</div>
          <div style={{ color: "#6b7280", marginTop: "6px" }}>
            {isPremium
              ? "Premium AI sourcing is unlocked."
              : isStarter
              ? "Starter AI sourcing is enabled."
              : "Upgrade to use AI sourcing."}
          </div>

          {!isPremium && !isStarter && (
            <Link href="/pricing" style={upgradeLinkStyle}>
              Upgrade plan
            </Link>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <textarea
            placeholder={`Examples:
gloves - 50
packing tape - 20
stainless prep table - 2`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={7}
            style={textareaStyle}
          />

          <button
            type="submit"
            disabled={loading || (!isPremium && !isStarter)}
            style={{
              ...buttonStyle,
              background:
                loading || (!isPremium && !isStarter) ? "#9ca3af" : "#111827",
              cursor:
                loading || (!isPremium && !isStarter)
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading ? "Running..." : "Run AI Sourcing"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "16px",
              color: message.toLowerCase().includes("failed") ? "#b91c1c" : "#374151",
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </div>
        )}

        <div style={{ display: "grid", gap: "14px", marginTop: "24px" }}>
          {results.map((result, index) => (
            <div
              key={`${result.item}-${index}`}
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "18px",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: "18px" }}>{result.item}</div>
              <div style={{ marginTop: "6px", color: "#6b7280" }}>
                Quantity: {result.quantity}
              </div>

              {result.best_quote ? (
                <>
                  <div style={{ marginTop: "12px" }}>
                    Best Vendor: <strong>{result.best_quote.vendor_name}</strong>
                  </div>
                  <div style={{ marginTop: "6px" }}>
                    Total:{" "}
                    <strong>
                      ${Number(result.best_quote.total || 0).toFixed(2)}
                    </strong>
                  </div>
                  <div style={{ marginTop: "6px", color: "#16a34a" }}>
                    {result.best_quote.reason}
                  </div>

                  {result.best_quote.product_url && (
                    <a
                      href={result.best_quote.product_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "12px",
                        color: "#2563eb",
                        textDecoration: "none",
                        fontWeight: 700,
                      }}
                    >
                      Open supplier →
                    </a>
                  )}
                </>
              ) : (
                <div style={{ marginTop: "10px", color: "#b45309" }}>
                  No strong quote found for this item yet.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const wrapStyle: React.CSSProperties = {
  maxWidth: "980px",
  margin: "0 auto",
  padding: "24px",
};

const panelStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "24px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "32px",
  fontWeight: 800,
};

const mutedStyle: React.CSSProperties = {
  color: "#6b7280",
  marginTop: "8px",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};

const buttonStyle: React.CSSProperties = {
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px",
  fontWeight: 700,
};

const upgradeLinkStyle: React.CSSProperties = {
  display: "inline-block",
  marginTop: "12px",
  background: "#2563eb",
  color: "white",
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  fontWeight: 700,
};
