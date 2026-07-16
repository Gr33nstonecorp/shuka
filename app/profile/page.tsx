"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile & Garage States
  const [fullName, setFullName] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Get authenticated session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      
      setUser(session.user);

      // 2. Query user profile record containing vehicle garage
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, car_year, car_make, car_model")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setCarYear(data.car_year || "");
        setCarMake(data.car_make || "");
        setCarModel(data.car_model || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        car_year: carYear,
        car_make: carMake,
        car_model: carModel,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      setMessage(`❌ Error saving changes: ${error.message}`);
    } else {
      setMessage("✅ Your garage details were successfully saved!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-yellow-400 font-semibold tracking-wider">
          Retrieving garage profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-black text-white py-12 px-6">
      <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-xl shadow-yellow-500/5">
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Your Garage Profile</h1>
        <p className="text-zinc-400 text-sm mb-8">Keep your profile and vehicle specs up-to-date for exact AI diagnostics.</p>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {message && (
            <div className={`p-4 rounded-xl text-sm border ${message.startsWith("✅") ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
              {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-400">Registered Email</label>
            <input
              type="text"
              disabled
              value={user?.email || ""}
              className="mt-2 block w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300">Owner Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="mt-2 block w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            />
          </div>

          {/* Vehicle Fields Grid */}
          <div className="border-t border-zinc-900 pt-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">Garage Vehicle Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Year</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="2018"
                  value={carYear}
                  onChange={(e) => setCarYear(e.target.value)}
                  className="block w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Make</label>
                <input
                  type="text"
                  placeholder="Honda"
                  value={carMake}
                  onChange={(e) => setCarMake(e.target.value)}
                  className="block w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Model</label>
                <input
                  type="text"
                  placeholder="Civic"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="block w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold rounded-xl transition duration-150 active:scale-95 disabled:opacity-50"
          >
            {saving ? "Saving Garage..." : "Save Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
}
