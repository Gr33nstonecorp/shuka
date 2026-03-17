type StatusBadgeProps = {
  label: string;
};

export default function StatusBadge({ label }: StatusBadgeProps) {
  const value = label.toLowerCase();

  let background = "#e5e7eb";
  let color = "#111827";

  if (value.includes("approved") || value.includes("preferred")) {
    background = "#dcfce7";
    color = "#166534";
  } else if (value.includes("generated") || value.includes("pending")) {
    background = "#fef3c7";
    color = "#92400e";
  } else if (value.includes("rejected")) {
    background = "#fee2e2";
    color = "#991b1b";
  } else if (value.includes("shipped")) {
    background = "#dbeafe";
    color = "#1d4ed8";
  }

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        background,
        color,
      }}
    >
      {label}
    </span>
  );
}
