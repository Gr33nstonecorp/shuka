"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type RequestItem = {
  id: number;
  name: string;
  quantity: number;
  dateAdded: string;
};

export default function RequestsPage() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  // Load items from localStorage (shared with AI Assistant)
  useEffect(() => {
    const saved = localStorage.getItem("shukai_requests");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem("shukai_requests", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newItemName.trim()) return;

    const newItem: RequestItem = {
      id: Date.now(),
      name: newItemName.trim(),
      quantity: newItemQuantity,
      dateAdded: new Date().toISOString(),
    };

    setItems([newItem, ...items]);
    setNewItemName("");
    setNewItemQuantity(1);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    if (confirm("Clear all requests?")) {
      setItems([]);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Requests</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-2">
              Manage your purchase requests
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={clearAll}
              className="px-6 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl transition"
            >
              Clear All
            </button>
            <Link
              href="/assistant"
              className="px-6 py-3 bg-zinc-900 hover:bg-black text-white rounded-2xl transition"
            >
              ← Back to AI Assistant
            </Link>
          </div>
        </div>

        {/* Quick Add Form */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12">
          <h2 className="text-xl font-semibold mb-6">Add New Request</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Item name (e.g. Heavy duty gloves)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              className="flex-1 p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              min="1"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-28 p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-center"
            />
            <button
              onClick={addItem}
              className="px-10 py-4 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl transition"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Requests List */}
        {items.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-semibold mb-3">No requests yet</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
              Use the AI Assistant to generate smart requests, or add them manually above.
            </p>
            <Link
              href="/assistant"
              className="inline-block px-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl hover:bg-black transition"
            >
              Go to AI Assistant
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex justify-between items-center group"
              >
                <div>
                  <div className="font-semibold text-xl">{item.name}</div>
                  <div className="text-zinc-500 mt-1">
                    Quantity: <span className="font-medium">{item.quantity}</span> • 
                    Added {new Date(item.dateAdded).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-6 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl transition opacity-0 group-hover:opacity-100"
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
