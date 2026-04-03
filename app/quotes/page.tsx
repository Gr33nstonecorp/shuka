"use client";

import Link from "next/link";
import { useState } from "react";

type Quote = {
  id: number;
  item: string;
  vendor: string;
  price: number;
  quantity: number;
  leadTime: number;
  aiScore: number;
  status: "pending" | "approved" | "rejected";
};

const sampleQuotes: Quote[] = [
  {
    id: 1,
    item: "Industrial Nitrile Gloves",
    vendor: "Grainger",
    price: 124.50,
    quantity: 50,
    leadTime: 3,
    aiScore: 92,
    status: "pending"
  },
  {
    id: 2,
    item: "Industrial Nitrile Gloves",
    vendor: "Uline",
    price: 98.75,
    quantity: 50,
    leadTime: 5,
    aiScore: 87,
    status: "pending"
  },
  {
    id: 3,
    item: "Heavy Duty Packing Tape",
    vendor: "Amazon Business",
    price: 45.20,
    quantity: 24,
    leadTime: 2,
    aiScore: 95,
    status: "pending"
  },
];

export default function QuotesPage() {
  const [quotes] = useState<Quote[]>(sampleQuotes);
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const approveSelected = () => {
    alert(`Approved ${selected.length} quote(s)! (This is a demo)`);
    setSelected([]);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Quotes</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-2">
              Review and compare incoming vendor quotes
            </p>
          </div>
          
          {selected.length > 0 && (
            <button
              onClick={approveSelected}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition"
            >
              Approve Selected ({selected.length})
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-8 py-5 text-left font-medium text-zinc-500">Item</th>
                <th className="px-8 py-5 text-left font-medium text-zinc-500">Vendor</th>
                <th className="px-8 py-5 text-right font-medium text-zinc-500">Total Price</th>
                <th className="px-8 py-5 text-center font-medium text-zinc-500">Lead Time</th>
                <th className="px-8 py-5 text-center font-medium text-zinc-500">AI Score</th>
                <th className="px-8 py-5 text-center font-medium text-zinc-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950">
                  <td className="px-8 py-6 font-medium">{quote.item}</td>
                  <td className="px-8 py-6">{quote.vendor}</td>
                  <td className="px-8 py-6 text-right font-semibold">
                    ${quote.price.toFixed(2)}
                  </td>
                  <td className="px-8 py-6 text-center">{quote.leadTime} days</td>
                  <td className="px-8 py-6 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                      {quote.aiScore}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => toggleSelect(quote.id)}
                      className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                        selected.includes(quote.id)
                          ? "bg-green-600 text-white"
                          : "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {selected.includes(quote.id) ? "Selected" : "Select"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {quotes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">💰</div>
            <h3 className="text-2xl font-semibold mb-3">No quotes yet</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Submit a request to start receiving quotes.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
