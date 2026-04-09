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
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shukai_requests") || "[]");
    setRequests(saved);
  }, []);

  const addManualRequest = () => {
    if (!newItemName.trim()) return;

    const newRequest: RequestItem = {
      id: Date.now(),
      name: newItemName.trim(),
      quantity: newQuantity,
      dateAdded: new Date().toISOString(),
    };

    const updated = [newRequest, ...requests];
    setRequests(updated);
    localStorage.setItem("shukai_requests", JSON.stringify(updated));

    setNewItemName("");
    setNewQuantity(1);
    alert("Request added!");
  };

  const removeRequest = (id: number) => {
    const updated = requests.filter(r => r.id !== id);
    setRequests(updated);
    localStorage.setItem("shukai_requests", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter">Requests</h1>
          <Link href="/assistant" className="px-6 py-3 bg-zinc-900 text-white rounded-2xl hover:bg-black">
            + New from AI
          </Link>
        </div>

        {/* Add manual request */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-10">
          <h2 className="text-xl font-semibold mb-6">Add Manual Request</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Item name (e.g. nitrile gloves)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950"
            />
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
              className="w-24 p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-center"
            />
            <button
              onClick={addManualRequest}
              className="px-8 bg-zinc-900 text-white rounded-2xl hover:bg-black font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📋</div>
            <h2 className="text-2xl font-semibold mb-3">No requests yet</h2>
            <p className="text-zinc-600 mb-8 max-w-md mx-auto">
              Use the AI Assistant to find vendors and add items here, or create a manual request above.
            </p>
            <Link href="/assistant" className="inline-block px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-black">
              Go to AI Assistant
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => (
              <div key={req.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-xl">{req.name}</div>
                  <div className="text-zinc-500">Quantity: {req.quantity} • Added {new Date(req.dateAdded).toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => removeRequest(req.id)}
                  className="text-red-600 hover:text-red-700 font-medium"
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
