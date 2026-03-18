"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

export default function EnsureProfile() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let cancelled = false;

    async function ensureProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || cancelled) return;

      const user = session.user;
      const userId = user.id;
      const email = user.email || "";

      const { data: existingProfile, error: selectError } = await supabase
        .from("profiles")
        .select("id, plan, trial_ends_at")
        .eq("id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (selectError) {
        console.error("Profile lookup failed:", selectError.message);
        return;
      }

      if (!existingProfile) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: userId,
          email,
          plan: "trial",
        });

        if (insertError) {
          console.error("Profile creation failed:", insertError.message);
        }
      }
    }

    ensureProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) return;

      const user = session.user;

      supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle()
        .then(async ({ data, error }) => {
          if (error) {
            console.error("Profile lookup failed:", error.message);
            return;
          }

          if (!data) {
            const { error: insertError } = await supabase.from("profiles").insert({
              id: user.id,
              email: user.email || "",
              plan: "trial",
            });

            if (insertError) {
              console.error("Profile creation failed:", insertError.message);
            }
          }
        });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return null;
}
