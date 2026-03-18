"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function EnsureProfile() {
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function run() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          plan: "trial",
        });

        console.log("Profile created ✅");
      } else {
        console.log("Profile exists ✅");
      }
    }

    run();
  }, []);

  return null;
}
