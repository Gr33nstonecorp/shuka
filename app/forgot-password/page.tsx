"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage("Reset request failed: " + error.message);
      setLoading(false);
      return;
    }

    setMessage("Check your email for the password reset link.");
    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "white",
          borderRadius: "16px",
          padding: "28px",
          border: "1px solid #ddd",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Reset password</h1>
        <p style={{ color: "#555", marginTop: 0 }}>
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleReset} style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={primaryButtonStyle}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "16px", color: "#333", whiteSpace: "pre-wrap" }}>
            {message}
          </p>
        )}

        <div style={{ marginTop: "16px" }}>
          <Link
            href="/login"
            style={{
              fontSize: "13px",
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "12px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};
