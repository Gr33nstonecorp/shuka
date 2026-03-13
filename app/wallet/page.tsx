"use client";

import { useState } from "react";
import { useConnect, useAccounts } from "@phantom/react-sdk";

export default function WalletPage() {
  const { connect } = useConnect();
  const accounts = useAccounts();
  const [status, setStatus] = useState("Not connected");

  const address = accounts?.[0]?.address;

  async function handleConnect() {
    try {
      setStatus("Opening Phantom...");
      await connect({ provider: "injected" });
      setStatus("Connected");
    } catch (error) {
      console.error(error);
      setStatus("Connection failed");
    }
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Wallet</h1>

      {!address && (
        <button
          onClick={handleConnect}
          style={{
            padding: "12px 20px",
            background: "#512da8",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Connect Phantom Wallet
        </button>
      )}

      <p style={{ marginTop: "20px" }}>
        <strong>Status:</strong> {status}
      </p>

      {address && (
        <p style={{ marginTop: "20px" }}>
          <strong>Connected wallet:</strong> {address}
        </p>
      )}
    </main>
  );
}
