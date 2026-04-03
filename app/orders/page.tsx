
"use client";

import { useState } from "react";
import Link from "next/link";

type Order = {
  id: number;
  item: string;
  vendor: string;
  total: number;
  quantity: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  expectedDate: string;
};

const sampleOrders: Order[] = [
  {
    id: 101,
    item: "Industrial Nitrile Gloves",
    vendor: "Grainger",
    total: 124.50,
    quantity: 50,
    status: "shipped",
    expectedDate: "2026-04-10"
  },
  {
    id: 102,
    item: "Heavy Duty Packing Tape",
    vendor: "Uline",
    total: 89.99,
    quantity: 24,
    status: "pending",
    expectedDate: "2026-04-15"
  },
  {
    id: 103,
    item: "Thermal Shipping Labels",
    vendor: "Amazon Business",
    total: 67.25,
    quantity: 10,
    status: "delivered",
    expectedDate: "2026-04-02"
  },
];

export default function OrdersPage() {
  const [orders] = useState<Order[]>(sampleOrders);
  const [filter, setFilter] = useState<"all" | "pending" | "shipped" | "delivered">("all");

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "shipped": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "pending": return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Orders</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-2">
              Track your approved and active orders
            </p>
          </div>
          
          <div className="flex gap-2">
            {(["all", "pending", "shipped", "delivered"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2 rounded-2xl text-sm font-medium transition ${
                  filter === status 
                    ? "bg-zinc-900 text-white" 
                    : "bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                  <th className="px-8 py-5 text-left font-medium text-zinc-500">Order ID</th>
                  <th className="px-8 py-5 text-left font-medium text-zinc-500">Item</th>
                  <th className="px-8 py-5 text-left font-medium text-zinc-500">Vendor</th>
                  <th className="px-8 py-5 text-right font-medium text-zinc-500">Total</th>
                  <th className="px-8 py-5 text-center font-medium text-zinc-500">Status</th>
                  <th className="px-8 py-5 text-center font-medium text-zinc-500">Expected</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950">
                      <td className="px-8 py-6 font-mono text-sm">#{order.id}</td>
                      <td className="px-8 py-6 font-medium">{order.item}</td>
                      <td className="px-8 py-6">{order.vendor}</td>
                      <td className="px-8 py-6 text-right font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center text-sm text-zinc-500">
                        {order.expectedDate}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-zinc-500">
                      No orders found in this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
