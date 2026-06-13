import type { ReactNode } from 'react';

/** Full-width pill control shared by the order-form inputs (info + delivery contact). */
export const ORDER_FIELD_CLASSES =
  'h-14 w-full rounded-full border border-[#FFFFFF33] bg-transparent px-6 text-sm text-foreground';

interface CreateOrderFieldProps {
  label: string;
  children: ReactNode;
}

/** A labelled form control used in the Order Information card. */
export function CreateOrderField({ label, children }: CreateOrderFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
