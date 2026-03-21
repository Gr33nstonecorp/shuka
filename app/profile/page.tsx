<button
  onClick={async () => {
    if (!profile?.id) {
      alert("No user profile found.");
      return;
    }

    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: profile.id }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.error || "Could not open billing portal.");
      return;
    }

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
    cursor: "pointer",
  }}
>
  Manage Subscription
</button>
