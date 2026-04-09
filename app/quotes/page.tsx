"use client";

import { useState } from "react";
import Link from "next/link";

type Quote = {
  id: number;
  item: string;
  vendor: string;
  price: number;
  leadTime: string;
  score: number;
  selected: boolean;
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 1,
      item: "Nitrile Gloves (50 units)",
      vendor: "Global Supplies",
      price: 245.50,
      leadTime: "2-3 days",
      score: 92,
      selected: false,
    },
    {
      id: 2,
      item: "Heavy Duty Packing Tape (20 rolls)",
      vendor: "PackPro Inc.",
      price: 89.99,
      leadTime: "1 day",
      score: 88,
      selected: false,
    },
    {
      id: 3,
      item: "Shipping Boxes (100 units)",
      vendor: "Uline",
      price: 312.00,
      leadTime: "3-5 days",
      score: 85,
      selected: false,
    },
  ]);

  const toggleSelect = (id: number) => {
    setQuotes(quotes.map(q => 
      q.id === id ? { ...q, selected: !q.selected } : q
    ));
  };

  const approveSelected = () => {
    const selected = quotes.filter(q => q.selected);
    if (selected.length === 0) {
      alert("Select at least one quote to approve");
      return;
    }
    alert(`✅ Approved ${selected.length} quotes! Moving to Orders...`);
    // In real app, this would create orders
  };

  const totalSelected = quotes.filter(q => q.selected).reduce((sum, q) => sum + q.price, 0);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter">Quotes</h1>
          <Link href="/requests" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Requests
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Compare Vendor Quotes</h2>
            {totalSelected > 0 && (
              <div className="text-right">
                <div className="text-sm text-zinc-500">Selected Total</div>
                <div className="text-2xl font-bold">${totalSelected.toFixed(2)}</div>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                onClick={() => toggleSelect(quote.id)}
                className={`border rounded-3xl p-8 cursor-pointer transition-all ${
                  quote.selected 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-xl mb-2">{quote.item}</div>
                    <div className="text-zinc-600 dark:text-zinc-400">{quote.vendor}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${quote.price}</div>
                    <div className="text-sm text-zinc-500">{quote.leadTime}</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                      AI Score: {quote.score}
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${quote.selected ? "text-blue-600" : "text-zinc-500"}`}>
                    {quote.selected ? "✓ Selected" : "Tap to select"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {quotes.some(q => q.selected) && (
          <button
            onClick={approveSelected}
            className="w-full py-5 bg-zinc-900 hover:bg-black text-white font-semibold rounded-3xl text-lg transition"
          >
            Approve Selected Quotes → Create Orders
          </button>
        )}

        <div className="text-center mt-12 text-zinc-500 text-sm">
          Quotes are AI-generated based on your Requests. Real vendor integration coming soon.
        </div>
      </div>
    </main>
  );
}
