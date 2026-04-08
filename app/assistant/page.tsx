"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type ProfileRow = {
  id: string;
  email: string | null;
  plan: string | null;
  subscription_status: string | null;
  current_period_end: string | null;
};

export default function AssistantPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setDebugInfo("No session found - please log in again");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        setDebugInfo(`Profile error: ${error.message}`);
      } else if (data) {
        setProfile(data as ProfileRow);
        setDebugInfo(`Profile loaded: plan=${data.plan}, status=${data.subscription_status}, end=${data.current_period_end}`);
      } else {
        setDebugInfo("No profile found for this user");
      }
    } catch (err: any) {
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Simple access check - we'll improve it later
  const hasAccess = true; // ← TEMPORARY: bypass for testing

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Access Required</h1>
          <p className="text-zinc-600 mb-8">Active paid subscription or trial required for AI Assistant.</p>
          <Link href="/pricing" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-black block">
            View Pricing & Upgrade
          </Link>
          {debugInfo && <p className="mt-6 text-xs text-gray-500">{debugInfo}</p>}
        </div>
      </div>
    );
  }

  // If we reach here, show the real AI Assistant
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <h1 className="text-4xl font-bold mb-8">AI Assistant</h1>
      <p className="text-green-600 mb-6">✅ Access granted! (Trial logic bypassed for testing)</p>
      
      <div className="bg-white rounded-3xl p-8">
        <p className="mb-4">The full AI Assistant UI is now visible.</p>
        <p>Run a query to test.</p>
      </div>

      {debugInfo && <p className="mt-8 text-xs text-gray-500">{debugInfo}</p>}
    </div>
  );
}
