"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SavedItem = {
  id: number;
  name: string;
  quantity: number;
  dateAdded: string;
  vendor?: string;
};

export default function SavedItemsPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (replace with Supabase later if you want persistence)
    setTimeout(() => {
      const saved = localStorage.getItem("shukai_saved_items");
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        // Demo data
        const demo: SavedItem[] = [
          { id: 101, name: "Heavy Duty Nitrile Gloves", quantity: 50, dateAdded: "2026-03-28", vendor: "Global Supplies" },
          { id: 102, name: "Industrial Packing Tape", quantity: 24, dateAdded: "2026-03-27", vendor: "PackPro Inc." },
        ];
        setItems(demo);
        localStorage.setItem("shukai_saved_items", JSON.stringify(demo));
      }
      setLoading(false);
    }, 600);
  }, []);

  const removeItem = (id: number) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem("shukai_saved_items", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-xl">Loading saved items...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Saved Items</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-2">Shortlisted products and options</p>
          </div>
          <Link href="/assistant" className="px-6 py-3 bg-zinc-900 hover:bg-black text-white rounded-2xl transition">
            ← Back to AI Assistant
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-20 text-center">
            <div className="text-6xl mb-6">⭐</div>
            <h3 className="text-2xl font-semibold mb-4">No saved items yet</h3>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8">
              Use the AI Assistant to find great options and save them here for later.
            </p>
            <Link href="/assistant" className="inline-block px-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl hover:bg-black transition">
              Go to AI Assistant
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-xl mb-2">{item.name}</div>
                    <div className="text-zinc-500">Qty: {item.quantity}</div>
                    {item.vendor && <div className="text-sm text-zinc-400 mt-1">Vendor: {item.vendor}</div>}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 opacity-0 group-hover:opacity-100 transition px-4 py-2 hover:bg-red-50 rounded-xl"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-6 text-xs text-zinc-500">
                  Saved on {new Date(item.dateAdded).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
