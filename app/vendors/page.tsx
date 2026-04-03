"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Vendor = {
  id: number;
  name: string;
  category: string;
  rating: number;
  leadTime: string;
  description: string;
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulated vendors (replace with real Supabase query later)
  useEffect(() => {
    setTimeout(() => {
      const sampleVendors: Vendor[] = [
        {
          id: 1,
          name: "Global Supplies Co.",
          category: "Safety & PPE",
          rating: 4.8,
          leadTime: "2-4 days",
          description: "Bulk industrial gloves, safety equipment, and cleaning supplies.",
        },
        {
          id: 2,
          name: "PackPro Inc.",
          category: "Packaging",
          rating: 4.6,
          leadTime: "1-3 days",
          description: "Heavy duty tape, boxes, bubble wrap, and shipping materials.",
        },
        {
          id: 3,
          name: "BoxMaster Logistics",
          category: "Shipping",
          rating: 4.9,
          leadTime: "3-5 days",
          description: "Corrugated boxes, pallets, and custom packaging solutions.",
        },
        {
          id: 4,
          name: "LabelDirect",
          category: "Labels & Printing",
          rating: 4.7,
          leadTime: "1-2 days",
          description: "High-quality shipping labels, printers, and office supplies.",
        },
      ];
      setVendors(sampleVendors);
      setLoading(false);
    }, 700);
  }, []);

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-xl">Loading vendors...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Vendors</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-2">Browse trusted suppliers</p>
          </div>
          <Link href="/assistant" className="px-6 py-3 bg-zinc-900 hover:bg-black text-white rounded-2xl transition">
            ← Back to AI Assistant
          </Link>
        </div>

        {/* Search */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search vendors or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-5 rounded-3xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {filteredVendors.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            No vendors match your search.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:border-blue-500 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="font-semibold text-2xl mb-1">{vendor.name}</div>
                    <div className="text-sm text-zinc-500">{vendor.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-500">★ {vendor.rating}</div>
                  </div>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 mb-8 line-clamp-3">
                  {vendor.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-zinc-500">Lead time:</span>{" "}
                    <span className="font-medium">{vendor.leadTime}</span>
                  </div>
                  <button className="text-blue-600 font-medium group-hover:underline">
                    View Catalog →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
