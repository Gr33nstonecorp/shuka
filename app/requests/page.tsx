export default function RequestsPage() {
  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Purchase Requests</h1>
      <p>Submit a new company purchasing request for the AI to source across connected vendors.</p>

      <form
        style={{
          marginTop: "24px",
          display: "grid",
          gap: "18px",
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Product Needed
          </label>
          <input
            type="text"
            placeholder="Example: Nitrile gloves"
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
            Quantity
          </label>
          <input
            type="number"
            placeholder="Enter quantity"
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
            <option>Warehouse Supplies</option>
            <option>Packaging</option>
            <option>Safety Equipment</option>
            <option>Labels & Printing</option>
            <option>Maintenance</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Urgency
          </label>
          <select
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Budget Cap
          </label>
          <input
            type="text"
            placeholder="Example: $500"
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
            Preferred Vendor
          </label>
          <input
            type="text"
            placeholder="Example: Amazon Business"
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
            Delivery Deadline
          </label>
          <input
            type="date"
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
            Notes
          </label>
          <textarea
            rows={5}
            placeholder="Add specifications, approved brands, or purchasing rules..."
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
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Submit Request
        </button>
      </form>
    </main>
  );
}
