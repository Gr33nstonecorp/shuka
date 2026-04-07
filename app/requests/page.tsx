"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type RequestItem = {
  id: string;
  name: string;
  quantity: number;
  date_added: string;
  status: string;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginAndLoad();
  }, []);

  async function checkLoginAndLoad() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    await loadRequests(session.user.id);
  }

  async function loadRequests(userId: string) {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("user_id", userId)
      .order("date_added", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }

  const addItem = async () => {
    if (!newItemName.trim()) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from("requests").insert({
      user_id: session.user.id,
      name: newItemName.trim(),
      quantity: newItemQuantity,
      status: "pending",
    });

    if (!error) {
      setNewItemName("");
      setNewItemQuantity(1);
      loadRequests(session.user.id);
    } else {
      alert("Failed to add request");
    }
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase.from("requests").delete().eq("id", id);
    if (!error) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) loadRequests(session.user.id);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading your requests...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please log in</h1>
          <Link href="/login" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl">Log In</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Requests</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-2">Your purchase requests</p>
          </div>
          <Link href="/assistant" className="px-6 py-3 bg-zinc-900 hover:bg-black text-white rounded-2xl transition">
            ← Back to AI Assistant
          </Link>
        </div>

        {/* Add Form */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12">
          <h2 className="text-xl font-semibold mb-6">Add New Request</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              className="flex-1 p-4 rounded-2xl border focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              min="1"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-28 p-4 rounded-2xl border focus:outline-none focus:border-blue-500 text-center"
            />
            <button
              onClick={addItem}
              className="px-10 py-4 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl transition"
            >
              Add
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center">
            <h3 className="text-2xl font-semibold mb-3">No requests yet</h3>
            <p className="text-zinc-600 mb-8">Use the AI Assistant to generate smart requests, or add them manually above.</p>
            <Link href="/assistant" className="inline-block px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-black">Go to AI Assistant</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-xl">{item.name}</div>
                  <div className="text-zinc-500">Qty: {item.quantity} • {new Date(item.date_added).toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
