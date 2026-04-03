"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setIsLoggedIn(true);
          setUserEmail(session.user.email || null);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email || null);
      } else {
        setIsLoggedIn(false);
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-xl">Loading assistant...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Access Required</h1>
          <p className="text-zinc-600 mb-8">Please log in to use the AI Assistant.</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl hover:bg-black transition"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  // Logged in - show the assistant interface
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-semibold px-5 py-2 rounded-full mb-6">
            AI Sourcing Engine
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none mb-6">
            Welcome back, {userEmail?.split('@')[0] || "User"}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Enter your items below and let ShukAI find the best suppliers.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Items to source</label>
              <textarea
                placeholder="gloves - 50&#10;packing tape - 20&#10;shipping labels - 10"
                className="w-full resize-y min-h-[180px] p-6 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-blue-500 font-mono text-sm"
                rows={8}
              />
              <p className="mt-3 text-xs text-zinc-500">One item per line • Format: Item name - quantity</p>
            </div>

            <button
              type="button"
              className="w-full py-4 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl transition"
            >
              Run AI Sourcing
            </button>
          </form>
        </div>

        <div className="text-center text-zinc-500">
          Full AI sourcing functionality is coming soon.<br />
          <Link href="/" className="text-blue-600 hover:underline">← Back to Homepage</Link>
        </div>
      </div>
    </main>
  );
}
