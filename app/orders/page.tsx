"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  name: string;
  quantity: number;
  date: string;
  status: "approved" | "shipped" | "delivered";
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shukai_orders") || "[]");
    setOrders(saved);
  }, []);

  const requestRefund = (id: number, name: string) => {
    if (confirm(`Request refund for "${name}"?`)) {
      alert(`Refund requested for "${name}". AI will process within 48 hours.`);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black tracking-tighter mb-10">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-3">No orders yet</h2>
            <p className="text-zinc-600">Finalize purchases from your basket to see orders here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-zinc-900 border rounded-3xl p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-xl">{order.name}</div>
                    <div className="text-zinc-500 mt-1">
                      Quantity: {order.quantity} • Ordered on {order.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm">Approved</span>
                    <button 
                      onClick={() => requestRefund(order.id, order.name)}
                      className="mt-6 block text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Request Refund
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
