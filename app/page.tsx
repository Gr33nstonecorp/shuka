"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          AI-Powered Procurement
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6">
          AI that finds,<br />compares, and buys<br />vendors for you
        </h1>

        <p className="text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12">
          Stop manual sourcing. Describe what you need — ShukAI finds suppliers, gets quotes, and recommends the best options instantly.
        </p>

        <Link 
          href="/assistant"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 rounded-2xl text-lg transition"
        >
          Open AI Assistant →
        </Link>

        <p className="text-sm text-zinc-500 mt-8">Free to start • No credit card required</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-4">Simple 3-Step Process</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-12">From request to order in minutes</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Describe your need", desc: "Type what you want to buy" },
              { step: "2", title: "AI finds options", desc: "Real vendor quotes & comparisons" },
              { step: "3", title: "Approve & order", desc: "Add to requests and finalize" }
            ].map((item) => (
              <div key={item.step} className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-3xl">
                <div className="text-6xl mb-4 opacity-20">{item.step}</div>
                <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
