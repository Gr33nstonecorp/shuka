"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type UserState = {
  email: string | null;
};

export default function Navbar() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { email: session.user.email ?? null } : null);
      setLoading(false);
    }).catch((error) => {
      console.error("Session load error:", error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email ?? null } : null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      window.location.href = "/";
    }
  }

  return (
    <header className="bg-zinc-950 text-white border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <Link href="/" className="text-3xl font-black tracking-tighter">
          ShukAI
        </Link>

        <nav className="flex items-center gap-3 flex-wrap">
          <Link href="#workspace" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Workspace
          </Link>
          <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/assistant" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            AI Assistant
          </Link>

          {loading ? (
            <div className="px-5 py-2.5 text-sm text-zinc-400">Loading...</div>
          ) : user ? (
            <>
              <span className="text-sm text-zinc-400 px-3 hidden sm:inline">{user.email}</span>
              <Link
                href="/profile"
                className="px-5 py-2.5 text-sm font-semibold rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 text-sm font-semibold rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-semibold rounded-2xl hover:bg-zinc-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/login?next=/pricing"
                className="px-6 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all active:scale-[0.985] shadow-lg shadow-blue-500/30"
              >
                Start free trial
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
