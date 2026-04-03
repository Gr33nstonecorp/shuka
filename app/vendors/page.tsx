"use client";

import Link from "next/link";

export default function VendorsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-7xl mb-6">🤝</div>
          <h1 className="text-5xl font-black tracking-tighter mb-6">Vendors</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
            Browse trusted suppliers, view performance scores, and manage your vendor network.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Grainger", category: "Industrial Supplies", score: 94, leadTime: "2-4 days" },
            { name: "Uline", category: "Packaging & Shipping", score: 89, leadTime: "3-5 days" },
            { name: "Amazon Business", category: "General Procurement", score: 91, leadTime: "1-3 days" },
            { name: "Fastenal", category: "Tools & Hardware", score: 87, leadTime: "4-7 days" },
            { name: "Staples", category: "Office Supplies", score: 85, leadTime: "2-4 days" },
            { name: "MSC Industrial", category: "Maintenance Supplies", score: 92, leadTime: "5-8 days" },
          ].map((vendor, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="font-semibold text-2xl">{vendor.name}</div>
                  <div className="text-zinc-500 text-sm">{vendor.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{vendor.score}</div>
                  <div className="text-xs text-zinc-500">AI Score</div>
                </div>
              </div>

              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Average lead time: <span className="font-medium">{vendor.leadTime}</span>
              </div>

              <button className="w-full py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                View Catalog
              </button>
            </div>
          ))}
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
