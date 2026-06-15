import { cn } from '@energyiq/shared';

interface Props {
  category: string;
}

export function ExpenseCategoryBadge({
  category,
}: Props) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-1 text-xs',
        'bg-[#FBC02D1A] text-[#FBC02D]',
      )}
    >
      {category}
    </span>
  );
}