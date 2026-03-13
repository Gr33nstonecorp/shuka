"use client";

import { useConnect, useAccounts } from "@phantom/react-sdk";

export default function WalletPage() {
  const { connect } = useConnect();
  const accounts = useAccounts();

  const address = accounts?.[0]?.address;

  return (
    <main style={{ padding: "40px" }}>
      <h1>Wallet</h1>

      {!address && (
        <button
          onClick={() => connect()}
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

      {address && (
        <p style={{ marginTop: "20px" }}>
          Connected wallet: {address}
        </p>
      )}
    </main>
  );
}
