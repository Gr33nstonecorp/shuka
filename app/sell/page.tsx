export default function SellPage() {
  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>Sell Your AI Tool</h1>
      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        List your AI product on Shuka and reach new buyers.
      </p>

      <form
        style={{
          display: "grid",
          gap: "20px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid #ddd",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Tool Name
          </label>
          <input
            type="text"
            placeholder="Enter your AI tool name"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Description
          </label>
          <textarea
            placeholder="Describe what your AI tool does"
            rows={5}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Price
          </label>
          <input
            type="text"
            placeholder="$29/mo"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Category
          </label>
          <select
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option>Content Creation</option>
            <option>Education</option>
            <option>Crypto</option>
            <option>Automation</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Website URL
          </label>
          <input
            type="text"
            placeholder="https://yourtool.com"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "14px 20px",
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Submit Listing
