import { inventoryItems, purchaseOrders, shipments } from "./data/mockData";

function getLowStockItems() {
  return inventoryItems.filter((item) => item.quantity <= item.reorderPoint);
}

function getCriticalItems() {
  return inventoryItems.filter(
    (item) => item.quantity <= item.reorderPoint / 2
  );
}

function getAwaitingApprovalOrders() {
  return purchaseOrders.filter((order) => order.status === "Awaiting Approval");
}

function getInTransitShipments() {
  return shipments.filter((shipment) => shipment.status === "In Transit");
}

function getDeliveredShipments() {
  return shipments.filter((shipment) => shipment.status === "Delivered");
}

export default function DashboardPage() {
  const lowStockItems = getLowStockItems();
  const criticalItems = getCriticalItems();
  const awaitingApproval = getAwaitingApprovalOrders();
  const inTransit = getInTransitShipments();
  const delivered = getDeliveredShipments();

  const totalOpenSpend = purchaseOrders
    .filter((order) => order.status !== "Delivered")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginTop: 0, fontSize: "36px" }}>Procurement Dashboard</h1>
      <p style={{ fontSize: "18px", color: "#444" }}>
        AI-powered purchasing and inventory control for warehouses and stock rooms.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid #ddd",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "18px" }}>Low Stock Items</h2>
          <div style={{ fontSize: "34px", fontWeight: "bold", margin: "10px 0" }}>
            {lowStockItems.length}
          </div>
          <p style={{ marginBottom: 0, color: "#666" }}>
            Items below reorder point
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid #ddd",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "18px" }}>Critical Items</h2>
          <div style={{ fontSize: "34px", fontWeight: "bold", margin: "10px 0", color: "#b91c1c" }}>
            {criticalItems.length}
          </div>
          <p style={{ marginBottom: 0, color: "#666" }}>
            Items needing urgent review
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid #ddd",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "18px" }}>Pending Approvals</h2>
          <div style={{ fontSize: "34px", fontWeight: "bold", margin: "10px 0", color: "#b45309" }}>
            {awaitingApproval.length}
          </div>
          <p style={{ marginBottom: 0, color: "#666" }}>
            Purchase orders awaiting review
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid #ddd",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "18px" }}>Open Spend</h2>
          <div style={{ fontSize: "34px", fontWeight: "bold", margin: "10px 0" }}>
            ${totalOpenSpend.toFixed(2)}
          </div>
          <p style={{ marginBottom: 0, color: "#666" }}>
            Non-delivered purchase orders
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid #ddd",
          }}
        >
          <h2 style={{ marginTop: 0 }}>AI Priority Actions</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {criticalItems.length > 0 && (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                }}
              >
                <strong>Critical Stock Alert:</strong> {criticalItems
                  .map((item) => `${item.name} (${item.quantity} units)`)
                  .join(", ")}
              </div>
            )}

            {awaitingApproval.length > 0 && (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                }}
              >
                <strong>Approvals Needed:</strong> {awaitingApproval
                  .map((order) => `${order.po} - ${order.vendor}`)
                  .join(", ")}
              </div>
            )}

            {inTransit.length > 0 && (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                }}
              >
                <strong>In Transit:</strong> {inTransit
                  .map((shipment) => `${shipment.po} from ${shipment.vendor}`)
                  .join(", ")}
              </div>
            )}

            {delivered.length > 0 && (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                }}
              >
                <strong>Ready for Receiving:</strong> {delivered
                  .map((shipment) => `${shipment.po} from ${shipment.vendor}`)
                  .join(", ")}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid #ddd",
          }}
        >
          <h2 style={{ marginTop: 0 }}>System Snapshot</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <strong>Total Inventory Items:</strong> {inventoryItems.length}
            </div>
            <div>
              <strong>Open Purchase Orders:</strong>{" "}
              {purchaseOrders.filter((order) => order.status !== "Delivered").length}
            </div>
            <div>
              <strong>Shipments In Transit:</strong> {inTransit.length}
            </div>
            <div>
              <strong>Delivered Awaiting Check-In:</strong> {delivered.length}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginTop: 0 }}>AI Recommendation</h2>
        <p style={{ marginBottom: 0 }}>
          Prioritize approval for low-stock barcode labels and packing tape. Confirm delivered
          shipments today so inventory counts remain accurate. Amazon Business remains the
          preferred procurement source for general consumables.
        </p>
      </div>
    </main>
  );
}
