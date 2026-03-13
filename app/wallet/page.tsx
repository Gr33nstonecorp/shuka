export default function WalletPage() {
  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>Connect Your Wallet</h1>
      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        Link your wallet to buy AI tools, receive payouts, and manage your marketplace activity.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "24px",
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>MetaMask</h2>
          <p>Connect for Ethereum-compatible payments and Web3 login.</p>
          <button
            style={{
              marginTop: "12px",
              padding: "12px 18px",
              background: "#111",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Connect MetaMask
          </button>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "24px",
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Phantom</h2>
          <p>Connect for Solana-based payments, creator payouts, and listings.</p>
          <button
            style={{
              marginTop: "12px",
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
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "24px",
          background: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Wallet Status</h2>
        <p><strong>Connected Wallet:</strong> Not connected</p>
        <p><strong>Network:</strong> Not detected</p>
        <p><strong>Marketplace Access:</strong> Limited until wallet is connected</p>
      </div>
    </main>
  );
}
