import { Check, CircleCheck } from 'lucide-react';
import { cn } from '@energyiq/shared';

export interface WhitelistableDistributor {
  id: string;
  name: string;
  tier?: string;
}

interface ProductDistributorWhitelistRowProps {
  distributor: WhitelistableDistributor;
  checked: boolean;
  onToggle: (id: string) => void;
}

/** One row of the Access Control step's distributor-whitelist search results. */
export function ProductDistributorWhitelistRow({ distributor, checked, onToggle }: ProductDistributorWhitelistRowProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(distributor.id)}
      aria-pressed={checked}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-foreground/20 px-4 py-3.5 text-left transition-colors hover:border-brand/50"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-7.25 w-7.25 shrink-0 items-center justify-center rounded-full bg-[#6161611A] text-xs font-semibold text-foreground">
          {distributor.name.charAt(0).toUpperCase()}
        </span>
        <span className="truncate text-sm font-medium text-foreground">{distributor.name}</span>
        {distributor.tier && (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-[#FB8C1C] bg-[#FB8C1C4D] px-2 py-1 text-[10px] text-[#FB8C1C]">
            <CircleCheck className="h-2.5 w-2.5" />
            {distributor.tier}
          </span>
        )}
      </div>
      <span
        className={cn(
          'flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px] border',
          checked ? 'border-brand bg-brand' : 'border-foreground/60',
        )}
      >
        {checked && <Check className="h-2.5 w-2.5 text-[#121212]" strokeWidth={4} />}
      </span>
    </button>
  );
}
