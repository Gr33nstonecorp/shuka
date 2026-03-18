"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const access_token = params.get("access_token");

      if (access_token) {
        supabase.auth.setSession({
          access_token,
          refresh_token: access_token,
        });
      }
    }
  }, []);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Password updated!");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Reset Password</h1>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 10, marginTop: 10 }}
      />

      <br /><br />

      <button onClick={handleReset} style={{ padding: 10 }}>
        Update Password
      </button>

      <p>{message}</p>
    </div>
  );
}
