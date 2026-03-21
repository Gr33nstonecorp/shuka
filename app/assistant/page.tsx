"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
};

export default function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("id, email, plan")
        .eq("id", user.id)
        .maybeSingle();

      setProfile((data as ProfileRow | null) || null);
    }

    loadProfile();
  }, [supabase]);

  const isPremium = profile?.plan === "premium";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResults([]);

    if (!isPremium) {
      setMessage(
        "Premium required for advanced AI sourcing. Upgrade to unlock multi-item smart sourcing."
      );
      setLoading(false);
      return;
    }

    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMessage(data.error || "AI request failed.");
      setLoading(false);
      return;
    }

    setResults(data.results || []);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: "980px", margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>
          AI Assistant
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Premium users can source multiple items with smarter vendor selection.
        </p>
      </div>

      {!isPremium && (
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontWeight: 800 }}>Premium Feature</div>
          <div style={{ marginTop: "6px" }}>
            AI multi-item sourcing is available on Premium.
          </div>
          <Link
            href="/pricing"
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "#2563eb",
              color: "white",
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            Upgrade
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        <textarea
          placeholder="Example: gloves - 50, tape - 20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "14px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: isPremium ? "#111827" : "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px",
            fontWeight: 700,
            cursor: isPremium ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Running..." : "Run AI Sourcing"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "16px", color: "#b91c1c" }}>{message}</p>
      )}

      <div style={{ display: "grid", gap: "14px", marginTop: "24px" }}>
        {results.map((result, index) => (
          <div
            key={index}
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <div style={{ fontWeight: 800 }}>{result.item}</div>
            <div style={{ marginTop: "6px", color: "#6b7280" }}>
              Quantity: {result.quantity}
            </div>

            {result.best_quote && (
              <>
                <div style={{ marginTop: "10px" }}>
                  Best Vendor: <strong>{result.best_quote.vendor_name}</strong>
                </div>
                <div style={{ marginTop: "6px" }}>
                  Total: <strong>${Number(result.best_quote.total || 0).toFixed(2)}</strong>
                </div>
                <div style={{ marginTop: "6px", color: "#16a34a" }}>
                  {result.best_quote.reason}
                </div>
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
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
