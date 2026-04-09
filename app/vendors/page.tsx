"use client";

import { useState } from "react";
import Link from "next/link";

type Vendor = {
  id: number;
  name: string;
  category: string;
  rating: number;
  leadTime: string;
  description: string;
  specialties: string[];
};

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const vendors: Vendor[] = [
    {
      id: 1,
      name: "Global Supplies",
      category: "Safety & PPE",
      rating: 4.8,
      leadTime: "1-3 days",
      description: "Bulk industrial safety equipment and PPE",
      specialties: ["Gloves", "Masks", "Safety Gear"],
    },
    {
      id: 2,
      name: "PackPro Inc.",
      category: "Packaging",
      rating: 4.6,
      leadTime: "Same day",
      description: "High-quality packaging materials and shipping supplies",
      specialties: ["Tape", "Boxes", "Labels"],
    },
    {
      id: 3,
      name: "Uline Logistics",
      category: "Shipping",
      rating: 4.9,
      leadTime: "2-4 days",
      description: "Wholesale shipping boxes and warehouse supplies",
      specialties: ["Boxes", "Bubble Wrap", "Pallets"],
    },
    {
      id: 4,
      name: "Grainger Industrial",
      category: "Tools & Hardware",
      rating: 4.7,
      leadTime: "3-5 days",
      description: "Industrial tools, maintenance supplies, and equipment",
      specialties: ["Tools", "Fasteners", "Cleaning"],
    },
  ];

  const categories = ["All", "Safety & PPE", "Packaging", "Shipping", "Tools & Hardware"];

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter">Vendors</h1>
          <Link href="/assistant" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to AI Assistant
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search vendors or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:border-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {filteredVendors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-500">No vendors found matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:border-blue-500 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="font-semibold text-2xl">{vendor.name}</div>
                    <div className="text-zinc-500 mt-1">{vendor.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-500">★ {vendor.rating}</div>
                    <div className="text-xs text-zinc-500 mt-1">{vendor.leadTime}</div>
                  </div>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-3">
                  {vendor.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {vendor.specialties.map((spec, i) => (
                    <span key={i} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-zinc-900 text-white rounded-2xl hover:bg-black font-medium">
                    View Catalog
                  </button>
                  <button 
                    onClick={() => alert(`Added ${vendor.name} to Saved Items`)}
                    className="flex-1 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                  >
                    Save Vendor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center text-sm text-zinc-500">
          Real vendor integration and AI-powered recommendations coming soon.
        </div>
      </div>
    </main>
  );
}
