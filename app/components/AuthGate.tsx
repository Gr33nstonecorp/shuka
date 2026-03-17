"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const isSignedIn = !!session;
      setSignedIn(isSignedIn);
      setLoading(false);

      if (!isSignedIn && pathname !== "/login") {
        router.replace("/login");
      }

      if (isSignedIn && pathname === "/login") {
        router.replace("/");
      }
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const isSignedIn = !!session;
      setSignedIn(isSignedIn);

      if (!isSignedIn && pathname !== "/login") {
        router.replace("/login");
      }

      if (isSignedIn && pathname === "/login") {
        router.replace("/");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  if (loading && pathname !== "/login") {
    return <main style={{ padding: "32px" }}>Loading...</main>;
  }

  if (!signedIn && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
