"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shukai_requests");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("shukai_requests", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newItemName.trim()) return;

    const newItem: RequestItem = {
      id: Date.now(),
      name: newItemName.trim(),
      quantity: newItemQuantity,
      dateAdded: new Date().toISOString()
    };

    setItems([newItem, ...items]);
    setNewItemName("");
    setNewItemQuantity(1);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearAll = () => {
    if (confirm("Clear all requests?")) {
      setItems([]);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Requests</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-2">
              Create and manage your purchasing requests
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={clearAll}
              className="px-5 py-3 text-red-600 hover:text-red-700 font-medium transition"
            >
              Clear All
            </button>
            <button
              className="px-8 py-3 bg-zinc-900 text-white font-semibold rounded-2xl hover:bg-black transition"
            >
              Submit Request
            </button>
          </div>
        </div>

        {/* Add New Item Form */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Add New Item</h2>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-8">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name (e.g. Industrial nitrile gloves)"
                className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
              />
            </div>
            <div className="md:col-span-2">
              <input
                type="number"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                min="1"
              />
            </div>
            <div className="md:col-span-2">
              <button
                onClick={addItem}
                className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Current Requests List */}
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-xl">{item.name}</div>
                  <div className="text-zinc-500">
                    Quantity: {item.quantity} • Added {new Date(item.dateAdded).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 font-medium px-4 py-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-semibold mb-3">No requests yet</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Add items above or from the AI Assistant.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Homepage</Link>
        </div>
      </div>
    </main>
  );
}
