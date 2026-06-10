import type { ReactNode } from 'react';

interface OrderDetailRowProps {
  label: string;
  /** A plain string (rendered bold) or a node such as a status pill. */
  value: ReactNode;
}

/** Label on the left, value on the right (space-between). */
export function OrderDetailRow({ label, value }: OrderDetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-normal text-foreground">{label}</span>
      {typeof value === 'string' ? (
        <span className="text-sm font-semibold text-foreground">{value}</span>
      ) : (
        value
      )}
    </div>
  );
}
