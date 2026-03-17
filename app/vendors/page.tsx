import { createClient } from "@supabase/supabase-js";

export default async function VendorsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: vendors, error } = await supabase
    .from("vendor_sources")
    .select("*")
    .eq("active", true)
    .order("default_ai_score", { ascending: false });

  if (error) {
    return (
      <main>
        <h1>Vendor Sources</h1>
        <p>Error loading vendors: {error.message}</p>
      </main>
    );
  }

  return (
    <main>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>
          Vendor Sources
        </h1>
        <p style={{ color: "#6b7280" }}>
          Supplier sources currently available to Shuka.
        </p>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {(vendors || []).map((vendor: any) => (
          <div
            key={vendor.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <strong style={{ fontSize: "18px" }}>{vendor.name}</strong>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  background: "#dbeafe",
                  color: "#1d4ed8",
                }}
              >
                {vendor.vendor_type}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginTop: "14px",
              }}
            >
              <div>
                <div style={{ color: "#6b7280", fontSize: "13px" }}>Category</div>
                <div style={{ fontWeight: 700 }}>{vendor.category}</div>
              </div>
              <div>
                <div style={{ color: "#6b7280", fontSize: "13px" }}>Default AI Score</div>
                <div style={{ fontWeight: 700 }}>{vendor.default_ai_score}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
