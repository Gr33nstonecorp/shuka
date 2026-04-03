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

  useEffect(() => {
    async function checkLogin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error("Login check failed:", error);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
            className="inline-block px-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl hover:bg-black"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  // Logged in - show placeholder for now
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">AI Assistant</h1>
        <p className="mb-8 text-zinc-600">
          AI-powered sourcing is available for logged-in users.
        </p>
        
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-3xl border text-center">
          <p className="text-lg mb-6">The full AI sourcing functionality is coming soon.</p>
          <p className="text-sm text-zinc-500">You can test the Requests page in the meantime.</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
