import type { ReactNode } from 'react';
import { cn } from '@energyiq/shared';

interface OrderDetailSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/** A titled block used inside the order-detail cards (Info, Items, Supplier, …). */
export function OrderDetailSection({ title, children, className }: OrderDetailSectionProps) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
