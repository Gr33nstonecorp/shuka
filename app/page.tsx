"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [demoQuery, setDemoQuery] = useState("");

  const handleDemoSubmit = () => {
    if (demoQuery.trim()) {
      // Navigate to assistant with pre-filled query
      window.location.href = `/assistant?query=${encodeURIComponent(demoQuery.trim())}`;
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero */}
      <div className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-6 py-2 rounded-full text-sm font-semibold mb-8">
            AI Procurement Platform
          </div>

          <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-10">
            AI that finds,<br />compares, and buys<br />vendors for you.
          </h1>

          <p className="text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-12">
            Stop spending hours sourcing manually. Tell ShukAI what you need — it finds the best suppliers, prices, and options in seconds.
          </p>

          {/* Working AI Demo Input */}
          <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 mb-16">
            <div className="text-zinc-500 text-sm font-medium mb-4">Try it now</div>
            <div className="relative">
              <input
                type="text"
                placeholder="50 nitrile gloves, 20 heavy duty packing tape..."
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDemoSubmit();
                }}
                className="w-full p-6 pr-32 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-lg focus:outline-none focus:border-blue-600"
              />
              <button
                onClick={handleDemoSubmit}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl transition"
              >
                Ask AI
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-4">Example: "50 nitrile gloves, 20 packing tape"</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/assistant" 
              className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-semibold text-lg hover:bg-black transition"
            >
              Open AI Assistant
            </a>
            <a 
              href="/pricing" 
              className="px-10 py-4 border border-zinc-300 dark:border-zinc-700 rounded-2xl font-semibold text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              See Pricing
            </a>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white dark:bg-zinc-900 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center text-3xl mb-6">📝</div>
              <h3 className="font-semibold text-2xl mb-3">1. Tell the AI</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Describe what you need to buy</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center text-3xl mb-6">🔍</div>
              <h3 className="font-semibold text-2xl mb-3">2. AI Sources</h3>
              <p className="text-zinc-600 dark:text-zinc-400">It finds suppliers, compares prices, and recommends the best options</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center text-3xl mb-6">✅</div>
              <h3 className="font-semibold text-2xl mb-3">3. Approve & Buy</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Review quotes and place the order in one click</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 text-center px-6">
        <div className="max-w-md mx-auto">
          <p className="text-2xl font-medium mb-8">Ready to let AI handle your sourcing?</p>
          <a href="/assistant" className="inline-block px-12 py-5 bg-zinc-900 hover:bg-black text-white text-xl font-semibold rounded-3xl transition">
            Start Sourcing Now
          </a>
          <p className="text-sm text-zinc-500 mt-6">Completely free during early stage</p>
        </div>
      </div>
    </main>
  );
}
