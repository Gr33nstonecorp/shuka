"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Vehicle = {
  id?: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<Vehicle>({ make: "", model: "", year: new Date().getFullYear() });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("vehicles")
          .select("*")
          .eq("user_id", user.id);
        setVehicles(data || []);
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const addVehicle = async () => {
    if (!user || !newVehicle.make || !newVehicle.model) return;

    const { data, error } = await supabase
      .from("vehicles")
      .insert([{ ...newVehicle, user_id: user.id }])
      .select();

    if (!error && data) {
      setVehicles([...vehicles, data[0]]);
      setNewVehicle({ make: "", model: "", year: new Date().getFullYear() });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-7xl mb-8">👤</div>
          <h1 className="text-5xl font-black tracking-tighter mb-6">Profile & Settings</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
            Manage your account, vehicles, subscription, and preferences.
          </p>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Account Information</h2>
          <p className="text-lg">
            <span className="text-zinc-500 dark:text-zinc-400">Email:</span> {user?.email}
          </p>
        </div>

        {/* Vehicles Section */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 mb-12">
          <h2 className="text-2xl font-semibold mb-8">My Vehicles</h2>

          {vehicles.length === 0 && (
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">No vehicles added yet.</p>
          )}

          <div className="space-y-6 mb-12">
            {vehicles.map((v, i) => (
              <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-6">
                <p className="text-xl font-medium">
                  {v.year} {v.make} {v.model}
                </p>
                {v.vin && <p className="text-sm text-zinc-500">VIN: {v.vin}</p>}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-6">Add New Vehicle</h3>

          <div className="grid grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Make (e.g. Toyota)"
              value={newVehicle.make}
              onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
              className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-5"
            />
            <input
              type="text"
              placeholder="Model (e.g. Camry)"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
              className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-5"
            />
            <input
              type="number"
              placeholder="Year"
              value={newVehicle.year}
              onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
              className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-5"
            />
            <input
              type="text"
              placeholder="VIN (optional)"
              value={newVehicle.vin || ""}
              onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
              className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-5"
            />
          </div>

          <button
            onClick={addVehicle}
            className="mt-8 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-5 rounded-3xl text-lg"
          >
            Add Vehicle
          </button>
        </div>

        <div className="text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Homepage</a>
        </div>
      </div>
    </main>
  );
}
