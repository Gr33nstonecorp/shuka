"use client";

import { ConnectButton, AddressType } from "@phantom/react-sdk";

export const dynamic = "force-dynamic";

export default function WalletPage() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Wallet</h1>
      <p>Connect your Phantom wallet to use Shuka.</p>

      <div style={{ marginTop: "20px" }}>
        <ConnectButton addressType={AddressType.solana} />
      </div>
    </main>
  );
}
