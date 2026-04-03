"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Quote = {
  id: number;
  item: string;
  vendor: string;
  price: number;
  leadTime: string;
  score: number; // AI confidence score
  selected: boolean;
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);

  // Simulated data — replace with real Supabase fetch later
  useEffect(() => {
    // Simulate API load
    setTimeout(() => {
      const sampleQuotes: Quote[] = [
        { id: 1, item: "Industrial Nitrile Gloves", vendor: "Global Supplies Co.", price: 245.50, leadTime: "3 days", score: 92, selected: false },
        { id: 2, item: "Heavy Duty Packing Tape", vendor: "PackPro Inc.", price: 89.99, leadTime: "2 days", score: 88, selected: false },
        { id: 3, item: "Corrugated Shipping Boxes", vendor: "BoxMaster Logistics", price: 178.25, leadTime: "5 days", score: 85, selected: false },
        { id: 4, item: "Shipping Labels (500)", vendor: "LabelDirect", price: 42.00, leadTime: "1 day", score: 95, selected: false },
      ];
      setQuotes(sampleQuotes);
      setLoading(false);
    }, 800); // Simulate network delay
  }, []);

  const toggleSelect = (id: number) => {
    setQuotes(quotes.map(q => 
      q.id === id ? { ...q, selected: !q.selected } : q
    ));
    setSelectedCount(prev => 
      quotes.find(q => q.id === id)?.selected ? prev - 1 : prev + 1
    );
  };

  const approveSelected = () => {
    const selected = quotes.filter(q => q.selected);
    if (selected.length === 0) {
      alert("Select at least one quote to approve.");
      return;
    }
    alert(`Approved ${selected.length} quotes! Moving to Orders.`);
    // In real app: create orders in Supabase here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-xl">Loading quotes...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Quotes</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-2">Compare and approve vendor offers</p>
          </div>
          <div className="flex gap-4">
            <Link href="/requests" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
              ← Back to Requests
            </Link>
            <button
              onClick={approveSelected}
              disabled={selectedCount === 0}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-2xl disabled:bg-gray-400 transition"
            >
              Approve Selected ({selectedCount})
            </button>
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-500">No quotes yet. Run the AI Assistant to generate some.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                onClick={() => toggleSelect(quote.id)}
                className={`bg-white dark:bg-zinc-900 border rounded-3xl p-8 flex flex-col md:flex-row md:items-center gap-8 cursor-pointer transition-all hover:border-blue-500 ${
                  quote.selected ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <div className="flex-1">
                  <div className="font-semibold text-2xl mb-2">{quote.item}</div>
                  <div className="text-zinc-600 dark:text-zinc-400">Vendor: <span className="font-medium text-zinc-900 dark:text-white">{quote.vendor}</span></div>
                </div>

                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500">Price</div>
                    <div className="text-2xl font-bold">${quote.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500">Lead Time</div>
                    <div className="text-xl font-medium">{quote.leadTime}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500">AI Score</div>
                    <div className="text-xl font-bold text-green-600">{quote.score}</div>
                  </
