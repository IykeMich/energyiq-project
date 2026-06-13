interface AuditLogsStatusBadgeProps {
  label: string;
  /** Full-opacity hue for the text; the background reuses it at low opacity. */
  color: string;
}

/** Pill badge for an audit entry's outcome (Success / Auto / Failed). */
export function AuditLogsStatusBadge({ label, color }: AuditLogsStatusBadgeProps) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-2xl px-3 py-0.5 text-[10px] font-normal"
      style={{ color, backgroundColor: `${color}26` }}
    >
      {label}
    </span>
  );
}
