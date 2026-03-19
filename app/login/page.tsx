"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

type Mode = "login" | "signup" | "magic";

export default function LoginPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessage("Login failed: " + error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: "https://www.shukai.co/",
      },
    });

    if (error) {
      setMessage("Sign up failed: " + error.message);
      setLoading(false);
      return;
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setMessage("An account with this email already exists. Try Password Login instead.");
      setMode("login");
      setLoading(false);
      return;
    }

    setMessage("Account created. You can now log in with your password.");
    setMode("login");
    setPassword("");
    setLoading(false);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: "https://www.shukai.co/",
      },
    });

    if (error) {
      setMessage("Magic link failed: " + error.message);
      setLoading(false);
      return;
    }

    setMessage("Check your email for the magic link.");
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
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Login to Shukai</h1>
        <p style={{ color: "#555", marginTop: 0 }}>
          Sign in with your password, create an account, or use a magic link.
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "18px",
            marginBottom: "18px",
            flexWrap: "wrap",
          }}
        >
          <TabButton
            active={mode === "login"}
            onClick={() => setMode("login")}
            label="Password Login"
          />
          <TabButton
            active={mode === "signup"}
            onClick={() => setMode("signup")}
            label="Sign Up"
          />
          <TabButton
            active={mode === "magic"}
            onClick={() => setMode("magic")}
            label="Magic Link"
          />
        </div>

        {mode === "login" && (
          <form onSubmit={handlePasswordLogin} style={{ display: "grid", gap: "12px" }}>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                href="/forgot-password"
                style={{
                  fontSize: "13px",
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} style={primaryButtonStyle}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignup} style={{ display: "grid", gap: "12px" }}>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              style={inputStyle}
            />

            <button type="submit" disabled={loading} style={primaryButtonStyle}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}

        {mode === "magic" && (
          <form onSubmit={handleMagicLink} style={{ display: "grid", gap: "12px" }}>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />

            <button type="submit" disabled={loading} style={primaryButtonStyle}>
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        )}

        {message && (
          <p style={{ marginTop: "16px", color: "#333", whiteSpace: "pre-wrap" }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: "8px",
        border: active ? "1px solid #111827" : "1px solid #d1d5db",
        background: active ? "#111827" : "white",
        color: active ? "white" : "#111827",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {label}
    </button>
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
