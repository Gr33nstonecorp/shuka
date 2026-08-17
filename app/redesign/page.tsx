"use client";

import { useState } from "react";

export default function RedesignPage() {
  const [message, setMessage] = useState("");

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-black text-yellow-400">
          ShukAI Redesign
        </h1>

        <p className="mt-4 text-zinc-400">
          AI yard redesign is being connected.
        </p>

        <button
          type="button"
          onClick={() => setMessage("Page is working.")}
          className="mt-8 rounded-xl bg-yellow-400 px-6 py-4 font-black text-black"
        >
          Test Page
        </button>

        {message && (
          <div className="mt-6 rounded-xl border border-green-700 bg-green-950/30 p-4 text-green-400">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
