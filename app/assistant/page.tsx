"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setMessage("Please log in to use the AI Assistant.");
          setLoading(false);
          return;
        }

        // For now, we'll assume paid access if logged in (you can tighten this later)
        setHasAccess(true);
      } catch (error) {
        console.error(error);
        setMessage("Failed to load assistant access. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-xl">Loading assistant...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Access Required</h1>
          <p className="text-zinc-600 mb-8">{message || "Please log in with an active subscription to use the AI Assistant."}</p>
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">AI Assistant</h1>
        <p className="text-zinc-600 mb-8">This is the AI Assistant page. The full functionality will be added soon.</p>
        
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border">
          <p className="text-center text-zinc-500">AI Sourcing coming soon...</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
