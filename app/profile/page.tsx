import { createClient } from "@supabase/supabase-js";

export default async function ProfilePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginTop: 0 }}>Profile / Plans</h1>
      <button
  onClick={async () => {
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
    });
    const data = await res.json();
    window.location.href = data.url;
  }}
  style={{
    marginTop: "20px",
    padding: "12px 16px",
    background: "#111827",
    color: "white",
    borderRadius: "10px",
    border: "none",
    fontWeight: "700",
  }}
>
  Manage Subscription
</button>
      <p style={{ color: "#6b7280" }}>
        Quick admin view of user plans while you finish billing automation.
      </p>

      <div style={{ display: "grid", gap: "14px", marginTop: "20px" }}>
        {(profiles || []).map((profile: any) => (
          <div
            key={profile.id}
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <div style={{ fontWeight: 800 }}>{profile.email || "No email"}</div>
            <div style={{ color: "#6b7280", marginTop: "6px", fontSize: "14px" }}>
              Plan: {profile.plan || "starter"}
            </div>
            <div style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
              Stripe Customer: {profile.stripe_customer_id || "—"}
            </div>
            <div style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
              Stripe Subscription: {profile.stripe_subscription_id || "—"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
