import type { LucideIcon } from 'lucide-react';

interface OrdersStatusBadgeProps {
  label: string;
  /** Full-opacity hue used for the text/icon; the background reuses it at low opacity. */
  color: string;
  /** Leading glyph shown before the label, e.g. a checkmark for "Approved"/"Paid". */
  icon?: LucideIcon;
}

/** Pill badge for the order/payment status columns. */
export function OrdersStatusBadge({ label, color, icon: Icon }: OrdersStatusBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-2xl px-3 py-0.5 text-[10px] font-normal"
      style={{ color, backgroundColor: `${color}26` }}
    >
      {Icon && <Icon className="h-2.5 w-2.5" aria-hidden="true" />}
      {label}
    </span>
  );
}
