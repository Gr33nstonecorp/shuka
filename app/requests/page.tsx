"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type RequestItem = {
  id: string;
  name: string;
  quantity: number;
  status: string;
  created_at: string;
};

export default function RequestsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [items, setItems] = useState<RequestItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load user's requests from Supabase
  useEffect(() => {
    async function loadRequests() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setItems(data || []);
      
      setLoading(false);
    }

    loadRequests();
  }, [supabase]);

  const addItem = async () => {
    if (!newItemName.trim()) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("requests")
      .insert({
        user_id: session.user.id,
        name: newItemName.trim(),
        quantity: newItemQuantity,
        status: "draft"
      });

    if (error) {
      alert("Failed to add item");
    } else {
      // Refresh list
      const { data } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      setItems(data || []);
      setNewItemName("");
      setNewItemQuantity(1);
    }
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase.from("requests").delete().eq("id", id);
    if (!error) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading your requests...</div>;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Requests</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-2">Your purchasing requests</p>
          </div>
        </div>

        {/* Add New Item */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">New Request Item</h2>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-8">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name"
                className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700"
              />
            </div>
            <div className="md:col-span-2">
              <input
                type="number"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700"
                min="1"
              />
            </div>
            <div className="md:col-span-2">
              <button onClick={addItem} className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl">
                Add
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-xl">{item.name}</div>
                  <div className="text-zinc-500">Quantity: {item.quantity}</div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <p className="text-zinc-500">No requests yet. Add some from the AI Assistant!</p>
          </div>
        )}
      </div>
    </main>
  );
}
