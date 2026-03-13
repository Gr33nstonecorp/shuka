"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function WalletPage() {

  return (
    <main style={{ padding: "40px" }}>
      <h1>Wallet</h1>
      <p>Connect Phantom to use Shuka</p>

      <div style={{ marginTop: "20px" }}>
        <WalletMultiButton />
      </div>

    </main>
  );
}
