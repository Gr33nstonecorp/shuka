"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
  trial_ends_at: string | null;
};

function getPlanLabel(profile: ProfileRow | null) {
  if (!profile) return "";

  const plan = (profile.plan || "trial").toLowerCase();

  if (plan === "premium") return "Premium";
  if (plan === "starter") return "Starter";

  if (plan === "trial") {
    if (!profile.trial_ends_at) return "Trial";

    const now = new Date();
    const end = new Date(profile.trial_ends_at);
    const diffMs = end.getTime() - now.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return `Trial · ${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
  }

  return plan;
}

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUserAndProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!mounted) return;

      setEmail(user?.email || "");

      if (!user) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, email, plan, trial_ends_at")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;
      setProfile((data as ProfileRow | null) || null);
    }

    loadUserAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user;

      setEmail(user?.email || "");

      if (!user) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, email, plan, trial_ends_at")
        .eq("id", user.id)
        .maybeSingle();

      setProfile((data as ProfileRow | null) || null);
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

  const planLabel = getPlanLabel(profile);

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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  lineHeight: 1.2,
                }}
              >
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

                {planLabel && (
                  <span
                    style={{
                      marginTop: "4px",
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 700,
                      background:
                        profile?.plan === "premium"
                          ? "#dcfce7"
                          : profile?.plan === "starter"
                          ? "#dbeafe"
                          : "#fef3c7",
                      color:
                        profile?.plan === "premium"
                          ? "#166534"
                          : profile?.plan === "starter"
                          ? "#1d4ed8"
                          : "#92400e",
                    }}
                  >
                    {planLabel}
                  </span>
                )}
              </div>

              <Link
                href="/pricing"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "12px",
                  background: "#2563eb",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  fontWeight: 700,
                }}
              >
                Upgrade
              </Link>

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
