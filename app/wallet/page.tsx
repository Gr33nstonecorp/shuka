"use client";

import { useModal, useAccounts } from "@phantom/react-sdk";
import { AddressType } from "@phantom/browser-sdk";

export default function WalletPage() {
  const { open } = useModal();
  const { accounts } = useAccounts();

  const solanaAccount = accounts?.find(
    (account) => account.addressType === AddressType.solana
  );

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Connect Phantom</h1>
      <p>Use Phantom to sign in to Shuka.</p>

      <button
        onClick={() => open()}
        style={{
          marginTop: "20px",
          padding: "12px 18px",
          background: "#111",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Connect Phantom
      </button>

      <div style={{ marginTop: "24px" }}>
        <strong>Wallet:</strong>{" "}
        {solanaAccount ? solanaAccount.address : "Not connected"}
      </div>
    </main>
  );
}
