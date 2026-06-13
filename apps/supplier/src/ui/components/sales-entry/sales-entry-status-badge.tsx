interface SalesEntryStatusBadgeProps {
  label: string;
  /** Full-opacity hue for the text; the background reuses it at low opacity. */
  color: string;
}

/** Pill badge for a sales row's clearance status (e.g. "Cleared"). */
export function SalesEntryStatusBadge({ label, color }: SalesEntryStatusBadgeProps) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-2xl px-3 py-0.5 text-[10px] font-normal"
      style={{ color, backgroundColor: `${color}26` }}
    >
      {label}
    </span>
  );
}
