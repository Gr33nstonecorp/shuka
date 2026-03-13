"use client";

import { useState } from "react";
import Market from "./components/Market";
import Sell from "./components/Sell";
import AI from "./components/AI";
import Messages from "./components/Messages";
import Wallet from "./components/Wallet";

export default function Home() {
  const [tab, setTab] = useState("market");

  return (
    <div className="p-10 min-h-screen bg-zinc-50">

      <h1 className="text-5xl font-bold mb-8">Shuka</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">

        <button onClick={() => setTab("market")} className="px-4 py-2 bg-black text-white rounded">
          Market
        </button>

        <button onClick={() => setTab("sell")} className="px-4 py-2 bg-black text-white rounded">
          Sell
        </button>

        <button onClick={() => setTab("ai")} className="px-4 py-2 bg-black text-white rounded">
          AI
        </button>

        <button onClick={() => setTab("messages")} className="px-4 py-2 bg-black text-white rounded">
          Messages
        </button>

        <button onClick={() => setTab("wallet")} className="px-4 py-2 bg-black text-white rounded">
          Wallet
        </button>

      </div>

      {/* Tab Content */}

      {tab === "market" && <Market />}
      {tab === "sell" && <Sell />}
      {tab === "ai" && <AI />}
      {tab === "messages" && <Messages />}
      {tab === "wallet" && <Wallet />}

    </div>
  );
}
