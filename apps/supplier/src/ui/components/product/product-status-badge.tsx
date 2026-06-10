import { cn } from '@energyiq/shared';
import type { ProductStatus } from '@/ui/pages/product/mocks';

const STATUS_STYLE: Record<ProductStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: 'bg-success/20', text: 'text-success', label: 'Active' },
  inactive: { bg: 'bg-danger/20',  text: 'text-danger',  label: 'Inactive' },
  draft:    { bg: 'bg-foreground/10', text: 'text-muted-foreground', label: 'Draft' },
};

export function ProductStatusBadge({ value, className }: { value: ProductStatus; className?: string }) {
  const s = STATUS_STYLE[value];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[14px] px-3 py-1 text-xs font-semibold whitespace-nowrap',
        s.bg,
        s.text,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
