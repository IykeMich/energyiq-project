import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const CHIPS = ['Status', 'Tier'] as const;

export function DistributorFilterBar() {
  return (
    <div className="bg-surface-card rounded-[18px] px-4 py-3 flex flex-wrap items-center gap-3 self-start">
      <div className="flex items-center gap-2 text-xs font-medium text-foreground mr-2">
        <span className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-foreground" />
        </span>
        Filter By:
      </div>
      {CHIPS.map((label) => (
        <button
          key={label}
          type="button"
          className="h-7 px-3 rounded-full bg-foreground/10 text-foreground text-xs font-medium flex items-center gap-2"
        >
          {label}
          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
          <ChevronDown className="w-3 h-3" />
        </button>
      ))}
    </div>
  );
}
