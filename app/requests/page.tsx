"use client";

import { useState } from "react";
import Link from "next/link";

type RequestItem = {
  id: number;
  name: string;
  quantity: number;
  status: "draft" | "submitted" | "quoted";
};

export default function RequestsPage() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const addItem = () => {
    if (!newItemName.trim()) return;

    const newItem: RequestItem = {
      id: Date.now(),
      name: newItemName.trim(),
      quantity: newItemQuantity,
      status: "draft"
    };

    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemQuantity(1);
    setShowForm(false);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
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
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-zinc-900 text-white font-semibold rounded-2xl hover:bg-black transition"
          >
            + New Request
          </button>
        </div>

        {/* Add New Item Form */}
        {showForm && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Add Item to Request</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Item Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Industrial nitrile gloves"
                  className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                  className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                  min="1"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={addItem}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition"
              >
                Add Item
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-8 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Requests List */}
        {items.length > 0 ? (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-xl">{item.name}</div>
                  <div className="text-zinc-500">Quantity: {item.quantity}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 text-sm bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">
                    Draft
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-semibold mb-3">No requests yet</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">Create your first purchasing request above.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
