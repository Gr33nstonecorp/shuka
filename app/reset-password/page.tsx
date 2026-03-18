"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Checking reset link...");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setMessage("");
        return;
      }

      if (session) {
        setReady(true);
        setMessage("");
      }
    });

    async function checkExistingSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setReady(true);
        setMessage("");
        return;
      }

      setReady(false);
      setMessage(
        "Open the newest reset link directly from your email, then set your new password here."
      );
    }

    checkExistingSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage("Password reset failed: " + error.message);
      setLoading(false);
      return;
    }

    setMessage("✅ Password updated. You can now log in.");
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
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Reset Password</h1>
        <p style={{ color: "#555", marginTop: 0 }}>
          Enter your new password below.
        </p>

        <form
          onSubmit={handleUpdatePassword}
          style={{ display: "grid", gap: "12px", marginTop: "18px" }}
        >
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={!ready || loading}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />

          <button
            type="submit"
            disabled={!ready || loading}
            style={{
              padding: "12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: ready && !loading ? "pointer" : "not-allowed",
              fontWeight: "bold",
              opacity: ready && !loading ? 1 : 0.6,
            }}
          >
            {loading ? "Updating..." : "Update Password"}
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
