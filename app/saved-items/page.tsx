"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SavedItem = {
  id: number;
  name: string;
  quantity: number;
  vendor?: string;
  price?: number;
  dateSaved: string;
};

export default function SavedItemsPage() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    // Load from localStorage (you can later switch to Supabase)
    const saved = JSON.parse(localStorage.getItem("shukai_saved_items") || "[]");
    setSavedItems(saved);
  }, []);

  const removeItem = (id: number) => {
    const updated = savedItems.filter(item => item.id !== id);
    setSavedItems(updated);
    localStorage.setItem("shukai_saved_items", JSON.stringify(updated));
  };

  const moveToRequests = (item: SavedItem) => {
    const requests = JSON.parse(localStorage.getItem("shukai_requests") || "[]");
    const newRequest = {
      id: Date.now(),
      name: item.name,
      quantity: item.quantity,
      dateAdded: new Date().toISOString(),
    };
    localStorage.setItem("shukai_requests", JSON.stringify([newRequest, ...requests]));
    alert(`Moved "${item.name}" to Requests!`);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter">Saved Items</h1>
          <Link href="/vendors" className="text-blue-600 hover:text-blue-700 font-medium">
            Browse Vendors →
          </Link>
        </div>

        {savedItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">⭐</div>
            <h2 className="text-2xl font-semibold mb-3">No saved items yet</h2>
            <p className="text-zinc-600 mb-8 max-w-md mx-auto">
              Save interesting products from Vendors or AI results to review later.
            </p>
            <Link href="/vendors" className="inline-block px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-black">
              Browse Vendors
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                <div className="font-semibold text-xl mb-4">{item.name}</div>
                
                <div className="space-y-3 text-sm mb-8">
                  <div>Quantity: <span className="font-medium">{item.quantity}</span></div>
                  {item.vendor && <div>Vendor: <span className="font-medium">{item.vendor}</span></div>}
                  {item.price && <div>Est. Price: <span className="font-medium">${item.price}</span></div>}
                  <div className="text-zinc-500">Saved {new Date(item.dateSaved).toLocaleDateString()}</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => moveToRequests(item)}
                    className="flex-1 py-3 bg-zinc-900 text-white rounded-2xl hover:bg-black font-medium"
                  >
                    Move to Requests
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex-1 py-3 border border-red-300 text-red-600 dark:border-red-800 dark:text-red-400 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center text-sm text-zinc-500">
          Items saved from AI results or Vendors appear here.<br />
          You can move them to Requests for sourcing.
        </div>
      </div>
    </main>
  );
}
