"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Order = {
  id: number;
  item: string;
  vendor: string;
  total: number;
  status: "pending" | "approved" | "shipped" | "delivered";
  date: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      item: "Nitrile Gloves (50 units)",
      vendor: "Global Supplies",
      total: 245.50,
      status: "approved",
      date: "2026-04-07",
    },
    {
      id: 2,
      item: "Heavy Duty Packing Tape (20 rolls)",
      vendor: "PackPro Inc.",
      total: 89.99,
      status: "shipped",
      date: "2026-04-06",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "shipped": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "delivered": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      default: return "bg-zinc-100 text-zinc-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter">Orders</h1>
          <Link href="/quotes" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Quotes
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-semibold mb-3">No orders yet</h2>
            <p className="text-zinc-600 mb-8">Approve quotes to create orders here.</p>
            <Link href="/quotes" className="inline-block px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-black">
              Go to Quotes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="font-semibold text-xl mb-2">{order.item}</div>
                    <div className="text-zinc-600 dark:text-zinc-400">Vendor: {order.vendor}</div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-sm text-zinc-500">Total</div>
                      <div className="text-2xl font-bold">${order.total.toFixed(2)}</div>
                    </div>

                    <div>
                      <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </div>
                      <div className="text-xs text-zinc-500 mt-2 text-right">{order.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-sm text-zinc-500">
          Approved quotes from the Quotes page appear here as orders.<br />
          Real order tracking and status updates coming soon.
        </div>
      </div>
    </main>
  );
}
