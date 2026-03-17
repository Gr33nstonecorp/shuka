"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export default function LoginPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setMessage("Login failed: " + error.message);
      return;
    }

    setMessage("Check your email for the login link.");
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
          maxWidth: "420px",
          background: "white",
          borderRadius: "16px",
          padding: "28px",
          border: "1px solid #ddd",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Login to Shuka</h1>
        <p style={{ color: "#555", marginTop: 0 }}>
          Sign in with your email to access your procurement workspace.
        </p>

        <form
          onSubmit={handleMagicLink}
          style={{ display: "grid", gap: "12px", marginTop: "20px" }}
        >
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Send Magic Link
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "16px", color: "#333" }}>{message}</p>
        )}
      </div>
    </main>
  );
}
