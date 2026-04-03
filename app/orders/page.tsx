"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Order = {
  id: number;
  item: string;
  vendor: string;
  total: number;
  status: "pending" | "approved" | "shipped" | "delivered";
  date: string;
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "shipped" | "delivered">("all");

  // Simulate loading real orders (replace with Supabase fetch later)
  useEffect(() => {
    setTimeout(() => {
      const sampleOrders: Order[] = [
        { id: 1, item: "Industrial Nitrile Gloves (50 boxes)", vendor: "Global Supplies Co.", total: 245.50, status: "approved", date: "2026-03-28" },
        { id: 2, item: "Heavy Duty Packing Tape", vendor: "PackPro Inc.", total: 89.99, status: "shipped", date: "2026-03-25" },
        { id: 3, item: "Corrugated Shipping Boxes", vendor: "BoxMaster Logistics", total: 178.25, status: "delivered", date: "2026-03-20" },
        { id: 4, item: "Shipping Labels (500 sheets)", vendor: "LabelDirect", total: 42.00, status: "pending", date: "2026-04-01" },
      ];
      setOrders(sampleOrders);
      setLoading(false);
    }, 600);
  }, []);

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-xl">Loading your orders...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Orders</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-2">Track your approved and active orders</p>
          </div>
          <Link 
            href="/quotes" 
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            ← Back to Quotes
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(["all", "pending", "approved", "shipped", "delivered"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-2xl font-medium whitespace-nowrap transition ${
                filter === status 
                  ? "bg-zinc-900 text-white" 
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {status === "all" ? "All Orders" : getStatusLabel(status)}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center">
            <h3 className="text-2xl font-semibold mb-3">No orders found</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Approve quotes to see them here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-center gap-8"
              >
                <div className="flex-1">
                  <div className="font-semibold text-xl mb-1">{order.item}</div>
                  <div className="text-zinc-600 dark:text-zinc-400">Vendor: {order.vendor}</div>
                </div>

                <div className="grid grid-cols-3 gap-8 text-center flex-shrink-0">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500">Total</div>
                    <div className="text-2xl font-bold">${order.total.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500">Status</div>
                    <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                      {getStatusLabel(order.status)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500">Date</div>
                    <div className="font-medium">{new Date(order.date).toLocaleDateString()}</div>
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
