interface ComplaintsStatusBadgeProps {
  label: string;
  /** Full-opacity hue used for the text; the background reuses it at low opacity. */
  color: string;
}

/** Pill badge for the severity and status columns. */
export function ComplaintsStatusBadge({ label, color }: ComplaintsStatusBadgeProps) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-2xl px-3 py-0.5 text-[10px] font-normal"
      style={{ color, backgroundColor: `${color}26` }}
    >
      {label}
    </span>
  );
}
