"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setEmail(session?.user?.email || "");
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email || "");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const links = [
    ["Dashboard", "/"],
    ["Requests", "/requests"],
    ["Quotes", "/quotes"],
    ["Approvals", "/approvals"],
    ["Orders", "/orders"],
    ["Saved Items", "/saved-items"],
    ["Shipments", "/shipments"],
    ["Vendors", "/vendors"],
    ["AI", "/assistant"],
    ["Profile", "/profile"],
  ] as const;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#0f172a",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          gap: "12px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: "18px",
            color: "white",
            whiteSpace: "nowrap",
          }}
        >
          Shuka
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            paddingBottom: "4px",
            flex: 1,
          }}
        >
          {links.map(([label, href]) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

            return (
              <Link
                key={href}
                href={href}
                style={{
                  color: isActive ? "white" : "#9ca3af",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "6px 10px",
                  borderRadius: "8px",
                  whiteSpace: "nowrap",
                  background: isActive ? "#1f2937" : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            whiteSpace: "nowrap",
          }}
        >
          {email ? (
            <>
              <span
                style={{
                  color: "#9ca3af",
                  fontSize: "12px",
                  maxWidth: "160px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={email}
              >
                {email}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  background: "#1f2937",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "12px",
                background: "#1f2937",
                padding: "6px 10px",
                borderRadius: "8px",
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
