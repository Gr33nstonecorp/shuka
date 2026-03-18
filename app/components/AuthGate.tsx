"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Please log in to continue</h2>
      </div>
    );
  }

  return <>{children}</>;
}
