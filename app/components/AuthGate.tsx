"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let active = true;

    async function checkAuth() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!active) return;

        if (error) {
          console.error("AuthGate session error:", error.message);
        }

        const nextUser = session?.user ?? null;
        setUser(nextUser);

        const isPublic = PUBLIC_ROUTES.includes(pathname);

        if (!nextUser && !isPublic) {
          router.replace("/login");
        } else if (nextUser && pathname === "/login") {
          router.replace("/");
        }
      } catch (err) {
        console.error("AuthGate unexpected error:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      const isPublic = PUBLIC_ROUTES.includes(pathname);

      if (!nextUser && !isPublic) {
        router.replace("/login");
      } else if (nextUser && pathname === "/login") {
        router.replace("/");
      }

      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (isPublic) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
