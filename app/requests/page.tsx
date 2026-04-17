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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shukai_requests") || "[]");
    setRequests(saved);
  }, []);

  const removeRequest = (id: number) => {
    const updated = requests.filter(r => r.id !== id);
    setRequests(updated);
    localStorage.setItem("shukai_requests", JSON.stringify(updated));
  };

  const finalizePurchase = () => {
    if (requests.length === 0) return;
    
    // Move to orders
    const orders = JSON.parse(localStorage.getItem("shukai_orders") || "[]");
    const newOrders = requests.map(req => ({
      id: Date.now() + req.id,
      name: req.name,
      quantity: req.quantity,
      date: new Date().toISOString().split('T')[0],
      status: "approved" as const,
    }));

    localStorage.setItem("shukai_orders", JSON.stringify([...newOrders, ...orders]));
    localStorage.setItem("shukai_requests", "[]");
    
    alert("✅ Purchase finalized! Check your Orders tab.");
    window.location.href = "/orders";
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter">Your Basket</h1>
          <Link href="/assistant" className="text-blue-600 hover:text-blue-700 font-medium">+ Add from AI</Link>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-3">Basket is empty</h2>
            <p className="text-zinc-600 mb-8">Use the AI Assistant to add items.</p>
            <Link href="/assistant" className="inline-block px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-black">
              Go to AI Assistant
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-12">
              {requests.map((req) => (
                <div key={req.id} className="bg-white dark:bg-zinc-900 border rounded-3xl p-8 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-xl">{req.name}</div>
                    <div className="text-zinc-500">Quantity: {req.quantity}</div>
                  </div>
                  <button 
                    onClick={() => removeRequest(req.id)} 
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={finalizePurchase}
              className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-3xl text-lg transition"
            >
              Finalize Purchase • Create Order
            </button>
          </>
        )}
      </div>
    </main>
  );
}
